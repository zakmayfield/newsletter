require('dotenv').config();
const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ API running!');
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const template = handlebars.compile(fs.readFileSync('template.html', 'utf8'));

app.post('/webhook', (req, res) => {
  const data = req.body;
  const html = template(data);

  const mailOptions = {
    from: 'zakmayfield.dev@gmail.com',
    to: 'zakmayfield@gmail.com',
    subject: `ZakMayfield.dev's first Newsletter`,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
