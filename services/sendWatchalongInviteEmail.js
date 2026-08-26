const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendWatchalongInviteEmail = async (recipient, host, watchalong) => {
  await transporter.sendMail({
    from: `Watchalong <${process.env.EMAIL_USER}>`,
    to: recipient.email,
    subject: `You're invited to watch ${watchalong.showName}!`,
    text: `Hi ${recipient.username}, ${host.username} invited you to watch ${watchalong.showName} on ${new Date(watchalong.scheduledAt).toLocaleString()}. Join here: ${process.env.BASE_URL}/watchalongs/invites`,
  });
};

module.exports = sendWatchalongInviteEmail;