/*
campos
name
email
password
address
phone
salary
image
*/

import {Schema, model} from 'mongoose';

const employeeSchema = new Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    address: {type: String},
    phone: {type: String},
    salary: {type: Number},
    isVerified: {type: Boolean},
    loginAttempts: {type: Number},
    timeOut: {type: Date}
}, {
    timestamps: true,
    strict: false
});

export default model('Employee', employeeSchema);