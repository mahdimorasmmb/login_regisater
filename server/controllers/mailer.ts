import config from "../config/config";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { Request, Response } from "express";

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.EMAIL, // generated ethereal user
    pass: config.PASSWORD, // generated ethereal password
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req: Request, res: Response) => {
  const { username, userEmail, text, subject } = req.body;

  var email = {
    body: {
      name: username,
      intro: text || "Welcome to Daily Tuition! We're very ",
      outro: "Need help, or have ",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: config.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then((data) => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us.", data });
    })
    .catch((error) => res.status(500).send({ error }));
};
