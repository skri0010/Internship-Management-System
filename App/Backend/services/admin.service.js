/**
 * This file contains the service for admin.
 * 
 * @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 29-08-2022
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
const jobApplicationSchema = require("../Models/JobApplicationSchema")
const mongoose = require('mongoose');


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 
 * This is Employer advertisement service where the job advertisement to recruit intern will be stored,
 * Admin can approve or reject the job advertisement
 * linked with the job.service
 */
module.exports = {
    name: "admin",
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

        /**
         * Retrieve job by selected employer action.
         *
         * @returns list of jobs
         */
        userCount: {
            rest: {
                method: "GET",
                path: "/userCount"
            },
            async handler(ctx) {

                const studentCount = await userSchema.countDocuments({
                    userRole: "STUDENT"
                });

                const employerCount = await userSchema.countDocuments({
                    userRole: "EMPLOYER"
                });

                return {
                    "studentCount": studentCount,
                    "employerCount": employerCount
                }

            }

        },
        /**
         * Retrieve job by selected employer action.
         *
         * @returns list of jobs
         */
        employerApplicationCount: {
            rest: {
                method: "GET",
                path: "/employerApplicationCount"
            },
            async handler(ctx) {

                const pendingCount = await employerApplicationSchema.countDocuments({
                    status: "PENDING"
                });

                const approvedCount = await employerApplicationSchema.countDocuments({
                    status: "APPROVED"
                });

                return {
                    "pendingCount": pendingCount,
                    "approvedCount": approvedCount
                }

            }

        },
        /**
         * Returns the number job postings by employer
         *
         * @returns list of jobs
         */
        employerJobPostsCount: {
            rest: {
                method: "GET",
                path: "/employerJobPostsCount"
            },
            async handler(ctx) {

                const groupedEmployers = await employerJobAdvertisementSchema.aggregate([
                    {
                        $group: {
                            _id: '$employerId',
                            count: { $sum: 1 }
                        }
                    }
                ]);


                let groupedData = []
                for (let i = 0; i < groupedEmployers.length; i++) {
                    let employerData = await employerProfileSchema
                        .find({
                            _id: groupedEmployers[i]._id
                        })
                    groupedData.push({ "employerData": employerData[0], "employerCount": groupedEmployers[i].count })
                }

                return groupedData;
            }
        },
        /**
         * Returns the top jobs.
         *
         * @returns list of jobs
         */
        getTopJobs: {
            rest: {
                method: "GET",
                path: "/getTopJobs"
            },
            async handler(ctx) {
                const topJobs = await topJobsAdminSchema.find()

                return topJobs;
            }
        },
        /**
         * Creates a new admin.
         *
         * @returns new user
         */
        createUser: {
            rest: {
                method: "POST",
                path: "/createUser"
            },
            params: {
                userRole: "string",
                email: "string"
            },
            async handler(ctx) {
                try {
                    const newUser = await new userSchema({
                        userRole: ctx.params.userRole,
                        email: ctx.params.email
                    });
                    newUser.save()
                    return newUser;
                } catch (err) {
                    console.log(err)
                }

            }
        },
        /**
         * Update user role.
         *
         * @returns return the updated user.
         */
        updateUserRole: {
            rest: {
                method: "PATCH",
                path: "/updateUserRole"
            },
            params: {
                newRole: "string",
                email: "string"
            },
            async handler(ctx) {
                try {
                    await userSchema.findOneAndUpdate(
                        { email: ctx.params.email },
                        { userRole: ctx.params.newRole }
                    )
                    const updatedUser = await userSchema.findOne(
                        { email: ctx.params.email }
                    )
                    return updatedUser;
                } catch (err) {
                    return err
                }

            }
        },
        /**
         * Delete a user.
         *
         * @returns Returns the deleted user.
         */
        deleteUser: {
            rest: {
                method: "DELETE",
                path: "/deleteUser"
            },
            params: {
                email: "string"
            },
            async handler(ctx) {
                try {
                    const deletedUser = await userSchema.findOneAndDelete(
                        { email: ctx.params.email },
                    )
                    return deletedUser;
                } catch (err) {
                    return err
                }

            }
        },
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
        console.log("Admin Service created");
    }
};