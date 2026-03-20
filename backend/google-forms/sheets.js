import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "service-account.json"), // place your JSON here
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Get SPREADSHEET_ID from environment variables
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "1IhBtaT5vDys-oX8miVSBwMVG7JDWs6e-BQXIOeTDaG4";

/**
 * Append a row of data to the Google Sheet with dynamic field mapping
 * @param {Object} formData - Form data object with key-value pairs
 */
export async function appendRow(formData) {
  try {
    // Get existing headers
    let headers = await getHeaders();
    
    // If no headers exist, create default ones with proper field names for Repair form
    if (!headers || headers.length === 0) {
      headers = [
        "Timestamp", 
        "Name", 
        "Email", 
        "Phone",
        "Device Category",
        "Brand", 
        "Model", 
        "Issue",
        "ServiceType", 
        "Details",
        "Condition",
        "QuoteValue"
      ];
      await createHeaders(headers);
    }
    
    // Extract all keys from formData that aren't already in our default set
    const formDataKeys = Object.keys(formData).filter(
      key => !["timestamp", "name", "email", "phone", "deviceCategory", "brand", "model", "issue", "serviceType", "details", "condition", "quoteValue"].includes(key) && key !== "timestamp"
    );
    
    // Add new headers if needed
    let updatedHeaders = [...headers];
    let headersUpdated = false;
    
    // Add any additional fields that aren't in the default set
    for (const key of formDataKeys) {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
      if (!updatedHeaders.includes(formattedKey)) {
        updatedHeaders.push(formattedKey);
        headersUpdated = true;
      }
    }
    
    // Update headers if new fields were added
    if (headersUpdated) {
      await updateHeaders(updatedHeaders);
      headers = updatedHeaders;
    }
    
    // Create row data based on headers
    const timestamp = formData.timestamp || new Date().toISOString();
    
    // Map form data to row based on headers
    const finalRowData = headers.map(header => {
      // Map header names to formData keys
      const fieldMap = {
        "Timestamp": "timestamp",
        "Name": "name",
        "Email": "email",
        "Phone": "phone",
        "Device Category": "deviceCategory",
        "Brand": "brand",
        "Model": "model",
        "Issue": "issue",
        "ServiceType": "serviceType",
        "Details": "details",
        "Condition": "condition",
        "QuoteValue": "quoteValue"
      };
      
      // Check if header has a mapped field name
      if (fieldMap[header]) {
        if (header === "Timestamp") return timestamp;
        return formData[fieldMap[header]] || "";
      }
      
      // For additional fields, use the header name directly (converted to lowercase)
      const lowerHeader = header.toLowerCase();
      return formData[lowerHeader] || formData[header] || "";
    });
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:Z", // flexible, automatically expands
      valueInputOption: "USER_ENTERED",
      resource: { values: [finalRowData] },
    });
    
    console.log("Data appended successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error appending row to Google Sheets:", error);
    throw error;
  }
}

/**
 * Get headers from the Google Sheet (first row)
 */
export async function getHeaders() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:Z1",
    });
    
    return response.data.values ? response.data.values[0] : [];
  } catch (error) {
    console.error("Error getting headers from Google Sheets:", error);
    throw error;
  }
}

/**
 * Create headers in the Google Sheet
 * @param {Array} headers - Array of header names
 */
export async function createHeaders(headers) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: [headers] },
    });
    
    console.log("Headers created successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error creating headers in Google Sheets:", error);
    throw error;
  }
}

/**
 * Update headers in the Google Sheet
 * @param {Array} headers - Array of header names
 */
export async function updateHeaders(headers) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: [headers] },
    });
    
    console.log("Headers updated successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error updating headers in Google Sheets:", error);
    throw error;
  }
}