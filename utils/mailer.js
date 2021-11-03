const nodemailer = require("nodemailer");

const transporterDetail = {
  host: "mail.mr-zare.ir",
  post: 465,
  secure: true,
  auth: {
    user: "test@mr-zare.ir",
    pass: "testmik0nam",
  },
  tls: {
    rejectUnauthorized: false,
  },
};
exports.sendEmail = (email, fullName, subject, message, fromTitle) => {
  const transporter = nodemailer.createTransport(transporterDetail);
  transporter.sendMail({
    from: `"${fromTitle}" test@mr-zare.ir`,
    to: email,
    subject: subject,
    html: `<h1>${fullName}</h1>
        <p>${message}</p>`,
  });
};
