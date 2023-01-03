import express from 'express';
import {newOrder,myOrder,getSingleOrder,getAllProduct, updateAllProduct, deleteOrderProduct} from '../controllers/orderController.mjs'
import {
    Is_Authenticated_User,
    Is_Authorized_Roles,
  } from "../middleware/Acess_Product_login.mjs";

const orderRouter=express.Router();

orderRouter.route('/order/new').post(Is_Authenticated_User,newOrder);

orderRouter.route('/order/new/me').get(Is_Authenticated_User,myOrder);

orderRouter.route('/order/new/:id').get(Is_Authenticated_User,Is_Authorized_Roles('admin'),getSingleOrder);

orderRouter.route('/Admin/order/').get(Is_Authenticated_User,Is_Authorized_Roles('admin'),getAllProduct);

orderRouter.route('/Admin/order/:id').put(Is_Authenticated_User,Is_Authorized_Roles('admin'),updateAllProduct).delete(Is_Authenticated_User,Is_Authorized_Roles('admin'),deleteOrderProduct);


export default orderRouter;