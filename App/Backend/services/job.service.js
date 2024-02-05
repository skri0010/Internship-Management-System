/**
 * This file contains the service for job.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
 * @author Hou Ruiqian <rhou0006@student.monash.edu>
 * @author Zeenath Zaeema Nashath <znas0003@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 28-07-2022
 * Last modified  : 20-10-2022
 */
"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const job = require("../Models/JobAdvertisementSchema");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "job",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.JOB_URL),
	model: job,
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
		 * Retrieve job by selected keyword or job type
		 * 
		 * @param keyword - used to find from jobTitle/employerName field
		 * @param jobType - used to find job with corresponding jobType
		 * @param sortBy  - used to determine which field should be selected for sorting (future implementation)
		 * @param page	  - used to determine which page to retrieve the data from
		 * 
		 * @returns list of jobs that fulfill the criteria
		 */
		searchJob: {
			rest: {
				method: "POST",
				path: "/search",
			},
			params: {
				keyword: { type: "string" }, 
				jobType: { type: "string" },
				sortBy: { type: "string", default: "advertisementEndDate" },
				page: { type: "number", default: 1 },
			},
			async handler(ctx) {
				let currentTime = new Date();
				// List job by query, sort, page and pageSize
				let res = await ctx.call("job.list", {
					query: {
						$and: [
							{
								$or: [
									{
										jobTitle: {
											$regex: ctx.params.keyword,
											$options: "i",
										},
									},
									{
										employerName: {
											$regex: ctx.params.keyword,
											$options: "i",
										},
									},
								],
							},
							{
								jobType: {
									$regex: ctx.params.jobType,
									$options: "i",
								},
							},
							{
								advertisementStartDate: { $lt: currentTime },
							},
							{
								advertisementEndDate: { $gt: currentTime },
							},
						],
					},
					sort: ctx.params.sortBy,
					page: ctx.params.page,
					pageSize: 9,
				})

				// Create a Map to search for unique employer
				let idMap = new Map();
				for (let i = 0; i < res.rows.length; i++) {
					idMap.set(res.rows[i].employerId.toString(), "1");
				}
				// Convert the unique Map to array for getIds action
				let idArr = Array.from(idMap, ([key, value]) => ({
					key,
					value,
				}));
				
				let picture;
				// Action to get the picture of employer from users.service
				try {
					picture = await ctx.call("users.getIds", { ids: idArr });
				} catch (e) {
					console.log(e);
					return res;
				}
				// Convert all the data get back to unique Map
				let imageMap = new Map();
				picture.forEach((object) => {
					imageMap.set(object.key, object.value);
				});
				
				let dataArr = [];
				let resData = res.rows;
				// Add the attribute image to the resData before return
				for (let i = 0; i < resData.length; i++) {
					let data = {
						_id: resData[i]._id,
						employerName: resData[i].employerName,
						employerId: resData[i].employerId,
						jobTitle: resData[i].jobTitle,
						jobDescription: resData[i].jobDescription,
						jobRequirement: resData[i].jobRequirement,
						jobAdditionalInformation:
							resData[i].jobAdditionalInformation,
						hireType: resData[i].hireType,
						employerOverview: resData[i].employerOverview,
						employerAddress: resData[i].employerAddress,
						employerContactPerson: resData[i].employerContactPerson,
						advertisementStartDate: resData[i].advertisementStartDate,
						advertisementEndDate: resData[i].advertisementEndDate,
						jobType: resData[i].jobType,
						// Image will be retrieve from unique Map based on employerId
						image: imageMap.get(resData[i].employerId.toString()),
						createdAt: resData[i].createdAt,
						updatedAt: resData[i].updatedAt,
					};
					dataArr.push(data);
				}
				// return data along with total page size
				return [dataArr,res.totalPages];
			},
		},

		/**
		 * Retrieve job by selected employer Id, keyword or job type
		 *
		 * @param employerId - used to find the job with same employerId 
		 * 
		 * @returns list of jobs that fulfill the criteria
		 */
		myJob: {
			rest: {
				method: "GET",
				path: "/myjob/:employerId",
			},
			params: {
				employerId: { type: "string" }
			},
			async handler(ctx) {
				// Find all jobs by given employerId and sort it based on JobTitle
				let res = await this.adapter.find({
					query: {
						$and: [
							{
								employerId: ctx.params.employerId,
							},
						],
					},
					sort: "jobTitle"
				});

				return res
			},
		},
		/**
		 * Find one job by given id
		 *
		 * @param jobId - used to find the job
		 * 
		 * @returns job that match the given id
		 */
		jobById: {
			rest: {
				method: "GET",
				path: "/search/jobId",
			},
			params: {
				jobId: { type: "string" },
			},
			async handler(ctx) {
				const jobId = ctx.params.jobId
				const jobData = await job.findOne(
					{_id: jobId}
				)
				return jobData;
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
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},

	afterConnected() {
		console.log("Job Service created");
	},
};

