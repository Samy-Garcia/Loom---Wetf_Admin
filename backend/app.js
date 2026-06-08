import express from "express";


import cors from "cors"

import cookieParser from "cookie-parser"

import registerAdminRoutes from "./src/routes/registerAdmin.js"
import loginAdminRoutes from "./src/routes/loginAdmin.js"
import registerClientRoutes from "./src/routes/registerClient.js"
import loginClientRoutes from "./src/routes/loginClient.js"
import registerEmployeeRoutes from "./src/routes/registerEmployee.js"
import loginEmployeeRoutes from "./src/routes/loginEmployee.js"
import productRoutes from "./src/routes/product.js"
import supplierRoutes from "./src/routes/supplier.js"
import productCustomRoutes from "./src/routes/productCustom.js"
import cartRoutes from "./src/routes/cart.js"
import generalReviewRoutes from "./src/routes/generalReview.js"

//creo una constante app que es una instancia de express, esto me permite usar todas las funcionalidades de express para crear mi servidor y manejar rutas, middlewares, etc.

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    //permitir el envio de cookies y credenciales
    credentials: true
}));

app.use(cookieParser());

//para que la api acepte json
app.use(express.json());

//rutas

//admin
app.use("/api/registerAdmin", registerAdminRoutes);
app.use("/api/loginAdmin", loginAdminRoutes);
//client
app.use("/api/registerClient", registerClientRoutes)
app.use("/api/loginClient", loginClientRoutes)
//employee
app.use("/api/registerEmployee", registerEmployeeRoutes)
app.use("/api/loginEmployee", loginEmployeeRoutes)
//product
app.use("/api/products", productRoutes)
//supplier
app.use("/api/suppliers", supplierRoutes)
//productCustom
app.use("/api/productCustom", productCustomRoutes);
//cart
app.use("/api/carts", cartRoutes);
//generalReview
app.use("/api/generalReviews", generalReviewRoutes);

export default app;