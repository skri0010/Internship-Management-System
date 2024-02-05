/**
 * This file contains the schema for student.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * @author Arvind Chandran <acha0094@student.monash.edu>
 * 
 * Created at     : 26-07-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const studentRolesSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}, // refers to value of userSchema's _id.
    firstName: {type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true },
    pronouns: { type: String, enum: ['He/Him', 'She/Her', 'They/Them'], required: false},
    fieldOfStudy: { type: String, required: false},
    education: { type: String, required: false},
    unit: { type: String, required: false, default: null},
    workExperience: { 
        type: [{
            workExpTitle: {type: String, required: true},
            workExpCompanyName: {type: String, required: true},
            workExpLocation: {type: String, required: false},
            workExpDuration: {type: String, required: true}
        }], 
        required: false,
        default: undefined
    },
    skills: { 
        type: [{
            skillTitle: {type: String, required: true},
            skillMastery: {type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCE'], required: true}
        }], 
        required: false,
        default: undefined
    },
    dateCreated: {type: Date, default: Date.now, required: true}
});

studentRolesSchema.plugin(uniqueValidator);

// userRolesSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Student", studentRolesSchema);