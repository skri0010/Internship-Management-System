/**
 * This file contains the schema for employer profile.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 28-07-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');

const employerJobAdvertisementSchema = mongoose.Schema({
    employerName: { type: String, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // refers to value of userSchema's _id.
    jobTitle: { type: String, required: true, maxLength: 30 },
    jobDescription: { type: String, required: true, maxLength: 2000 },
    jobRequirement: { type: String, required: true, maxLength: 2000 },
    jobAdditionalInformation: { type: String, default: null, maxLength: 1000 },
    hireType: { type: String, required: true, maxLength: 20 },
    employerOverview: { type: String, required: true, maxLength: 1000 },
    employerAddress: { type: String, required: true, maxLength: 100 },
    employerContactPerson: { type: String, required: true, maxLength: 50 },
    advertisementStartDate: { type: Date, required: true, default: Date.now },
    advertisementEndDate: { type: Date, required: true, min: Date.now },
    status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' , uppercase: true, required: true },
    feedback: { type: String, default: null, maxLength: 100 }
}, { timestamps: true })

module.exports = mongoose.model("EmployerJobAdvertisement", employerJobAdvertisementSchema);