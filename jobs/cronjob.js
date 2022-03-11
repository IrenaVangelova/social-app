const CronJob = require("cron").CronJob;
const nodemailer = require("nodemailer");
const post = require("../models/post");

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "evangeline.hackett44@ethereal.email",
    pass: "b6sG6VfZbFFDaCfmE5",
  },
});

const job = new CronJob("*/5 * * * * *", async () => {
  console.log("---------------------");
  console.log("Running Cron Job");

  var timeNow = new Date();
  timeNow.setMinutes(timeNow.getMinutes() - 2);
  const posted = await post.find({ createdAt: { $gte: timeNow } });
  console.log(posted);

  let messageOptions = {
    from: "test@email.com",
    to: "testexample@gmal.com",
    subject: "Scheduled Email",
    text: `${posted}`,
  };

  transporter.sendMail(messageOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email successfully sent!");
    }
  });
});

job.start();