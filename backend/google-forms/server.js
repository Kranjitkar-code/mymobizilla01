import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { appendRow } from "./sheets.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mobizilla.com";
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER || "no-reply@mobizilla.com";

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',  // Allow all origins for frontend communication
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "../../dist")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Google Forms backend is running",
    timestamp: new Date().toISOString()
  });
});

// POST endpoint to submit enquiry data (MCQ forms)
app.post(["/submit", "/enquiry/submit"], async (req, res) => {
  try {
    console.log("Received enquiry submission:", req.body);
    
    // Add timestamp to the form data if not present
    const formData = {
      timestamp: req.body.timestamp || new Date().toISOString(),
      ...req.body
    };

    // Enrich metadata
    formData.userAgent = formData.userAgent || req.headers["user-agent"] || "";
    formData.ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
    formData.submissionId = formData.submissionId || `ENQ_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Log the data we're about to send
    console.log("Prepared enquiry data:", formData);
    
    // Save to Google Sheets if configured
    if (SPREADSHEET_ID) {
      try {
        await appendRow(formData);
      } catch (sheetErr) {
        console.error("Sheets append failed; continuing with email only:", sheetErr?.message || sheetErr);
      }
    } else {
      console.warn("SPREADSHEET_ID not set - skipping Sheets append.");
    }
    
    // Send email notification to admin
    await sendAdminNotification(formData);
    
    // Send auto-responder to user
    await sendUserAutoResponder(formData);

    res.status(200).json({ 
      success: true, 
      id: formData.submissionId || `ENQ_${Date.now()}`,
      message: "Enquiry submitted successfully!"
    });
  } catch (err) {
    console.error("Error processing enquiry:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error processing enquiry",
      error: err.message 
    });
  }
});

// Setup email transport if SMTP provided
let mailTransport = null;
try {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    mailTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: (process.env.SMTP_USER || process.env.SMTP_PASS) ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    });
  }
} catch (e) {
  console.error("SMTP init error:", e);
}

async function sendEmail({ to, subject, html, text }) {
  if (!mailTransport) {
    console.log("[Email log] To:", to, "Subject:", subject);
    return;
  }
  await mailTransport.sendMail({ from: FROM_EMAIL, to, subject, html, text: text || undefined });
}

// Function to send admin notification email
async function sendAdminNotification(formData) {
  try {
    const subject = `New ${formData.serviceType === 'repair' ? 'Repair' : 'Buyback'} Enquiry - ${formData.deviceType} - ${formData.brand} ${formData.model}`;
    
    let emailBody = `
      <h2>New ${formData.serviceType === 'repair' ? 'Repair' : 'Buyback'} Enquiry</h2>
      
      <h3>Service Details:</h3>
      <ul>
        <li><strong>Service Type:</strong> ${formData.serviceType}</li>
        <li><strong>Device Type:</strong> ${formData.deviceType}</li>
        <li><strong>Brand:</strong> ${formData.brand}</li>
        <li><strong>Model:</strong> ${formData.model}</li>
        <li><strong>Problem/Issue:</strong> ${formData.problem}</li>
    `;
    
    if (formData.problemOther) {
      emailBody += `<li><strong>Additional Details:</strong> ${formData.problemOther}</li>`;
    }
    
    if (formData.serviceType === 'buyback') {
      emailBody += `
        <li><strong>Condition:</strong> ${formData.condition}</li>
        <li><strong>Age:</strong> ${formData.age}</li>
      `;
      if (formData.askingPrice) {
        emailBody += `<li><strong>Asking Price:</strong> ₨${formData.askingPrice}</li>`;
      }
    }
    
    emailBody += `
      </ul>
      
      <h3>Customer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${formData.name}</li>
        <li><strong>Email:</strong> ${formData.email}</li>
        <li><strong>Phone:</strong> ${formData.phone}</li>
      </ul>
      
      <h3>Submission Details:</h3>
      <ul>
        <li><strong>Submission ID:</strong> ${formData.submissionId || 'N/A'}</li>
        <li><strong>Timestamp:</strong> ${formData.timestamp}</li>
        <li><strong>User Agent:</strong> ${formData.userAgent || 'N/A'}</li>
      </ul>
      
      <p><strong>Google Sheet Link:</strong> <a href="https://docs.google.com/spreadsheets/d/${process.env.SPREADSHEET_ID}">View in Google Sheets</a></p>
    `;
    
    await sendEmail({ to: ADMIN_EMAIL, subject, html: emailBody });
    
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
}

// Function to send auto-responder to user
async function sendUserAutoResponder(formData) {
  try {
    const subject = `Thank you for your ${formData.serviceType} request - Mobizilla`;
    
    const emailBody = `
      <h2>Thank you for your ${formData.serviceType} request!</h2>
      
      <p>Dear ${formData.name},</p>
      
      <p>We have received your ${formData.serviceType} request for your ${formData.brand} ${formData.model}. Our team will review your submission and contact you shortly.</p>
      
      <h3>Your Request Details:</h3>
      <ul>
        <li><strong>Service:</strong> ${formData.serviceType === 'repair' ? 'Device Repair' : 'Device Buyback'}</li>
        <li><strong>Device:</strong> ${formData.brand} ${formData.model} (${formData.deviceType})</li>
        <li><strong>Submission ID:</strong> ${formData.submissionId || 'N/A'}</li>
        <li><strong>Date:</strong> ${new Date(formData.timestamp).toLocaleDateString()}</li>
      </ul>
      
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our technical team will review your request</li>
        <li>We will contact you within 24 hours to discuss details</li>
        <li>${formData.serviceType === 'repair' ? 'You will receive a repair quote and timeline' : 'You will receive a buyback quote'}</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us:</p>
      <ul>
        <li>Phone: +977 9841000000</li>
        <li>Email: mobizillaindia@gmail.com</li>
      </ul>
      
      <p>Thank you for choosing Mobizilla!</p>
      
      <p>Best regards,<br>
      The Mobizilla Team</p>
    `;
    
    await sendEmail({ to: formData.email, subject, html: emailBody });
    
  } catch (error) {
    console.error("Error sending user auto-responder:", error);
  }
}

// Serve React app for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Google Forms backend server running on http://localhost:${PORT}`);
  console.log(`SPREADSHEET_ID: ${process.env.SPREADSHEET_ID || 'Not set'}`);
});

export default app;