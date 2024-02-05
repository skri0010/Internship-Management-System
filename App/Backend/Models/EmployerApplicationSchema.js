/**
 * This file contains the schema for employer application.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 28-07-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const employerApplicationSchema = mongoose.Schema({
    employerEmail: { type: String, required: true, unique: true },
    employerName: { type: String, required: true, unique: true},
    employerIndustry: { type: String, required: true},
    employerWebsite: { type: String, required: true},
    employerAddressStreet: { type: String, required: true},
    employerAddressCity: { type: String, required: true},
    employerAddressState: { type: String, required: true},
    employerContactPerson: { type: String, required: true},
    employerContactPersonNo: {type: String, required: true},
    employerContactPersonEmail: { type: String, required: true},
    salaryRange: { type: String, required: true},
    hireType: { type: String, required: true},
    workArrangement: { type: String, required: true},
    remark: { type: String, default: null},
    coAdminApproval: { type: Boolean, default: false },
    status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' , required: true },
    feedback: { type: String, default: null, maxLength: 100 }
}, { timestamps: true })
 
employerApplicationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("EmployerApplication", employerApplicationSchema);