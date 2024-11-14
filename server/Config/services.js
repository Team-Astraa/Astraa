const transporter = require('./transporter')
const createMailOptions = require('./mailOptions');



// Function to send the welcome email after user signup
const sendWelcomeEmail = async (to, username, password) => {
  const mailOptions = createMailOptions(to, username, password);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.response);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = { sendWelcomeEmail };