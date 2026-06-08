import { Schema, model } from "mongoose";

const productSchema = new Schema({
    product_type: { type: String },
    sub_type: { type: String },
    image: { type: String },
    public_id: { type: String },
    text_personalized: { type: String },
    material: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: Number }
}, {
    timestamps: true,
    strict: false
});

export default model("ProductCustom", productSchema);