/**
 * This file contains the service for recommendation letter of job application.
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
const recommendationLetterFile = require("../Models/RecommendationLetterFileSchema");
const { MoleculerClientError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * This service is to process the application of students for a job 
 */

module.exports = {
	name: "jobapplyrecommendationletter", 
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.JOB_APPLICATION_RECOMMENDATION_LETTER_URL),
	model: recommendationLetterFile,
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
		 * show recommendation letter by a given jobApplicationId
		 * 
		 * @return recommendation letter with given jobApplicationId
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
				return this.Promise.reject(new MoleculerClientError("No Related Recommendation Letter", 404));
			}
		},
		/**
		 * Submit the recommendation letter as part of the job application
		 * 
		 * @return response of attaching recommendation letter
		 */
         attach: {
			rest: {
				method: "PUT",
				path: "/attach"
			},
			params: {
				_id: { type: "string" },
				recommendationLetter: { type: "string" },
			},
			async handler(ctx) {
				const form = {
					_id: ctx.params._id,
					recommendationLetter: ctx.params.recommendationLetter
				};
				let res = await ctx.call("jobapplyrecommendationletter.create", form);
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
		console.log("Job Application - Recommendation Letter File Service created");
	}
};