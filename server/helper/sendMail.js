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

    const emailHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              background-color: #ffffff;
              width: 100%;
              max-width: 600px;
              margin: 30px auto;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background-color: #007bff;
              color: #ffffff;
              padding: 10px;
              text-align: center;
              border-radius: 6px;
            }
            .email-body {
              text-align: center;
              margin-top: 20px;
              font-size: 16px;
              color: #333333;
            }
            .email-footer {
              margin-top: 20px;
              font-size: 14px;
              color: #777777;
              text-align: center;
            }
            .important {
              font-weight: bold;
              color: #ff0000;
            }
            .date {
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h2>Thông báo hết hạn kế hoạch</h2>
            </div>
            <div class="email-body">
              <p>Chú ý! Kế hoạch <span class="important">"${payload}"</span> của bạn sẽ hết hạn vào ngày <span class="important">${endDate}</span>.</p>
              <p>Hãy hoàn thành công việc trước thời điểm này để tránh trễ tiến độ !.</p>
            </div>
            <div class="email-footer">
              <p>Trân trọng,<br />Team Task Views</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: "THÔNG BÁO TỪ TASK VIEWS",
      to: author.gmail,
      subject: "Thông báo hết hạn kế hoạch",
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

export default sendExpirationEmail;
