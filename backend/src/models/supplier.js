import {Schema, model} from "mongoose";

const supplierSchema = new Schema({
    name: { type: String},
    email: { type: String},
    phone: {type: String},
    image: { type: String},
    public_id: { type: String},
    address: { type: String},
    company: { type: String},
    isVerified: { type: Boolean},

},{
    timestamps: true,
    strict: false
});

export default model("Suppliers", supplierSchema);