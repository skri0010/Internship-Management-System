/**
 * This file contains the schema for student report.
 * 
 * @author Arvind Chandran <acha0094@student.monash.edu>
 * @author Hou Ruiqian <rhou0006@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 29-08-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const studentReportSchema = mongoose.Schema({
    studentEmail: { type: String, required: true},
    reportType: { type: String, enum: ['WEEKLY','MONTHLY'], uppercase: true, required: true},
    reportTitle: { type: String, required: true, maxLength: 50 },
    companyName: { type: String, required: true, maxLength: 100 }, 
    reportDate: { type: String, required: true }, 
    hoursWorked: { type: Number, required: true },
    summaryWorkDone: { type: String, required: true, maxLength: 500},
    gainedBenefits: { type: String, required: true, maxLength: 500},
}, { timestamps: true });

studentReportSchema.plugin(uniqueValidator);

module.exports = mongoose.model("StudentReport", studentReportSchema);