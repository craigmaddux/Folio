// server/controllers/messageController.js
const getMessage = (req, res) => {
    console.log('Found message!');
    res.json({ message: "Hello from a structured API!" });
  };
  
  module.exports = { getMessage };
  