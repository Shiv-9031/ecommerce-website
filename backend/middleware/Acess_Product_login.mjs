import ErrorHandler from "../utils/ErrorHandler.mjs";
import CatchAsyncError from "./CatchAsyncError.mjs";
import jwt from "jsonwebtoken";
import User from "../model/UserSchema.mjs";

export const Is_Authenticated_User = CatchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return next(new ErrorHandler("please login", 401));
  }

  const decode_data = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decode_data.id);
  next();
});

export const Is_Authorized_Roles=(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role))
    {
     return next( new ErrorHandler(`Roles:${req.user.role} is not allowed to use resource`,403));
    }
    next();
  }
}
