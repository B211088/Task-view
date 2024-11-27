import cron from "node-cron";
import { checkEndDateAndSendEmail } from "../resolvers/index.js";

// setInterval(() => {
//   console.log("Cron job chạy vào mỗi 10 giây");
//   checkEndDateAndSendEmail();
// }, 3000);

cron.schedule("0 0 * * *", () => {
  console.log("Cron job chạy vào lúc 12:00 AM mỗi ngày");
  checkEndDateAndSendEmail();
});

setInterval(() => {
  console.log("cron server started");
}, 180000);
