/**
 * This file contains the schema for job application.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 28-07-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const jobApplicationSchema = mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'EmployerJobAdvertisement'}, // refers to value of EmployerJobAdvertisementSchema's _id.
    jobType: { type: String, enum: ['VOLUNTARY','COMPULSORY'], uppercase: true, required: true},
    applicantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}, // refers to value of userSchema's _id.
    applicationDetails:{ type: String, default: null, maxLength: 300 },
    applicationStatus: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' , uppercase: true, required: true },
    interviewAppointment: { type: Date, default: null, min: Date.now },
    interviewConfirmation: { type: String, enum: ['PENDING','CONFIRMED','RESCHEDULE'], default: 'PENDING' , uppercase: true },
}, { timestamps: true });

jobApplicationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);