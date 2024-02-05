/**
 * This file contains the service for resume of job application.
 * 
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * 
 * Created at     : 17-09-2022
 * Last modified  : 20-10-2022
 */
"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const resumeFile = require("../Models/ResumeFileSchema");
const { MoleculerClientError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * This service is to process the application of students for a job 
 */

module.exports = {
	name: "jobapplyresume", 
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.JOB_APPLICATION_RESUME_URL),
	model: resumeFile,
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
		 * Show the resume for specific applicant (Not used by any component for now)
		 * Since showApplicant actions took 3s or more to retrieve the items
		 * Hence, for performance concern, finding resume again will decrease performance
		 * 
		 * ENHANCEMENT: Can move application, resume field to another service to improve performance
		 */
		/**
		 * show resume by a given jobApplicationId
		 * 
		 * @return resume with given jobApplicationId
		 */
		show: {
			rest: {
				method: "GET",
				path: "/show/:id"
			},
			params: {
				id: { type: "string" }
			},
			async handler(ctx) {
				let res = await this.adapter.find({
					query:
						{ _id: ctx.params.id }
				});
				if (res.length > 0){
					return res[0];
				}
				return this.Promise.reject(new MoleculerClientError("No Related Resume", 404));
			}
		},
		/**
		 * Submit the resume file as part of the job application
		 * 
		 * @return response of attaching resume
		 */
         attach: {
			rest: {
				method: "PUT",
				path: "/attach"
			},
			params: {
				_id: { type: "string" },
				resume: { type: "string" },
			},
			async handler(ctx) {
				const resume = {
					_id: ctx.params._id,
					resume: ctx.params.resume
				};
				let res = await ctx.call("jobapplyresume.create", resume);
				return res;
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

	afterConnected() {
		console.log("Job Application - Resume File Service created");
	}
};
