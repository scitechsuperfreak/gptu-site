// mail.js - Email contact route
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GPTU_EMAIL,
    pass: process.env.GPTU_EMAIL_PASS,
  },
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.GPTU_EMAIL,
    subject: `GPTU Contact from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).send('Email failed');
    res.status(200).send('Email sent');
  });
});

module.exports = router;
