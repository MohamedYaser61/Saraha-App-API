import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "module";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, "..", ".env") });

const sendEmail = async ({ to, subject, html }) => {
  //sending email
  const transporter = nodemailer.createTransport({
    host: process.env.Email_Host,
    port: process.env.Email_Port,
    secure: true,
    auth: {
      user: process.env.Email_From,
      pass: process.env.Email_Pass,
    },
  });
  const info = await transporter.sendMail({
    from: process.env.Email_From,
    to,
    subject,
    html,
  });
  console.log(info);
};

export const subjectEmail = {
  register: "Welcome to Our Service - Verify Your Email",
  reset: "Password Reset Request",
};
export default sendEmail;
