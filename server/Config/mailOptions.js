// Function to create mail options for the welcome email
const createMailOptions = (to, username, password) => ({
  from: process.env.GMAIL_USER, // Sender's email address
  to: to, // Recipient's email address
  subject: "Welcome to Our Platform!",
  html: `
      <p>Thank you for signing up!</p>
      <p>Your login credentials are as follows:</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please keep this information safe.</p>
    `,
});

module.exports = createMailOptions;
