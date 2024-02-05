/**
 * This file contains the service for student report.
 * 
 * @author Arvind Chandran <acha0094@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 29-08-2022
 * Last modified  : 20-10-2022
 */
"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const studentReportSchema = require("../Models/studentReportSchema");
const studentReport = require("../Models/studentReportSchema");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * This service is to process the application of students for a job 
 */

module.exports = {
	name: "report", 
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.STUDENT_REPORT_URL),
	model: studentReport,
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
		 * Submit Report
		 */
		submit: {
			rest: { 
				method: "POST",
				path: "/submit"
			},
			params: {
				studentEmail: { type: "string" },
				reportType: { type: "string" },
				reportTitle: { type: "string" },
				companyName: { type: "string" },
				reportDate: { type: "string" },
				hoursWorked: { type: "number" },
				summaryWorkDone: { type: "string" },
				gainedBenefits: { type: "string" },
			},
			async handler(ctx) {
				const newReport = new studentReportSchema({
					studentEmail: ctx.params.studentEmail,
					reportType: ctx.params.reportType,
					reportTitle: ctx.params.reportTitle,
					companyName: ctx.params.companyName,
					reportDate: ctx.params.reportDate,
					hoursWorked: ctx.params.hoursWorked,
					summaryWorkDone: ctx.params.summaryWorkDone,
					gainedBenefits: ctx.params.gainedBenefits
				})
				newReport.save()
			}
		},

		/**
		 * Get all reports for a specific student
		 * 
		 * @returns object of reports for the student
		 */
		getStudentReportByEmail: {
			rest: { 
				method: "GET",
				path: "/retrieve"
			},
			params: {
				studentEmail: { type: "string" },
			},
			async handler(ctx) {
				const email = ctx.params.studentEmail;
				if (email.length == 0 || email == null) {
				} else {
					let reports = await studentReportSchema.find({ studentEmail: email });
					if (reports != null) {
						return reports;
					}
				}
			}
		},

		/**
		 * Update reports for a specific student
		 * when student is editing reports
		 */
		update: {
			rest: {
				method: "PATCH",
				path: "/update",
			},
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				let report = await studentReportSchema.findOne({
					_id: ctx.params.id,
				});

				report.set("reportType", ctx.params.reportType);
				report.set("reportTitle", ctx.params.reportTitle);
				report.set("companyName", ctx.params.companyName);
				report.set("reportDate", ctx.params.reportDate);
				report.set("hoursWorked", ctx.params.hoursWorked);
				report.set("summaryWorkDone", ctx.params.summaryWorkDone);
				report.set("gainedBenefits", ctx.params.gainedBenefits);

				report.save();
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

    afterConnected() {}
};
