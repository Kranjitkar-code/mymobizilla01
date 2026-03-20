import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "service-account.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function testAuthentication() {
  try {
    console.log('Testing Google Sheets authentication...');
    
    // Get the authenticated client
    const authClient = await auth.getClient();
    console.log('✅ Authentication successful!');
    
    // Get the project ID
    const projectId = await auth.getProjectId();
    console.log('Project ID:', projectId);
    
    // Test creating sheets client
    const sheets = google.sheets({ version: "v4", auth: authClient });
    console.log('✅ Google Sheets client created successfully!');
    
    console.log('\n🎉 All authentication tests passed!');
    console.log('The service account is properly configured and ready to use.');
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.error('Full error:', error);
  }
}

testAuthentication();