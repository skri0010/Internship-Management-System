/**
 * This file contains the service for user.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 21-04-2022
 * Last modified  : 20-10-2022
 */
"use strict";

const { ServiceBroker } = require("moleculer");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const userSchema = require("../Models/userSchema");
const { MoleculerError } = require("moleculer").Errors;
const cookieParser = require("cookie-parser");
// Google Auth
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "1039670363666-db72gs4bbu0i1atp7a6obbpcgm7blroe";
const client = new OAuth2Client(CLIENT_ID);
const jwt = require("jsonwebtoken");
let fs = require("fs");
let path = require("path");
const Cookies = require("cookies");
const { connect } = require("cookies");
const EmployerApplicants = require('../Models/EmployerApplicantsSchema')

module.exports = {
	name: "users",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.ADMIN_USERS_URL),
	model: userSchema,
	/**
	 * Settings
	 */
	settings: {
		//change name later
		JWT_SECRET: "jwt-conduit-secret",
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
		 * Get a list of users
		 *
		 * @returns list of users
		 */
		getUsers: {
			rest: {
				method: "GET",
				path: "/getUsers",
			},
			async handler() {
				let payload;
				await userSchema
					.find()
					.then((users) => (payload = users))
					.catch((err) => console.log(err));

				return payload;
			},
		},
		/**
		 * Login the user
		 *
		 * @returns user
		 */
		login: {
			rest: {
				method: "POST",
				path: "/login",
			},
			params: {
				tokenId: { type: "string" },
			},
			async handler(ctx) {
				//expiry date is set for security reasons. Cookie value will show empty after it reaches its expiry date.
				let date = new Date();
				//set cookie to expire in one hour from login.
				const expiryDate = new Date(
					date.getTime() + 60 * 60 * 1000
				).toString();
				ctx.meta.$responseType = "text/html";
				ctx.meta.$responseHeaders = {
					"Set-Cookie": `token=${ctx.params.tokenId}; expires=${expiryDate}; httponly`
				};
				//get user data using token
				const ticket = await client.verifyIdToken({
					idToken: ctx.params.tokenId,
					requiredAudience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
				});
				const payload = ticket.getPayload();
				const email = payload.email;
				let user = await this.adapter.find({ query: { email: email } });
				//For employers, user data should only be added to db after their company application has been approved by admin
				//If employer data does not exist in db, just return
				// Checks the email and the role and returns user if it exists in database
				if (user.length != 0) {
					return user;
				} else {
					//find and assign the role of user based on email.
					let userRole;

					let user = {
						userRole: "STUDENT",
						email: email,
					};
					try {
						const newUser = await this.adapter.insert(user);
						return newUser;
					} catch (e) {
						console.log(e);
					} 
				}
			},
		},
		/**
		 * Adds a new user.
		 *
		 * @returns returns the new user.
		 */
		postUser: {
			rest: {
				method: "POST",
				path: "/add",
			},
			params: {
				userRole: { type: "string" },
				email: { type: "string" },
			},
			async handler(ctx) {
				const userRole = ctx.params.userRole;
				const email = ctx.params.email;

				const newUser = new userSchema({
					userRole: userRole,
					email: email,
				});
				newUser.save();

				if (userRole == 'EMPLOYER') {
					// Code to create the statistics data for the employer.
					const newEmployerApplicants = new EmployerApplicants({
						employerId: newUser._id
					})
					newEmployerApplicants.save();
				}

				console.log("user saved");
			},
		},
		/**
		 * Resolves the token for the user.
		 *
		 * @returns User information
		 */
		resolve: {
			rest: {
				method: "GET",
				path: "/resolve",
			},
			async handler(ctx) {
				const user = ctx.meta.user.payload;
				const token = ctx.meta.user.token;

				if (user == null) {
					return null;
				} else {
					// console.log(res);
					const userDb = await this.adapter.find({
						query: { email: user.email },
					});
					return { user, userDb, token };
				}
			},
		},
		/**
		 * Deletes a user.
		 *
		 * @returns returns the deleted user.
		 */
		deleteUser: {
			rest: {
				method: "DELETE",
				path: "/remove",
			},
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				const id = ctx.params.id;

				await userSchema.findByIdAndDelete(id);

				console.log("user deleted");
			},
		},
		/**
		 * Gets a user by email.
		 *
		 * @returns returns the user.
		 */
		getUserByEmail: {
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
					console.log("Email cannot be empty or null");
				} else {
					let user = await userSchema.findOne({ email: email });
					if (user != null) {
						return user;
					} else {
						console.log("User not found");
					}
				}
			},
		},
		/**
		 * Get the image of the user.
		 *
		 * @returns the image of the user.
		 */
		getImg: {
			rest: {
				method: "GET",
				path: "/getimg",
			},
			params: {
				email: { type: "string" },
			},
			async handler(ctx) {
				try {
					let res = await this.adapter.find({
						query: { email: ctx.params.email },
					});
					return res;
				} catch (e) {
					return NotFoundError;
				}
			},
		},

		/**
		 * Updates profile picture of user.
		 *
		 * @returns user
		 */
		updateProfilePic: {
			rest: {
				method: "PATCH",
				path: "/updateimg",
			},
			params: {
				email: { type: "string" },
				profilePic: { type: "string" },
			},
			async handler(ctx) {
				try {
					let user = await ctx.call("users.getUserByEmail", {
						email: ctx.params.email,
					});
					let res = await ctx.call("users.update", {
						id: user.id,
						image: ctx.params.profilePic,
					});
					return res;
				} catch (e) {
					return NotFoundError;
				}
			},
		},
		/**
		 * Upload image of user.
		 *
		 * @returns user.
		 */
		uploadImg: {
			rest: {
				method: "POST",
				path: "/uploadimg",
			},
			params: {
				email: { type: "string" },
				profilePic: { type: "string" },
			},
			async handler(ctx) {
				let res;
				try {
					let user = await ctx.call("users.getUserByEmail", {
						email: ctx.params.email,
					});
					res = await ctx.call("users.update", {
						email: user.email,
						image: ctx.params.profilePic,
					});
				} catch (e) {
					res = "Error! User does not exist/Problem uploading image";
				}
				return res;
			},
		},
		/**
		 * Gets the Ids of user. 
		 *
		 * @returns List of ids of users
		 */
		getIds: {
			rest: {
				method: "GET",
				path: "/getidspic",
			},
			params: {
				ids: {
					type: "array",
					items: {
						type: "object",
						props: {
							key: { type: "string", empty: false },
							value: { type: "string", empty: false },
						},
					},
				},
			},
			async handler(ctx) {
				let res = [];
				for (let i = 0; i < ctx.params.ids.length; i++) {
					let data = await this.adapter.findById(
						ctx.params.ids[i].key
					);
					res[i] = { key: ctx.params.ids[i].key, value: data.image };
				}
				return res;
			},
		},
		/**
		 * Gets the list of students. 
		 *
		 * @returns list of students
		 */
		students: {
			async handler(ctx) {
				let data = await this.adapter.find({
					query: {
						userRole: "STUDENT"
					}
				});
				return data;
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

	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
		// const userData1 = new EmployerApplicants({
		//     employerId: "633d9926b7c400000f8afed3",
		// });
		// userData1.save()
		// const userData2 = new userSchema({
		//     userRole: "Test User",
		//     userID: "Test ID123",
		//     email: "mmoh0111@student.monash.edu"
		// })
		// userData2.save()
	},
};
