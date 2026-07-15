import express from "express";
import registerClientController from "../controllers/registerClientController.js";
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
    .post(upload.single("image"), registerClientController.register)
    .get(registerClientController.getAll);
router.route("/verifyCodeEmail").post(registerClientController.verifyCode);
router.route("/:id")
    .get(registerClientController.getById)
    .put(registerClientController.update)
    .delete(registerClientController.delete);

export default router;