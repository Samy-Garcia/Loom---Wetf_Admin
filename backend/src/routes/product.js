import express from "express";
import productController from "../controllers/productController.js";
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
    .post(upload.array("images"), productController.createProduct)
    .get(productController.getProducts);

router.route("/:id")
    .get(productController.getProductById)
    .put(upload.array("images"), productController.updateProduct)
    .delete(productController.deleteProduct);

export default router;