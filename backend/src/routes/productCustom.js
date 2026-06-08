import productCustomController from "../controllers/productCustomController.js";
import express from "express";
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
    .post(upload.array("images"), productCustomController.createProductCustom)
    .get(productCustomController.getProductsCustom);

router.route("/:id")
    .delete(productCustomController.deleteProductCustom)
    .put(upload.array("images"), productCustomController.updateProductCustom);

export default router;
