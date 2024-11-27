import express from "express";
import {
  PlanModel,
  TaskModel,
  AuthorModel,
  PriorityModel,
} from "../models/index.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token is not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Token is not valid" });
  }
};

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await AuthorModel.findById(req.userId).select("-password"); // Tìm user bằng userId và loại bỏ trường password

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        gmail: user.gmail,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const { gmail, name, password } = req.body;

  if (!gmail || !name || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing email, name, or password" });
  }

  try {
    const existingUser = await AuthorModel.findOne({ gmail });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new AuthorModel({
      name,
      gmail,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .status(201)
      .json({ success: true, message: "Registration successful", accessToken });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing email or password" });
  }

  try {
    const user = await AuthorModel.findOne({ gmail });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
