import nodemailer from 'nodemailer';

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  auth: {
    user: process.env.GMAIL_USER,   // Your sender Gmail address
    pass: process.env.GMAIL_PASS    // Your Gmail app-specific password
  }
});

export default transporter;
