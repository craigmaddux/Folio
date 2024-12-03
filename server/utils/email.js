const nodemailer = require('nodemailer');
const axios = require('axios');
// Logic App URL
const LOGIC_APP_URL = 'https://prod-18.eastus2.logic.azure.com:443/workflows/efd664f8eced40a9b375c3a65559197a/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=VltLAaPCHjN8zgBXYXvitRLri5uAConzmBzwMfYoXI4';



// Function to send an email
const sendValidationEmail = async (to, validationCode) => {
  try {
    
    // JSON Payload
    const payload = {
      email: to,
      validationCode: validationCode,
      context: {
        source: 'LeafQuill Server',
        timestamp: new Date().toISOString(),
      },
    };

    const response = await axios.post(LOGIC_APP_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Logic App Response:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};


module.exports = { sendValidationEmail };
