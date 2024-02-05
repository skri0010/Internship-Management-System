/**
 * This file contains the schema for employer applicant.
 * 
 * @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 16-10-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const EmployerApplicants = new mongoose.Schema({
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true}, // refers to value of userSchema's _id.
    numberOfApplicants: {type: Number, default: 0}
}, { timestamps: true });

EmployerApplicants.plugin(uniqueValidator);

module.exports = mongoose.model("EmployerApplicants",EmployerApplicants);