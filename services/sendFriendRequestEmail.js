const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendFriendRequestEmail = async (recipient, requester) => {
  await transporter.sendMail({
    from: `Watchalong <${process.env.EMAIL_USER}>`,
    to: recipient.email,
    subject: `${requester.username} sent you a friend request`,
    text: `Hi ${recipient.username}, ${requester.username} wants to be your friend on Watchalong. View it here: ${process.env.BASE_URL}/requests`,
  });
};

module.exports = sendFriendRequestEmail;