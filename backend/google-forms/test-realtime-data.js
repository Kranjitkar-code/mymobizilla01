import { appendRow } from "./sheets.js";

// Test data that simulates a real form submission
const testData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  deviceCategory: "smartphone",
  brand: "Apple",
  model: "iPhone 15 Pro",
  issue: "Screen cracked",
  serviceType: "Repair",
  details: "Customer dropped phone and screen is cracked",
  // Additional fields for buyback
  condition: "Good",
  quoteValue: "₨25,000"
};

console.log("Testing real-time data submission to Google Sheets...");

appendRow(testData)
  .then(response => {
    console.log("✅ Success! Data submitted to Google Sheets");
    console.log("Response:", response.data);
  })
  .catch(error => {
    console.error("❌ Error submitting data to Google Sheets:", error);
  });