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
const uniqueValidator = require('mongoose-unique-validator');

const employerProfileSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // refers to value of userSchema's _id.
    employerName: { type: String, required: true, unique: true },
    employerIndustry: { type: String, required: true },
    employerWebsite: { type: String, required: true },
    employerAddressStreet: { type: String, required: true },
    employerAddressCity: { type: String, required: true },
    employerAddressState: { type: String, required: true },
    employerContactPerson: { type: String, required: true },
    employerContactPersonNo: { type: String, required: true },
    employerContactPersonEmail: { type: String, required: true }
}, { timestamps: true, _id: false })

employerProfileSchema.plugin(uniqueValidator);

module.exports = mongoose.model("EmployerProfile", employerProfileSchema);