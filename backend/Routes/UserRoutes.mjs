import express from "express";
import {
  registerUser,
  loginUser,
  loggout,
  forgot_password,
  reset_password,
  user_detail,
  update_password,
  update_profile,
  all_user_detail,
  update_profile_role,
  delete_profile,
} from "../controllers/UserController.mjs";
import {
  Is_Authenticated_User,
  Is_Authorized_Roles,
} from "../middleware/Acess_Product_login.mjs";

const Routes = express.Router();

Routes.route("/register").post(registerUser);

Routes.route("/login").post(loginUser);

Routes.route("/loggout").get(loggout);

Routes.route("/me").get(Is_Authenticated_User, user_detail);

Routes.route("/password/update").put(Is_Authenticated_User, update_password);

Routes.route("/update/profile").put(Is_Authenticated_User, update_profile);

Routes.route("/password/forgot").post(forgot_password);

Routes.route("/password/reset:token").put(reset_password);

Routes.route("/Admin/me").get(
  Is_Authenticated_User,
  Is_Authorized_Roles("admin"),
  all_user_detail
);

Routes.route("/Admin/update_user_detail/:id")
  .put(Is_Authenticated_User, Is_Authorized_Roles("admin"), update_profile_role)
  .delete(Is_Authenticated_User, Is_Authorized_Roles("admin"), delete_profile);

export default Routes;
