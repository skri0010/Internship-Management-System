/**
 * This file contains the schema for cover letter file.
 * 
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 17-09-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const coverLetterFileSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'JobApplication'}, // refers to value of JobApplicationSchema's _id.
    coverLetter:{ type: String, default: null, required: true}, 
}, { timestamps: true, _id: false});

coverLetterFileSchema.plugin(uniqueValidator);

module.exports = mongoose.model("CoverLetterFile", coverLetterFileSchema);