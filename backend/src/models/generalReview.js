import { Schema, model } from "mongoose";

const generalReviewSchema = new Schema({
    ranking: { type: Number },
    title: { type: String },
    experience: { type: String },
    type: { type: String },
    details: { type: String },
    client_id: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    active: { type: Boolean }
}, {
    timestamps: true,
    strict: false
});

export default model("GeneralReview", generalReviewSchema);