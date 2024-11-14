const { sendWelcomeEmail } = require('../Config/services');


// Controller function to handle user signup and send the welcome email
const userSignupHandler = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Trigger welcome email after successful signup
    await sendWelcomeEmail(email, username, password);
    res.status(200).json({ message: 'Signup successful! Welcome email sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Signup successful, but failed to send email.' });
  }
};

module.exports = { userSignupHandler };