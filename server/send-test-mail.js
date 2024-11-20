const nodemailer = require('nodemailer');
// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use 'Gmail' for Google's SMTP
    auth: {
      user: 'craig.maddux@gmail.com', // Replace with your Gmail address
      pass: 'R3adMa1l',    // Replace with your app-specific password
    },
  });

transporter.verify((error, success) => {
    if (error) {
      console.error('Transporter verification failed:', error);
    } else {
      console.log('Transporter verified successfully!');
    }
  });
  
  const runTest = async () => {
    try {
      console.log('Starting email test...');
      const info = await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test email sent using Nodemailer!',
      });
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  runTest();
  
