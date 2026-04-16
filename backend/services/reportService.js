const Order = require('../models/Order'); // Adjust path if your models folder is elsewhere
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');

// Set up the email sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_APP_PASSWORD 
  }
});

const generateAndSendDailyReport = async () => {
  try {
    // 1. Get today's start and end times
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 2. Fetch today's orders
    const todaysOrders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('user', 'name email');

    if (todaysOrders.length === 0) {
      console.log("No orders today. Skipping report.");
      return;
    }

    // 3. Format data for Excel
    const excelData = todaysOrders.map(order => ({
      "Order ID": order._id.toString(),
      "Customer": order.user ? order.user.name : 'Guest',
      "Total Amount": order.totalPrice,
      "Status": order.status,
      "Time Placed": order.createdAt.toLocaleTimeString()
    }));

    // 4. Create the Excel File in Memory
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 5. Send the Email
    await transporter.sendMail({
      from: `"Niali Automated System" <${process.env.EMAIL_USER}>`,
      to: 'ankit.personal11@gmail.com', // 🌟 Change this to Nisha's actual email!
      subject: `Niali Daily Sales Report - ${startOfDay.toLocaleDateString()}`,
      text: `Hello Nisha,\n\nPlease find attached the summary of today's orders.\nTotal orders today: ${todaysOrders.length}.\n\nBest,\nNiali System`,
      attachments: [{
          filename: `Niali_Orders_${Date.now()}.xlsx`,
          content: excelBuffer 
      }]
    });

    console.log("✅ Daily report sent successfully.");
  } catch (error) {
    console.error("❌ Failed to send daily report:", error);
  }
};

module.exports = { generateAndSendDailyReport };