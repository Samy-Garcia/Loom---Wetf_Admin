import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    subcategories: [{ type: String }]
}, {
    timestamps: true
});

export default model("Category", categorySchema);
