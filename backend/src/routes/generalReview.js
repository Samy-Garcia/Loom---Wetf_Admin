import express from "express";
import generalReviewController from "../controllers/generalReviewController.js";

const router = express.Router();

router.route("/")
    .post(generalReviewController.createGeneralReview)
    .get(generalReviewController.getGeneralReviews);

router.route("/:id")
    .delete(generalReviewController.deleteGeneralReview)
    .put(generalReviewController.updateGeneralReview);

export default router;