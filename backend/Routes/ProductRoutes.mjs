import express from 'express'
import {GetAllProduct,createProduct, updateProduct, DeleteProduct, GetProductDetail,create_review}from '../controllers/ProductController.mjs'
import { Is_Authenticated_User, Is_Authorized_Roles } from "../middleware/Acess_Product_login.mjs"
const Routes= express.Router();

Routes.route('/product').get(GetAllProduct);

Routes.route('/Admin/product/new').post(Is_Authenticated_User,Is_Authorized_Roles('admin'),createProduct);

Routes.route('/Admin/product/:id').put(Is_Authenticated_User,Is_Authorized_Roles('admin'),updateProduct).delete(Is_Authenticated_User,Is_Authorized_Roles('admin'),DeleteProduct);
Routes.route('/product/:id').get(GetProductDetail);

Routes.route('/review').put(Is_Authenticated_User,create_review);
export default Routes;
