const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zhangyu9610@gmail.com',
    pass: 'Zy961008'
  }
});

module.exports = transporter;
