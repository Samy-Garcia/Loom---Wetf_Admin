import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String },
    images: [
        {
    image: { type: String },
    public_id: { type: String }
}
    ],
    product_type: { type: String },
    sub_type: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: Number },
    stock: { type: Number },
    description: { type: String },
    supplier_id: {
        type: Schema.Types.ObjectId,
        ref: "Supplier"
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Product", productSchema);