const cron = require('node-cron');
const { generateAndSendDailyReport } = require('../services/reportService');

const initCronJobs = () => {
  // '0 21 * * *' = Exactly 9:00 PM every day
  // '0 22 * * *' = Exactly 10:00 PM every day
  
  cron.schedule('59 23 * * *', () => {
    console.log("⏰ Triggering Daily Order Report...");
    generateAndSendDailyReport();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // 🌟 Forces the server to use India time
  });

  console.log("⏳ Cron jobs initialized. Daily report scheduled for 11:59 PM IST.");
};

module.exports = initCronJobs;