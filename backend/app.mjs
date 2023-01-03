import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//import routes
import ProductRoutes from "./Routes/ProductRoutes.mjs";
import error from "./middleware/Error.mjs";
import UserRoutes from "./Routes/UserRoutes.mjs";
import OrderRoutes from "./Routes/orderRouter.mjs";

app.use("/api/v1", ProductRoutes);

app.use("/api/v1", UserRoutes);
app.use("/api/v1", OrderRoutes);

// for middleware
app.use(error);
export default app;
