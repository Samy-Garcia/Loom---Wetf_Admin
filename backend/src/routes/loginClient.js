import express from "express";
import loginClientController from "../controllers/loginClientController.js";

const router = express.Router();

router.route("/").post(loginClientController.login);

export default router;