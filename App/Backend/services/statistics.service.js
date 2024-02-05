/**
 * This file contains the service for statistics.
 * 
 * @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 15-09-2022
 * Last modified  : 20-10-2022
 */
"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const topJobsAdminSchema = require("../Models/topJobsAdminSchema");
const userSchema = require("../Models/userSchema")
const employerApplicationSchema = require("../Models/EmployerApplicationSchema");
const employerJobAdvertisementSchema = require("../Models/JobAdvertisementSchema")
const employerProfileSchema = require("../Models/EmployerProfileSchema");
const mongoose = require('mongoose');
const employerApplicantsSchema = require("../Models/EmployerApplicantsSchema")
const studentSchema = require("../Models/studentSchema")


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 
 * This is Employer advertisement service where the job advertisement to recruit intern will be stored,
 * Admin can approve or reject the job advertisement
 * linked with the job.service
 */
module.exports = {
    name: "statistics",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.ADMIN_URL),
    model: topJobsAdminSchema,
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {

        topJobsCounter: {
            rest: {
                method: "POST",
                path: "/topJobsCounter"
            },
            params: {
                jobId: "string"
            },
            async handler(ctx) {
                const updateJobCounter = await topJobsAdminSchema.findOneAndUpdate(
                    {jobId: ObjectId(ctx.params.jobId)},
                    {$inc: {views: 1}},
                    {options: {upsert: true}}
                )
                // updateJobCounter.save()
                console.log(updateJobCounter)
                return updateJobCounter
            }
        },
        createTopJobsCounter: {
            rest: {
                method: "POST",
                path: "/createTopJobsCounter"
            },
            params: {
                jobId: "string"
            },
            async handler(ctx) {
                const data = new topJobsAdminSchema({
                    jobId: ctx.params.jobId
                });
                data.save()
            }
        },
        jobApplicantsUpdate: {
            rest: {
                method: "POST",
                path: "/jobApplicantsUpdate"
            },
            params: {
                jobId: "string"
            },
            async handler(ctx) {
                console.log(employerJobAdvertisementSchema)
                const jobId = ctx.params.jobId
                const jobEmployer = await employerJobAdvertisementSchema.findById(jobId)
                // console.log(jobEmployer)
                // console.log(jobEmployer)
                console.log(jobEmployer.employerId)
                const updateEmployerApplicantCount = await employerApplicantsSchema.findOneAndUpdate(
                    {employerId: jobEmployer.employerId},
                    {$inc: {numberOfApplicants: 1}},
                    {options: {upsert: true, new: true}}
                )
                // updateEmployerApplicantCount.save()
                console.log(updateEmployerApplicantCount)
                return updateEmployerApplicantCount;
            }
        },

        getTopEmployers: {
            rest: {
                method: "GET",
                path: "/getTopEmployers"
            },
            async handler(ctx) {
                const topEmployers = await employerApplicantsSchema.find()

                return topEmployers;
            }
        },

        getStudentsByUnit: {
            rest: {
                method: "GET",
                path: "/getStudentsByUnit"
            },
            async handler(ctx) {
                const groupedStudents = await studentSchema.aggregate([
                    {
                        $group: {
                            _id: '$unit',
                            count: { $sum: 1 }
                        }
                    }
                ]);
                return groupedStudents;
            }
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    },

    async afterConnected() {
        // 		const userData1 = new topJobsAdminSchema({
        //     jobId: "612e61bda1953d28c265a489"
		// });
		// userData1.save()
        console.log("Statistics Service created");
    }
};