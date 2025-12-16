import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ email, status, orderId }) => {
  let subject = "";
  let message = "";

  if (status === "Created") {
    subject = "Order Confirmed Successfully!!";
    message = `Your order ${orderId} has been placed successfully.`;
  } 
  else if (status === "Shipped") {
    subject = "Your Order Has Been Shipped!!!!";
    message = `Good news! Your order ${orderId} is on the way.`;
  } 
  else if (status === "Delivered") {
    subject = "Order Delivered Successfully!! ";
    message = `Your order ${orderId} has been delivered. Thank you for shopping with us!`;
  } 
  else {
    subject = "Order Status Update";
    message = `Your order ${orderId} status is ${status}.`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  await transporter.sendMail(mailOptions);
};


export default sendEmail;