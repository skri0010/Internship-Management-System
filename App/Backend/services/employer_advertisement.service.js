/**
 * This file contains the service for employer advertisement.
 *
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 *
 * Created at     : 26-07-2022
 * Last modified  : 20-10-2022
 */
"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const jobAdvertisementApplication = require("../Models/JobAdvertisementApplicationSchema");
const { MoleculerError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 *
 * This is Employer advertisement service where the job advertisement to recruit intern will be stored,
 * Admin can approve or reject the job advertisement
 * linked with the job.service
 */
module.exports = {
	name: "advert",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.EMPLOYER_ADVERTISEMENT_URL),
	model: jobAdvertisementApplication,
	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Retrieve pending job
		 *
		 * @returns list of all pending jobs
		 */
		pending: {
			rest: {
				method: "GET",
				path: "/pendingjob",
			},
			async handler(ctx) {
				try {
					let res = await ctx.call("advert.find", {
						search: "PENDING",
						searchFields: ["status"],
					});
					return res;
				} catch (err) {
					return new MoleculerError(
						"Error Retrieving Pending Advertisement Application",
						500,
						"RETRIEVE ERROR",
						{ error: err }
					);
				}
			},
		},

		/**
		 * Approve an application by id
		 *
		 * @param id 		advertisement id
		 * @param jobType 	jobtype of the advertisement
		 *
		 * @returns Approved application
		 */
		approve: {
			rest: {
				method: "PUT",
				path: "/approve/:id",
			},
			params: {
				id: { type: "string" },
				jobType: { type: "string" }, // SHOULD BE COMPULSORY or VOLUNTARY
			},
			async handler(ctx) {
				console.log("Approve advertisement");
				let res;
				// try update application status to APPROVED
				try {
					if (this.isPending(ctx, ctx.params.id)) {
						try {
							res = await ctx.call("advert.update", {
								id: ctx.params.id,
								status: "APPROVED",
							});
						} catch (e) {
							return new MoleculerError(
								"Error Updating Advertisement Application",
								500,
								"UPDATE ERROR",
								{ error: e }
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
				// try create a new application at job.service
				try {
					await ctx.call("job.create", {
						employerName: res.employerName,
						employerId: res.employerId,
						jobTitle: res.jobTitle,
						jobDescription: res.jobDescription,
						jobRequirement: res.jobRequirement,
						jobAdditionalInformation: res.jobAdditionalInformation,
						employerOverview: res.employerOverview,
						employerAddress: res.employerAddress,
						employerContactPerson: res.employerContactPerson,
						advertisementStartDate: res.advertisementStartDate,
						advertisementEndDate: res.advertisementEndDate,
						jobType: ctx.params.jobType,
						hireType: res.hireType,
					});
				} catch (err) {
					await ctx
						.call("advert.update", {
							id: ctx.params.id,
							status: "PENDING",
						})
						.catch((error) => {
							return new MoleculerError(
								"Error Updating Advertisement Application",
								500,
								"UPDATE ERROR",
								{ error: error }
							);
						}); // Revert back to pending
					return new MoleculerError(
						"Error Approving Advertisement Application",
						500,
						"UPDATE ERROR",
						{ error: err }
					);
				}
				// EMAIL SERVICE HERE
				// TODO: update mail html design to have a better UI with more content
				// try send an email to notify employer
				let employer;
				try {
					employer = await ctx.call("users.get", {
						id: "" + res.employerId,
					});
					await ctx.call("mail.send", {
						to: employer.email,
						subject: "Job Advertisement Update",
						html: `Dear ${employer.email}, <br> <p>Your job advertisement of ${res.jobTitle} has been ${res.status}</p>`,
					});
				} catch (err) {
					this.logger.error(
						`ERROR: Failed to send email to user ${employer.email}`,
						err
					);
				}
				return res;
			},
		},

		/**
		 * Reject an application by id
		 *
		 * @param id 		id of the advertisement
		 * @param feedback 	feedback used to send email to notify employer
		 *
		 * @returns Rejected application or MoleculerError
		 */
		reject: {
			rest: {
				method: "PUT",
				path: "/reject/:id",
			},
			params: {
				id: { type: "string" },
				feedback: { type: "string", default: null },
			},
			async handler(ctx) {

				// Try update advetisement status to REJECTED
				try {
					if (this.isPending(ctx, ctx.params.id)) {
						try {
							let res = await ctx.call("advert.update", {
								id: ctx.params.id,
								status: "REJECTED",
								feedback: ctx.params.feedback,
							});
							// EMAIL SERVICE HERE
							// TODO: update mail html design to have a better UI with more content
							let employer;
							try {
								employer = await ctx.call("users.get", {
									id: "" + res.employerId,
								});
								await ctx.call("mail.send", {
									to: employer.email,
									subject: "Job Advertisement Update",
									html: `Dear ${employer.email}, <p>Your job advertisement of ${res.jobTitle} has been ${res.status} due to ${res.feedback}</p>`,
								});
							} catch (err) {
								this.logger.error(
									`ERROR: Failed to send email to user ${employer.email}`,
									err
								);
							}
							return res;

						} catch (e) {
							return new MoleculerError(
								"Error Updating Advertisement Application",
								500,
								"UPDATE ERROR",
								{ error: e }
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
		*	This function check if the advertisement is at PENDING state or not
		*
		*	@param ctx 	context of the actions
		*	@param id	id of the advertisement
		*
		*	@returns boolean true, false based on advertisement status or MoleculerError
		*/
		async isPending(ctx, id) {
			try {
				let current = await ctx.call("advert.get", { id: id });
				if (current.status == "PENDING") {
					return true;
				} else {
					return false;
				}
			} catch (err) {
				return new MoleculerError(
					"Error Retrieving Advertisement Application by Id",
					500,
					"RETRIEVE ERROR",
					{ error: err }
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
		console.log("Employer Advertisement Application Service created");
	},
};
