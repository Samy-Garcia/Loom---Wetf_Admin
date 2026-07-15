import express from "express";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.route("/")
    .get(categoryController.getAll)
    .post(categoryController.create);

router.route("/:id")
    .get(categoryController.getById)
    .put(categoryController.update)
    .delete(categoryController.delete);

export default router;
