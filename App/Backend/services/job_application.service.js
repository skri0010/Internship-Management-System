/**
 * This file contains the service for job application.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
 * @author Arvind Chandran <acha0094@student.monash.edu>
 * @author Zeenath Zaeema Nashath <znas0003@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * @author Joshua Ee Xian Zhen <jeee0002@student.monash.edu>
 * @author Suchit Sudhir Krishna <skri0010@student.monash.edu>
 * 
 * Created at     : 26-07-2022
 * Last modified  : 20-10-2022
 */
"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const jobApplication = require("../Models/JobApplicationSchema");
const { MoleculerError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * This service is to process the application of students for a job
 */

module.exports = {
	name: "jobapply",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.JOB_APPLICATION_URL),
	model: jobApplication,
	/**
	 * Settings
	 */
	settings: {
		fields: [
			"jobId",
			"jobType",
			"applicantId",
			"applicationDetails",
			"applicationStatus",
			"interviewAppointment",
			"interviewConfirmation",
			"createdAt",
			"updatedAt",
			"_id",
		],
		populates: {
			jobId: "job.get",
			applicantId: {
				action: "users.get",
				params: {
					fields: "email _id",
				},
			},
		},
	},

	/**
	 * Dependencies
	 */
	dependencies: [
		"users",
		"job"
	],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * show applicants of a job by a given jobId
		 *
		 * @param jobId	id for an advertisement at job.service
		 * 
		 * @return job with given jobId
		 */
		showApplicant: {
			rest: {
				method: "GET",
				path: "/show/:jobId",
			},
			params: {
				jobId: { type: "string" },
			},
			async handler(ctx) {
				try {
					let res = await ctx.call("jobapply.find", {
						query: { jobId: ctx.params.jobId },
						populate: ["applicantId"]
					});
					return res;
				} catch (err) {
					return new MoleculerError(
						"Error Retrieving Applicants For Job",
						500,
						"RETRIEVE ERROR",
						{ error: err }
					);
				}
			},
		},
		/**
		 * Job application approve
		 *
		 * @param id 	job application id 
		 * 
		 * @return response of updating application status or MoleculerError
		 */
		approve: {
			rest: {
				method: "PUT",
				path: "/approve/:id",
			},
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				try {
					if (this.isPending(ctx, ctx.params.id)) {
						try {
							let res = await ctx.call("jobapply.update", {
								id: ctx.params.id,
								applicationStatus: "APPROVED",
							});
							// EMAIL SERVICE HERE
							// TODO: update mail html design to have a better UI with more content if required
							let resDetail = await ctx.call("jobapply.get", {
								id: res._id,
								populate: ["jobId", "applicantId"],
							});
							this.sendMail(ctx, {
								to: resDetail.applicantId.email,
								subject: "Job Application Update",
								html: `Dear ${resDetail.applicantId.email}, <p>Your job application of ${resDetail.jobId.jobTitle} at ${resDetail.jobId.employerName} has been ${resDetail.applicationStatus} </p>`,
							});
							return res;
						} catch (e) {
							return new MoleculerError(
								"Error Retrieving Applicants For Job",
								500,
								"UPDATE ERROR",
								{ error: err }
							);
						}
					} else {
						return new MoleculerError(
							"Application was approved or rejected",
							500,
							"IMPOSSIBLE ACTION",
							{ error: "Advertisement Application Error" }
						);
					}
				} catch (err) {
					return err;
				}
			},
		},
		/**
		 * Job application reject
		 * 
		 * @param id 	job application id 
		 * 
		 * @return response of updating application status or MoleculerError
		 */
		reject: {
			rest: {
				method: "PUT",
				path: "/reject/:id",
			},
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				try {
					if (this.isPending(ctx, ctx.params.id)) {
						try {
							let res = await ctx.call("jobapply.update", {
								id: ctx.params.id,
								applicationStatus: "REJECTED",
							});
							// EMAIL SERVICE HERE
							// TODO: update mail html design to have a better UI with more content if required
							let resDetail = await ctx.call("jobapply.get", {
								id: res._id,
								populate: ["jobId", "applicantId"],
							});
							this.sendMail(ctx, {
								to: resDetail.applicantId.email,
								subject: "Job Application Update",
								html: `Dear ${resDetail.applicantId.email}, <p>Your job application of ${resDetail.jobId.jobTitle} at ${resDetail.jobId.employerName} has been ${resDetail.applicationStatus} </p>`,
							});
							return res;
						} catch (e) {
							return new MoleculerError(
								"Error Retrieving Applicants For Job",
								500,
								"UPDATE ERROR",
								{ error: err }
							);
						}
					} else {
						return new MoleculerError(
							"Application was approved or rejected",
							500,
							"IMPOSSIBLE ACTION",
							{ error: "Advertisement Application Error" }
						);
					}
				} catch (err) {
					return err;
				}
			},
		},
		/**
		 * Apply for a job
		 *
		 * @param jobId 				job application id 
		 * @param jobType 				job type of the application
		 * @param applicantId 			id of students applying the job
		 * @param applicationDetails 	details of applying the job
		 * 
		 * @return response of creating a new job application
		 */
		apply: {
			rest: {
				method: "PUT",
				path: "/apply",
			},
			params: {
				jobId: { type: "string" },
				jobType: { type: "string" },
				applicantId: { type: "string" },
				applicationDetails: { type: "string" },
			},
			async handler(ctx) {
				const application = {
					jobId: ctx.params.jobId,
					jobType: ctx.params.jobType,
					applicantId: ctx.params.applicantId,
					applicationDetails: ctx.params.applicationDetails,
				};
				let applicationCheck = await ctx.call("jobapply.list", {
					query: {
						jobId: ctx.params.jobId,
						applicantId: ctx.params.applicantId,
					},
				});
				let res;
				if (applicationCheck.rows.length == 0) {
					res = await ctx.call("jobapply.create", application);
					// Create the counter for the job applicants
				} else {
					res = "Application Exist In Database";
				}
				return res;
			},
		},
		/**
		 * Update interview appointment time
		 *
		 * @param id 				job application id
		 * @param interviewTime 	interviewTime for the job
		 * 
		 * @return updated version of jobapplication or MoleculerError
		 */
		addAppointment: {
			rest: {
				method: "PUT",
				path: "/appointment",
			},
			params: {
				id: { type: "string" },
				interviewTime: { type: "string" },
			},
			async handler(ctx) {
				try {
					let res = await ctx.call("jobapply.update", {
						_id: ctx.params.id,
						interviewAppointment: ctx.params.interviewTime,
					});
					// EMAIL SERVICE HERE
					// TODO: update mail html design to have a better UI with more content if required using template
					let resDetail = await ctx.call("jobapply.get", {
						id: res._id,
						populate: ["jobId", "applicantId"],
					});
					this.sendMail(ctx, {
						to: resDetail.applicantId.email,
						subject: "Interview Time Appointed",
						html: `Dear ${resDetail.applicantId.email}, <p>Your job application of ${resDetail.jobId.jobTitle} at ${resDetail.jobId.employerName} has been updated with a new interview time slot at ${resDetail.interviewAppointment}</p>`,
					});
					return res;
				} catch (err) {
					return new MoleculerError(
						"Error Adding interview appointement for Job Application",
						500,
						"UPDATE ERROR",
						{ error: err }
					);
				}
			}
		},

		/**
		 * Get all applications for a specific student
		 */
		getStudentApplications: {
			rest: {
				method: "GET",
				path: "/retrieve"
			},
			params: {
				applicantId: { type: "string" },
			},
			async handler(ctx) {
				let reports = await jobApplication.find({
					applicantId: ctx.params.applicantId,
				});
				return reports;
			}
		}
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {
		/** 
		*	This function check if the jobapplication is at PENDING state or not
		*
		*	@param ctx 	context of the actions
		*	@param id	id of the jobapplication
		*	
		*	@returns boolean true, false based on jobapplication status or MoleculerError
		*/
		async isPending(ctx, id) {
			try {
				let current = await ctx.call("jobapply.get", { id: id });
				if (current.status == "PENDING") {
					return true;
				} else {
					return false;
				}
			} catch (err) {
				return new MoleculerError(
					"Error Retrieving Job Application by Id",
					500,
					"RETRIEVE ERROR",
					{ error: err }
				);
			}
		},
		async sendMail(ctx, msg) {
			try {
				await ctx.call("mail.send", msg);
			} catch (err) {
				this.logger.error(
					`ERROR: Failed to send email to user ${msg.to}`,
					err
				);
			}
		},
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() { },

	/**
	 * Service started lifecycle event handler
	 */
	async started() { },

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() { },

	afterConnected() {
		console.log("Job Submit Application Service created");
	},
};
