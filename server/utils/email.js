const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use 'Gmail' for Google's SMTP
  auth: {
    user: 'craig.maddux@gmail.com', // Replace with your Gmail address
    pass: 'R3adM4il',    // Replace with your app-specific password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: 'craig.maddux@gmail.com', // Sender address
      to,                           // Receiver address
      subject,                      // Subject line
      text,                         // Plain text body
      html,                         // HTML body
    });
    console.log('Email sent: %s', info.messageId);
    return info.messageId;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmail };
