/**
 * This file contains the schema for top jobs.
 * 
 * @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 01-09-2022
 * Last modified  : 20-10-2022
 */
const mongoose = require('mongoose');

const topJobsAdminSchema = new mongoose.Schema({
    jobId: { type: String, ref: 'JobAdvertisement', unique: true}, //This Id refers to the _id value in jobAdvertiesments schema
    views: { type: Number, default: 0}
});

module.exports = mongoose.model("Top Jobs",topJobsAdminSchema);