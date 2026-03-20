# Google Forms Backend Server

This is the backend server for the Google Forms integration with Google Sheets.

## Setup Instructions

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Create a Google Sheet and share it with the service account
4. Update the SPREADSHEET_ID in the `.env` file
5. Start the server: `npm start` or `node server.js`

## Environment Variables

Create a `.env` file with the following variables:

```
SPREADSHEET_ID=your_actual_spreadsheet_id_here
PORT=5002
```

## API Endpoints

- `POST /submit` - Submit form data to Google Sheets
- `GET /health` - Health check endpoint

## Testing

You can test the server with the provided test scripts:

```bash
node test-auth.js    # Test authentication
node test-sheets.js  # Test sheets integration
node test-server.js  # Test server endpoints
```