import {Schema, model} from "mongoose";

const clientSchema = new Schema({
    name: { type: String},
    lastName: { type: String},
    email: { type: String},
    password: { type: String},
    birthdate: {type: Number},   
    phone: { type: String},
    address: { type: String},
    isActive: { type: Boolean},
    loginAttempts: { type: Number},
    timeOut: { type: Date}
},{
    timestamps: true,
    strict: false
});

export default model("Client", clientSchema);