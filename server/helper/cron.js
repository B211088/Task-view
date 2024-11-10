import cron from "node-cron";
import { checkEndDateAndSendEmail } from "../resolvers/index.js";

// setInterval(() => {
//   console.log("Cron job chạy vào mỗi 10 giây");
//   checkEndDateAndSendEmail();
// }, 10000); // 10000ms = 10s

cron.schedule("0 0 * * *", () => {
  console.log("Cron job chạy vào lúc 12:00 AM mỗi ngày");
  checkEndDateAndSendEmail();
});
