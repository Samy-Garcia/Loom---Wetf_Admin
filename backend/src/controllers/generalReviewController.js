import generalReviewModel from "../models/generalReview.js";

const generalReviewController = {}

generalReviewController.createGeneralReview = async (req, res) => {
    try {
        const {ranking, title, experience, type, details, client_id} = req.body;
        const newGeneralReview = new generalReviewModel({
            ranking,
            title,
            experience,
            type,
            details,
            client_id
        });
        await newGeneralReview.save();
        res.status(201).json({ message: "General review created successfully", generalReview: newGeneralReview });
    } catch (error) {
        console.log("Error creating general review:", error);
        res.status(500).json({ message: "Error creating general review" });
    }
};

generalReviewController.getGeneralReviews = async (req, res) => {
    try {
        const generalReviews = await generalReviewModel.find();
        res.status(200).json(generalReviews);
    } catch (error) {
        console.log("Error fetching general reviews:", error);
        res.status(500).json({ message: "Error fetching general reviews" });
    }
};

generalReviewController.deleteGeneralReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGeneralReview = await generalReviewModel.findByIdAndDelete(id);
        if (!deletedGeneralReview) {
            return res.status(404).json({ message: "General review not found" });
        }
        res.status(200).json({ message: "General review deleted successfully" });
    } catch (error) {
        console.log("Error deleting general review:", error);
        res.status(500).json({ message: "Error deleting general review" });
    }
};

generalReviewController.updateGeneralReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { ranking, title, experience, type, details } = req.body;
        const updatedGeneralReview = await generalReviewModel.findByIdAndUpdate(
            id,
            { ranking, title, experience, type, details },
            { new: true }
        );  
        if (!updatedGeneralReview) {
            return res.status(404).json({ message: "General review not found" });
        }
        res.status(200).json({ message: "General review updated successfully", generalReview: updatedGeneralReview });
    } catch (error) {
        console.log("Error updating general review:", error);
        res.status(500).json({ message: "Error updating general review" });
    }
};

export default generalReviewController;