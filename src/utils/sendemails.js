import nodemailer from 'nodemailer';

// sender
export const sendEmail = async ({ to, subject, html }) => {
const transporter = nodemailer.createTransport({
  host: 'localhost',
  service: 'gmail',
  port: 465, 
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
})
// recever
const info = await transporter.sendMail({
  from: `"Ecommerce Application" <${process.env.EMAIL}>`,
  to,
  subject,
  html,
});
  if(info.rejected.length > 0) return false ;
    return true
}
