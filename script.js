const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  // Get the form data from the request body
  const formData = req.body;
  console.log('AAAAAA',formData);
  // Load the credentials file
  const credentials = require('./credentials.json'); // Replace with the path to your credentials file

  // Configure the Google Sheets API client
  const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  // ID of the Google Sheet to append the data
  const spreadsheetId = '1fs3qQZnL613YfySaX9VzEmQqLIRlxzmVX0QgTfNVOAc'; // Replace with your Google Sheet ID

  // Append the new form data to the Google Sheet
  client.authorize((err) => {
    if (err) {
      console.error('Error authorizing Google Sheets API:', err);
      return res.sendStatus(500);
    }

    const sheets = google.sheets({ version: 'v4', auth: client });

    sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: 'Sheet1', // Replace with your sheet name or range
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[formData.department, formData.year, formData.name, formData.mentor, formData.notes]],
        },
      },
      (err, response) => {
        if (err) {
          console.error('Error appending data to Google Sheets:', err);
          return res.sendStatus(500);
        }

        // Send a response indicating the form data was successfully saved
        res.sendStatus(200);
      }
    );
  });
});
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
