/**
 * This file contains the schema for user.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 26-07-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userRolesSchema = new mongoose.Schema({
    userRole: { type: String, enum: ['ADMIN', 'STUDENT', 'EMPLOYER', 'COADMIN'], required: true},
    email: { type: String, required: true, unique: true},
    image: { type: String, default: null } 
}, { timestamps: true });

userRolesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User",userRolesSchema);