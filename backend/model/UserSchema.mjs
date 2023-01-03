import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import CatchAsyncError from "../middleware/CatchAsyncError.mjs";
const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxlength: [30, "name must not greater than 30 character"],
    minlength: [4, "name ought to be at least 4 character"],
  },
  email: {
    type: String,
    required: [true, "please enter your e-mail"],
    unique: true,
    validate: [validator.isEmail, "please enter valid e-mail"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: [6, "password length should be minimum of 6 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: false,
    ref: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

User.pre("save", async function () {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//jwt token

User.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare password

User.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//generating password reset token

User.methods.getResetPasswordToken = async function() {
  
  const reset_token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(reset_token)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  console.log(this.resetPasswordToken);
  return reset_token;
};


export default mongoose.model("user", User);
