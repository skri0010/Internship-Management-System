/**
 * This file contains the service for student profile.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Arvind Chandran <acha0094@student.monash.edu>
 * @author Joshua Ee Xian Zhen <jeee0002@student.monash.edu>
 * @author Suchit Sudhir Krishna <skri0010@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 28-07-2022
 * Last modified  : 20-10-2022
 */
"use strict";

const { ServiceBroker } = require("moleculer");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const studentSchema = require("../Models/studentSchema");

module.exports = {
	name: "student",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.STUDENT_PROFILE_URL),
	model: studentSchema,
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
		 * Post student's information to database
		 * 
		 */
		postStudent: {
			rest: {
				method: "POST",
				path: "/add",
			},
			params: {
                id: { type: "string" },
				firstName: { type: "string" },
				lastName: { type: "string" },
				email: { type: "string" },
				pronouns: { type: "string" },
				fieldOfStudy: { type: "string" },
				education: { type: "string" },
				workExperience: { type: "array" },
				skills: { type: "array" },
				unit: { type: "string" },
			},
			async handler(ctx) {
                const user_id = ctx.params.id;
				const firstName = ctx.params.firstName;
				const lastName = ctx.params.lastName;
				const email = ctx.params.email;
				const pronouns = ctx.params.pronouns;
				const fieldOfStudy = ctx.params.fieldOfStudy;
				const education = ctx.params.education;
				const workExperience = ctx.params.workExperience;
				const skills = ctx.params.skills;
				const unit = ctx.params.unit;

				let existingUser = await this.adapter.find({ query: { _id: user_id } });
				
				if (existingUser.length == 0) {
					const newStudent = new studentSchema({
                        _id: user_id,
						firstName: firstName,
						lastName: lastName,
						email: email,
						pronouns: pronouns,
						fieldOfStudy: fieldOfStudy,
						education: education,
						workExperience: workExperience,
						skills: skills,
						unit: unit,
					});
					newStudent.save();
				}
			},
		},

		/**
		 * Delete a student from database 
		 * 
		 */
		deleteStudent: {
			rest: {
				method: "DELETE",
				path: "/remove",
			},
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				const id = ctx.params.id;

				await studentSchema.findByIdAndDelete(id);
			},
		},

		/**
		 * Retrieved a student information by email provided
		 * 
		 * @returns an instance of student
		 */
		getStudentByEmail: {
			rest: {
				method: "GET",
				path: "/retrieve",
			},
			params: {
				email: { type: "string" },
			},
			async handler(ctx) {
				const email = ctx.params.email;
				if (email.length == 0 || email == null) {
				} else {
					let student = await studentSchema.findOne({ email: email });
					if (student != null) {
						return student;
					}
				}
			},
		},

		/**
		 * Retrieved a list of students
		 * 
		 * @returns an list of student profiles
		 */
		listStudentProfiles: {
			rest: {
				method: "GET",
				path: "/studentlist",
			},
			async handler(ctx) {
				let students = await ctx.call("users.students");
				let studentProfiles = []
				for (let i = 0; i < students.length; i++){
					let data = await this.adapter.find({query: { email: students[i].email }})
					if (data[0]){
						let item = {
							email: data[0].email,
							fieldOfStudy: data[0].fieldOfStudy,
							firstName: data[0].firstName,
							lastName: data[0].lastName
						}
						studentProfiles.push(item);
					}
				}
				return studentProfiles;
			},
		},

		/**
		 * Update student information 
		 * When user is editing their personal information at the profile page
		 */
		update: {
			rest: {
				method: "PATCH",
				path: "/update",
			},
			params: {
				email: { type: "string" },
			},
			async handler(ctx) {
				let student = await studentSchema.findOne({
					email: ctx.params.email,
				});

				student.set("firstName", ctx.params.firstName);
				student.set("lastName", ctx.params.lastName);
				student.set("pronouns", ctx.params.pronouns);
				student.set("fieldOfStudy", ctx.params.fieldOfStudy);
				student.set("education", ctx.params.education);
				student.set("unit", ctx.params.unit);

				student.save();
			},
		},

		/**
		 * Update profile page 
		 * When user is editing/updating working experience card
		 */
		updateAddWorkExp: {
			rest: {
				method: "PATCH",
				path: "/update-addWorkExp",
			},
			params: {
				email: { type: "string" },
			},
			async handler(ctx) {
				let student = await studentSchema.findOne({
					email: ctx.params.email,
				});
				student.workExperience.push(ctx.params.eachWorkExp);

				student.save();
			},
		},

		/**
		 * Update on profile page 
		 * When user is removing their work experience card 
		 */
		updateRemoveWorkExp: {
			rest: {
				method: "PATCH",
				path: "/update-removeWorkExp",
			},
			params: {
				email: { type: "string" },
			},
			async handler(ctx) {
				let student = await studentSchema.findOne({
					email: ctx.params.email,
				});
				var delWorkExp = ctx.params.deleteWorkExp;
				var workExpArray = student.workExperience;
				var indexOfdeleteWorkExp;
				var arrayLength = workExpArray.length;
				for (var i = 0; i < arrayLength; i++) {
					var eachWorkExp = workExpArray[i];
					if (
						eachWorkExp.workExpTitle == delWorkExp.workExpTitle &&
						eachWorkExp.workExpCompanyName ==
							delWorkExp.workExpCompanyName &&
						eachWorkExp.workExpDuration ==
							delWorkExp.workExpDuration &&
						eachWorkExp.workExpLocation ==
							delWorkExp.workExpLocation
					) {
						indexOfdeleteWorkExp = i;

						break;
					}
				}
				if (typeof indexOfdeleteWorkExp !== "undefined") {
					workExpArray.splice(indexOfdeleteWorkExp, 1);
				}
				student.set("workExperience", workExpArray);

				student.save();
			},
		},

		/**
		 * Update on profile page  
		 * When user is editing their skills card
		 */
		updateAddSkill: {
			rest: {
				method: "PATCH",
				path: "/update-addSkill",
			},
			params: {
				email: { type: "string" },
				skill: { type: "object" }
			},
			async handler(ctx) {
				let student = await studentSchema.findOne({
					email: ctx.params.email,
				});

				student.skills.push(ctx.params.skill);

				student.save();
			},
		},

		/**
		 * Update student information 
		 * When user is removing their skills card
		 */
		updateRemoveSkill: {
			rest: {
				method: "PATCH",
				path: "/update-removeSkill",
			},
			params: {
				email: { type: "string" },
			},
			async handler(ctx) {
				let student = await studentSchema.findOne({
					email: ctx.params.email,
				});
				var delSkill = ctx.params.deleteSkill;
				var skillsArray = student.skills;
				var indexOfdeleteSkill;
				var arrayLength = skillsArray.length;
				for (var i = 0; i < arrayLength; i++) {
					var eachSkill = skillsArray[i];
					if (
						eachSkill.skillTitle == delSkill.skillTitle &&
						eachSkill.skillMastery == delSkill.skillMastery
					) {
						indexOfdeleteSkill = i;

						break;
					}
				}
				if (typeof indexOfdeleteSkill !== "undefined") {
					skillsArray.splice(indexOfdeleteSkill, 1);
				}
				student.set("skills", skillsArray);

				student.save();
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

	async afterConnected() {},
};
