import transporter from "./Email.js";
import { EmailTemplate,Welcome_Email_Template } from '../EmailTemplate/EmailTemplate.js';

const SendCode = async (email, code) => {
    const res = await transporter.sendMail({
        from: '"Blogs APP" <panduranga042962@gmail.com>',
        to: email,
        subject: "Verify Your Email",
        text: "Verify Your Email",
        html: EmailTemplate.replace("{verificationCode}", code),
    });
    console.log("email sent");
};

const Welcome = async (email, name) => {
    const res = await transporter.sendMail({
        from: '"Blogs APP" <panduranga042962@gmail.com>',
        to: email,
        subject: "Verify Your Email",
        text: "Verify Your Email",
        html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log("email sent");
};

export  { SendCode, Welcome };