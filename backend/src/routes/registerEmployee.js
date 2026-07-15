import express from 'express';
import registerEmployeeController from '../controllers/registerEmployeeController.js';
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
    .post(registerEmployeeController.register)
    .get(registerEmployeeController.getAll);

router.route("/verifyCode")
    .post(registerEmployeeController.verifyCode);

router.route("/:id")
    .get(registerEmployeeController.getById)
    .put(registerEmployeeController.update)
    .delete(registerEmployeeController.delete);

export default router;