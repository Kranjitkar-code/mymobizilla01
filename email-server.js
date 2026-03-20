import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.in',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const {
      to,
      customerName,
      trackingCode,
      deviceInfo,
      estimatedCost,
      customerEmail,
      customerPhone,
      description,
      issue
    } = req.body;

    // Use customer email if provided, otherwise use admin email
    const recipientEmail = customerEmail || to || process.env.ADMIN_EMAIL || 'mobizillaindia@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'support@mobizilla.com';

    // Also send to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'mobizillaindia@gmail.com';
    const recipients = recipientEmail === adminEmail ? adminEmail : `${recipientEmail}, ${adminEmail}`;

    // Parse description for service type
    const isBuyback = description?.includes('BUYBACK') || issue?.includes('BUYBACK');
    const serviceType = isBuyback ? 'BUYBACK' : 'REPAIR';
    const serviceIcon = isBuyback ? '💰' : '🔧';

    // Extract details from description
    let problemOrCondition = issue || '';
    let additionalInfo = '';
    let address = '';

    if (description) {
      const lines = description.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        if (line.includes('PROBLEM:') || line.includes('CONDITION:')) {
          problemOrCondition = line.split(':')[1]?.trim() || problemOrCondition;
        } else if (line.includes('ADDITIONAL DETAILS:')) {
          additionalInfo = line.split(':')[1]?.trim() || '';
        } else if (line.includes('ADDRESS:')) {
          address = line.split(':')[1]?.trim() || '';
        }
      });
    }

    const mailOptions = {
      from: `"Mobizilla Support" <${fromEmail}>`,
      to: recipients,
      subject: `${serviceIcon} ${serviceType} Request Confirmed - ${trackingCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px;">${serviceIcon} Mobizilla</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">${serviceType} Request Confirmed!</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px; background-color: #f9f9f9;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Hi ${customerName}! 👋</h2>
                      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                        Great news! Your ${serviceType.toLowerCase()} request has been successfully confirmed. 
                        ${isBuyback ? 'Our team will evaluate your device and get back to you with the best offer.' : 'Our expert technicians will take great care of your device.'}
                      </p>
                      
                      <!-- Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">📋 ${serviceType} Details</h3>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Service Type:</strong> 
                              <span style="color: ${isBuyback ? '#28a745' : '#667eea'}; font-weight: bold;">${serviceType}</span>
                            </p>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Tracking Code:</strong> 
                              <span style="color: #667eea; font-weight: bold; font-size: 18px;">${trackingCode}</span>
                            </p>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Device:</strong> ${deviceInfo}
                            </p>
                            ${problemOrCondition ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>${isBuyback ? 'Device Condition' : 'Problem'}:</strong> ${problemOrCondition}
                            </p>` : ''}
                            ${additionalInfo && additionalInfo !== 'None' ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>Additional Details:</strong> ${additionalInfo}
                            </p>` : ''}
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Estimated ${isBuyback ? 'Value' : 'Cost'}:</strong> 
                              <span style="color: #28a745; font-weight: bold;">₨${estimatedCost.toLocaleString()}</span>
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                            <h4 style="color: #333333; margin: 15px 0 10px 0; font-size: 16px;">👤 Contact Information</h4>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Name:</strong> ${customerName}
                            </p>
                            ${customerPhone ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>Phone:</strong> ${customerPhone}
                            </p>` : ''}
                            ${customerEmail ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>Email:</strong> ${customerEmail}
                            </p>` : ''}
                            ${address ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>Address:</strong> ${address}
                            </p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Next Steps -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f4fd; border-radius: 6px; margin: 20px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <h4 style="color: #1976d2; margin: 0 0 15px 0; font-size: 16px;">🔄 What's Next?</h4>
                            <ul style="color: #666666; margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                              ${isBuyback ? `
                              <li>Our team will review your device details within 24 hours</li>
                              <li>We'll contact you with our best buyback offer</li>
                              <li>Once accepted, we'll schedule a convenient pickup time</li>
                              <li>Get instant payment upon device verification</li>
                              ` : `
                              <li>Our team will contact you within 24 hours</li>
                              <li>Device pickup will be scheduled at your convenience</li>
                              <li>You'll receive regular updates via SMS and email</li>
                              <li>Fast and reliable repair service guaranteed</li>
                              `}
                            </ul>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #666666; font-size: 14px; margin: 30px 0 0 0;">
                        Need help? Reply to this email or call us at <strong>+977 9841000000</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #333333; padding: 20px; text-align: center;">
                      <p style="color: #ffffff; margin: 0; font-size: 14px;">
                        © 2025 Mobizilla. Trusted device repair services.
                      </p>
                      <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">
                        This is an automated email. Please do not reply directly to this message.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `Hi ${customerName}!

Your repair booking has been confirmed!

Tracking Code: ${trackingCode}
Device: ${deviceInfo}
${issue ? `Issue: ${issue}` : ''}
${description ? `Description: ${description}` : ''}
Estimated Cost: ₨${estimatedCost}

Customer Details:
Name: ${customerName}
${customerPhone ? `Phone: ${customerPhone}` : ''}
${customerEmail ? `Email: ${customerEmail}` : ''}

Track your repair: https://mobizilla.com/track/${trackingCode}

What's Next?
- Our team will contact you within 24 hours
- Device pickup will be scheduled at your convenience
- You'll receive regular updates via SMS and email
- Fast and reliable repair service guaranteed

Need help? Call us at +977 9731852323

© 2025 Mobizilla
`
    };

    console.log(`📧 Sending email to: ${recipientEmail}`);
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', info.messageId);
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
});

// Send contact form email endpoint
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      service,
      message,
      to
    } = req.body;

    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'support@mobizilla.com';
    const adminEmail = to || process.env.ADMIN_EMAIL || 'mobizillaindia@gmail.com';

    const mailOptions = {
      from: `"Mobizilla Contact Form" <${fromEmail}>`,
      to: adminEmail,
      replyTo: customerEmail,
      subject: `📬 New Contact Form Submission - ${service}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px;">📬 Mobizilla</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">New Contact Form Submission</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">New Contact Request</h2>
                      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                        You have received a new message through the contact form.
                      </p>
                      
                      <!-- Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">👤 Contact Details</h3>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Name:</strong> ${customerName}
                            </p>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #667eea;">${customerEmail}</a>
                            </p>
                            ${customerPhone ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>Phone:</strong> <a href="tel:${customerPhone}" style="color: #667eea;">${customerPhone}</a>
                            </p>` : ''}
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Service Interest:</strong> <span style="color: #667eea; font-weight: bold;">${service}</span>
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                            <h4 style="color: #333333; margin: 15px 0 10px 0; font-size: 16px;">💬 Message</h4>
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 3px solid #667eea;">
                              <p style="margin: 0; color: #666666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Action Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        <tr>
                          <td align="center">
                            <a href="mailto:${customerEmail}?subject=Re: Your inquiry about ${service}" 
                               style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">
                              Reply to Customer
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #999999; font-size: 12px; margin: 30px 0 0 0; text-align: center;">
                        This email was sent from the Mobizilla contact form at ${new Date().toLocaleString()}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #333333; padding: 20px; text-align: center;">
                      <p style="color: #ffffff; margin: 0; font-size: 14px;">
                        © 2025 Mobizilla. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Contact Details:
Name: ${customerName}
Email: ${customerEmail}
${customerPhone ? `Phone: ${customerPhone}` : ''}
Service Interest: ${service}

Message:
${message}

---
This email was sent from the Mobizilla contact form at ${new Date().toLocaleString()}
      `
    };

    console.log(`📧 Sending contact form email to: ${adminEmail}`);
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Contact email sent successfully:', info.messageId);
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Contact email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n📧 Email Server Ready on http://localhost:${PORT}`);
  console.log(`📮 SMTP: ${process.env.SMTP_HOST || 'smtp.zoho.in'} | From: ${process.env.SMTP_USER || 'support@mobizilla.com'}\n`);
});

export default app;
