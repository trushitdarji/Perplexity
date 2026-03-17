import userModel from "../models/user.model.js";
import { sendMail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "username or email already exists try somthing else",
      success: false,
      err: "user alredy exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  const token = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  await sendMail({
    to: email,
    subject: "Welcome to the perplexity",
    text: "Welcome to the perplexity family! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.",
    html: `<h1>Welcome to the perplexity</h1><p>We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <p>Click the link below to verify your email address:</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${token}">Verify Email</a>
    <p>best regards</p>
    <p>perplexity team</p>
    `,
  });

  res.status(201).json({
    message: "User Registerd successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "invalid email or password",
      success: false,
      err: "user not found",
    });
  }

  const isPassMatch = await user.comparePassword(password);

  if (!isPassMatch) {
    return res.status(400).json({
      message: "invalid password",
      success: false,
      err: "incorrect password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "please verify your email before login",
      success: false,
      err: "email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "login successfull",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "user ntp found",
      success: false,
      err: "user not found",
    });
  }

  res.status(200).json({
    message: "user data",
    success: true,
    user,
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(400).json({
      message: "invalid token",
      success: false,
      err: "user not found",
    });
  }

  user.verified = true;

  await user.save();

  const html = `<h1>Email Verified Successfully</h1><p>Your email has been verified successfully. You can now log in to your account and start using our services.</p>
  <a href="http://localhost:3000/login">Login Now</a>
  <p>Best regards,</p>
  <p>Perplexity Team</p>`;

  res.send(html);
}

export async function resendEmail(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "invalid token",
      success: false,
      err: "invalid token",
    });
  }

  const { email } = req.body;

  const user = await userModel.findOne({email})

  if (!user) {
    return res.status(404).json({
      message: "user not found",
      success: false,
      err: "user not found",
    });
  }

  if (user.verified) {
    return res.status(200).json({
      message: "user already verified",
    });
  }

  await sendMail({
    to: user.email,
    subject: "Welcome to the perplexity",
    text: "Welcome to the perplexity family! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.",
    html: `<h1>Welcome to the perplexity</h1><p>We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <p>Click the link below to verify your email address:</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${token}">Verify Email</a>
    <p>best regards</p>
    <p>perplexity team</p>
    `,
  });

  return res.status(200).json({
    message: "email was sent",
    success: true,
    user,
  });
}
