/**
 * This file contains the service for employer application.
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
const employerApplication = require("../Models/EmployerApplicationSchema");
const { MoleculerError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 *
 * This is Employer application service where the application to become Employer will be stored,
 * Admin can approve or reject the application
 * linked with the users.service, employer_profile.service
 */

module.exports = {
	name: "app",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.EMPLOYER_APPLICATION_URL),
	model: employerApplication,
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
	 * Live notification can be added in the future
	 */
	actions: {
		/**
		 * Retrieve pending employer application that havent approved by main admin, but approved by co admin
		 *
		 * @returns list of pending applications with coAdminApproval value as true or MoleculerError
		 */
		adminPending: {
			rest: {
				method: "GET",
				path: "/pendingapp",
			},
			async handler(ctx) {
				try {
					let res = await ctx.call("app.find", {
						search: "PENDING",
						searchFields: ["status"],
					});
					return res;
				} catch (err) {
					return new MoleculerError(
						"Error Retrieving Pending Employer Application",
						500,
						"RETRIEVE ERROR",
						{ error: err }
					);
				}
			},
		},

		/**
		 * Retrieve pending employer application approved by co admin
		 *
		 * @returns list of pending applications with coAdminApproval value as false or MoleculerError
		 */
		coAdminPending: {
			rest: {
				method: "GET",
				path: "/coadminpendingapp",
			},
			async handler(ctx) {
				try {
					let data = await this.adapter.find({
						query: {
							status: "PENDING",
							coAdminApproval: false,
						},
					});
					return data;
				} catch (err) {
					return new MoleculerError(
						"Error Retrieving Pending Employer Application",
						500,
						"RETRIEVE ERROR",
						{ error: err }
					);
				}
			},
		},

		/**
		 * co admin reject application action
		 * 
		 * @param id 	id of the application
		 * 
		 * @returns updated version of application or MoleculerError
		 */
		coApprove: {
			rest: {
				method: "PUT",
				path: "/coapprove/:id",
			},
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				// Only approve if application is PENDING state
				try {
					if (this.isPending(ctx, ctx.params.id)) {
						try {
							let res = await ctx.call("app.update", {
								id: ctx.params.id,
								coAdminApproval: true,
							});
							return res;
						} catch (e) {
							return new MoleculerError(
								"Error Updating Employer Application",
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
							{ error: "Employer Application Error" }
						);
					}
				} catch (err) {
					return err;
				}
			},
		},

		/**
		 * Main Admin approve application action.
		 *
		 * @param id 	id of the application
		 * 
		 * @returns updated version of application or MoleculerError
		 */
		adminApprove: {
			rest: {
				method: "PUT",
				path: "/adapprove/:id",
			},
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				let id, res;
				// Try update application status
				try {
					if (this.isPending(ctx, ctx.params.id)) {
						try {
							res = await ctx.call("app.update", {
								id: ctx.params.id,
								status: "APPROVED",
							});
						} catch (e) {
							return new MoleculerError(
								"Error Updating Employer Application",
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
							{ error: "Employer Application Error" }
						);
					}
				} catch (err) {
					return err;
				}
				// Try create new users at users.service
				try {
					let user = await ctx.call("users.create", {
						userRole: "EMPLOYER",
						email: res.employerEmail,
					});
					id = user._id;
				} catch (err) {
					// revert application back to previous state
					// No try catch block here, error might occurs but if previous app.update was called successfully, this should work fine
					await ctx.call("app.update", {
						id: ctx.params.id,
						status: "PENDING",
					});
					return new MoleculerError(
						"Error Creating New User",
						500,
						"CREATE ERROR",
						{ error: err }
					);
				}
				// Try create new employer profile for user employer_profile.service
				try {
					await ctx.call("prof.create", {
						_id: id,
						employerName: res.employerName,
						employerIndustry: res.employerIndustry,
						employerWebsite: res.employerWebsite,
						employerAddressStreet: res.employerAddressStreet,
						employerAddressCity: res.employerAddressCity,
						employerAddressState: res.employerAddressState,
						employerContactPerson: res.employerContactPerson,
						employerContactPersonNo: res.employerContactPersonNo,
						employerContactPersonEmail:
							res.employerContactPersonEmail,
					});
				} catch (err) {
					// No try catch block here, error might occurs but if previous app.update, users.create was called successfully, this should work fine
					await ctx.call("users.remove", { id: id });
					await ctx.call("app.update", {
						id: ctx.params.id,
						status: "PENDING",
					});
					console.log("Reverted application status");
					return new MoleculerError(
						"Error Creating Employer Profile",
						500,
						"CREATE ERROR",
						{ error: err }
					);
				}
				// EMAIL SERVICE HERE
				// TODO: update mail html design to have a better UI with more content
				try {
					console.log(res);
					await ctx.call("mail.send", {
						to: res.employerEmail,
						subject: "Application As Employer Update",
						html: `Dear ${res.employerEmail}, <p>Your application to become an employer has been ${res.status}</p>`,
					});
				} catch (err) {
					this.logger.error(
						`ERROR: Failed to send email to user ${res.employerEmail}`,
						err
					);
				}
				return res;
			},
		},

		/**
		 * Admin or co-admin reject application action.
		 *
		 * @param id 		id of the application
		 * @param feedback 	feedback for the application (reason of rejection)
		 * 
		 * @returns Rejected application
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
				// Feedback used to send email to notify employer
				try {
					if (this.isPending(ctx, ctx.params.id)) {
						try {
							let res = await ctx.call("app.update", {
								id: ctx.params.id,
								status: "REJECTED",
								feedback: ctx.params.feedback,
							});
							// EMAIL SERVICE HERE
							// TODO: update mail html design to have a better UI with more content
							try {
								await ctx.call("mail.send", {
									to: res.employerEmail,
									subject: "Application As Employer Update",
									html: `Dear ${res.employerEmail}, <p>Your application to become an employer has been ${res.status} due to ${res.feedback}</p>`,
								});
							} catch (err) {
								this.logger.error(
									`ERROR: Failed to send email to user ${res.employerEmail}`,
									err
								);
							}
							return res;
						} catch (e) {
							return new MoleculerError(
								"Error Updating Employer Application",
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
							{ error: "Employer Application Error" }
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
		*	This function check if the application is at PENDING state or not
		*
		*	@param ctx 	context of the actions
		*	@param id	id of the application
		*	
		*	@returns boolean true, false based on application status or MoleculerError
		*/
		async isPending(ctx, id) {
			try {
				let current = await ctx.call("app.get", { id: id });
				if (current.status == "PENDING") {
					return true;
				} else {
					return false;
				}
			} catch (err) {
				return new MoleculerError(
					"Error Retrieving Employer Application by Id",
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
		console.log("Employer Application Service created");
	},
};
