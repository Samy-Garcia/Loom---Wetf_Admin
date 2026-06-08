import express from 'express';
import registerEmployeeController from '../controllers/registerEmployeeController.js';
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
    .post(registerEmployeeController.register);

router.route("/verifyCode")
    .post(registerEmployeeController.verifyCode);

export default router;