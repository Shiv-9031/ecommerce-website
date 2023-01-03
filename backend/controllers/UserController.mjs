import ErrorHandler from "../utils/ErrorHandler.mjs";
import CatchAsyncError from "../middleware/CatchAsyncError.mjs";
import User from "../model/UserSchema.mjs";
import { jwt_login } from "../utils/JwtAuthentication.mjs";
import { send_email } from "../utils/send_Email.mjs";
import crypto from "crypto";

// register user
export const registerUser = CatchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is public id",
      url: "this is avatar url",
    },
  });

  jwt_login(user, 201, res);
});

//login user

export const loginUser = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter valid email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("invalid password or email", 401));
  }
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("invalid password or email", 401));
  }

  jwt_login(user, 200, res);
});

//loggout

export const loggout = CatchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "loggout",
  });
});

//forgot password

export const forgot_password = CatchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler(`No ${req.body.email} is existed`, 404));
  }

  const reset_token = user.getResetPasswordToken();

  user.save({ validatebeforeSave: false });

  const reset_password_url = `${req.protocol}://${req.get(
    "host"
  )}/api/vi/password/reset/${reset_token}`;

  const message = `your reset password token is:-\n\n ${reset_password_url} \n\n
  if you have not request this then, please ignore`;

  try {
    send_email({
      email: user.email,
      subject: `Ecommerce password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `E-mail sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save({ validatebeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

//reset password

export const reset_password = CatchAsyncError(async (req, res, next) => {
  const reset_password_token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: reset_password_token,
    resetPasswordExpire: { $gte: Date.now() },
  });
  console.log(reset_password_token);
  if (!user) {
    next(new ErrorHandler("username is not valid or token expired"), 500);
  }

  if (req.body.password !== req.body.confirmPassword) {
    next(new ErrorHandler("password is not equal password", 500));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

//user detail

export const user_detail = CatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
//update password

export const update_password = CatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatch = await user.comparePassword(req.body.old_password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("wrong old password", 401));
  }

  if (req.body.new_password !== req.body.new_confirm_password) {
    return new ErrorHandler(
      "new password doesn't match with confirm new password",
      400
    );
  }

  user.password = req.body.new_password;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

//update profile
export const update_profile = CatchAsyncError(async (req, res, next) => {
  const updateProfile = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, updateProfile, {
    new: true,
    runvalidators: true,
    usefindmodify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});
//get detail of all user --Admin

export const all_user_detail = CatchAsyncError(async (req, res, next) => {
  const get_all_user = await User.find();

  if (!get_all_user) {
    next(new ErrorHandler("no user is existed", 400));
  }
  res.status(200).json({
    success: true,
    get_all_user,
  });
});

//update user-profile-role
export const update_profile_role = CatchAsyncError(async (req, res, next) => {
  const updateProfile = {
    // name:req.body.name,
    // email:req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, updateProfile, {
    new: true,
    runvalidators: true,
    usefindmodify: false,
  });
  if (!user) {
    next(new ErrorHandler(`no user existed of id ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//delete user-profile-role
export const delete_profile = CatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(new ErrorHandler(`no user exist of id ${req.params.id}`));
  }
  user.remove();
  res.status(200).json({
    success: true,
    user,
  });
});
