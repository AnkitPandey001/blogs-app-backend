
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "panduranga042962@gmail.com",
    pass: "wayb ecbm djfe ayyl",
  },
});

export default transporter