import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { AuthorModel } from "../models/index.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendExpirationEmail = async (uid, endDate, payload) => {
  try {
    const author = await AuthorModel.findOne({ uid: uid });
    if (!author) {
      console.error("Author not found");
      return;
    }

    const mailOptions = {
      from: "THÔNG BÁO TỪ TASK VIEWS",
      to: author.gmail,
      subject: "Thông báo hết hạn kế hoạch",
      text: `Chú ý! Kế hoạch ${payload} của bạn sẽ hết hạn vào ngày ${endDate}. Hãy hoàn thành công việc trước thời điểm này.`,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

export default sendExpirationEmail;
