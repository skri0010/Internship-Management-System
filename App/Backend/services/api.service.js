"use strict";

const ApiGateway = require("moleculer-web");
const cookieParser = require("cookie-parser");

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "1039670363666-db72gs4bbu0i1atp7a6obbpcgm7blroe";
const client = new OAuth2Client(CLIENT_ID);
const jwt = require("jsonwebtoken");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],


	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 8080 || 'https://simp-internship-management.herokuapp.com',

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		// TODO: https://github.com/moleculerjs/moleculer-web/releases v0.10.3 Named authenticate & authorize methods
		// generate authentication for each service
		routes: [
			// Route accessible by EMPLOYER ROLE
			{
				// Access to any actions in all services under "/api" URL
				path: "emp",

				whitelist: [
					"prof.get",
					"prof.update",
					"prof.remove",
					"advert.create", // job advertisement service ( create new job to be approve )
					"advert.remove", // job advertisement service ( remove new job created (CANCELLATION ?) )
					"advert.searchByEmp", // job advertisement service, get job by selected employerName
					"advert.advSearchByEmp", // job advertisement service, get job by selected employerName, keyword, status
					"advert.search", // job advertisement service, get job by selected keyword, status
					"advert.createJob",
					"jobapply.showApplicant",
					"jobapply.approve",
					"jobapply.reject",
					"jobapply.addAppointment",
					"jobapplyform.show",
					"jobapplycoverletter.show",
					"jobapplyrecommendationletter.show",
					"jobapplyresume.show",
					"job.searchJob",
					"job.myJob",
					"job.update",
					"users.getImg",
					"users.updateProfilePic",
					"users.uploadImg",
				],
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				roles: ["admin", "employer", "coadmin"],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false, // TODO: Change to "authenticateEmployer"

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				cors: {
					origin: ["http://localhost:8080", "https://simp-internship-management.herokuapp.com"],
					methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH"],
					allowedHeaders: ["Content-Type", "Authorization", "role"],
					exposedHeaders: [],
					credentials: true,
					maxAge: 3600,
				},

				bodyParsers: {
					json: {
						strict: false,
						limit: "16MB",
					},
					urlencoded: {
						extended: true,
						limit: "16MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
			// Route accessible by ADMIN ROLE
			{
				// Access to any actions in all services under "/api" URL
				path: "admin",

				whitelist: [
					"app.list", // employer application service, list all application (PENDING, APPROVED, REJECTED)
					"app.remove", // employer application service, remove employer application
					"app.adminApprove", // employer application service, approve employer application
					"app.reject", // employer application service, reject employer application
					"app.adminPending", // employer application service, list all pending application that havent approved by main admin, but approved by co admin
					"advert.searchByEmp", // job advertisement service, get job by selected employerName
					"advert.search", // job advertisement service, get job by selected keyword, status
					"advert.pending", // job advertisement service, get all pending job advertisement to be approve
					"advert.approve", // job advertisement service, approve a selected job advertisement
					"advert.reject", // job advertisement service, reject a selected job advertisement
					"users.**",
					"report.list",
					"student.listStudentProfiles",
					"job.searchJob",
					"admin.**",
					"statistics.*",
					"job.jobById"
				],
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [cookieParser()],

				roles: ["admin", "coadmin"],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false, // TODO: Change to "authenticateAdmin"

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				cors: {
					origin: ["http://localhost:8080", "https://simp-internship-management.herokuapp.com"],
					methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH","DELETE"],
					allowedHeaders: ["Content-Type", "Authorization", "role"],
					exposedHeaders: [],
					credentials: true,
					maxAge: 3600,
				},

				bodyParsers: {
					json: {
						strict: false,
						limit: "16MB",
					},
					urlencoded: {
						extended: true,
						limit: "16MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
			// Route accessible by STUDENT ROLE
			{
				// Access to any actions in all services under "/api" URL
				path: "stud",

				whitelist: [
					"student.getStudentByEmail",
					"student.update",
					"student.updateAddWorkExp",
					"student.updateRemoveWorkExp",
					"student.updateAddSkill",
					"student.updateRemoveSkill",
					"jobapply.list",
					"jobapply.apply",
					"jobapply.remove",
					"jobapply.getStudentApplications",
					"jobapplyform.attach",
					"jobapplyresume.attach",
					"jobapplycoverletter.attach",
					"jobapplyrecommendationletter.attach",
					"jobapply.getStudentApplications",
					"job.searchJob",
					"job.jobById",
					"users.getImg",
					"users.updateProfilePic",
					"users.uploadImg",
					"users.getUserByEmail",
					"report.submit",
					"report.getStudentReportByEmail",
					"statistics.*",
					"report.update",
				],
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				roles: ["admin", "student", "coadmin"],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false, // TODO: Change to "authenticateStudent"

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				cors: {
					origin: ["http://localhost:8080", "https://simp-internship-management.herokuapp.com"],
					methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH"],
					allowedHeaders: ["Content-Type", "Authorization", "role"],
					exposedHeaders: [],
					credentials: true,
					maxAge: 3600,
				},

				bodyParsers: {
					json: {
						strict: false,
						limit: "16MB",
					},
					urlencoded: {
						extended: true,
						limit: "16MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
			// Route accessible by CO-ADMIN ROLE
			{
				// Access to any actions in all services under "/api" URL
				path: "coadmin",

				whitelist: [
					"app.list", // employer application service, list all application (PENDING, APPROVED, REJECTED)
					"app.remove", // employer application service, remove employer application
					"app.coApprove", // employer application service, approve employer application
					"app.reject", // employer application service, reject employer application
					"app.coAdminPending", // employer application service, list all pending employer application
					"advert.searchByEmp", // job advertisement service, get job by selected employerName
					"advert.search", // job advertisement service, get job by selected keyword, status
					"advert.pending",
					"advert.approve",
					"advert.reject",
					"users.getUsers",
					"users.postUser",
					"users.deleteUser",
					"users.getUserByEmail",
					"job.searchJob",
					"users.getImg",
					"users.updateProfilePic",
					"users.uploadImg",
					"report.list",
				],
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [cookieParser()],

				roles: ["coadmin"],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false, // TODO: Change to "authenticateCoAdmin"

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				cors: {
					origin: ["http://localhost:8080", "https://simp-internship-management.herokuapp.com"],
					methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH"],
					allowedHeaders: ["Content-Type", "Authorization", "role"],
					exposedHeaders: [],
					credentials: true,
					maxAge: 3600,
				},

				bodyParsers: {
					json: {
						strict: false,
						limit: "16MB",
					},
					urlencoded: {
						extended: true,
						limit: "16MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
			// Route accessible by UNAUTHENTICATED USER
			{
				// Access to any actions in all services under "/api" URL
				path: "visitor",

				whitelist: [
					"app.create", 	// employer application service, create employer application to be approved by admin
					"users.login",
					"users.resolve",
					"student.postStudent",
				],
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [cookieParser()],

				roles: ["visitor"],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				cors: {
					origin: ["http://localhost:8080", "https://simp-internship-management.herokuapp.com"],
					methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH"],
					allowedHeaders: ["Content-Type"],
					exposedHeaders: [],
					credentials: true,
					maxAge: 3600,
				},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: false,
						limit: "16MB"
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {},
		},
	},

	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// //if the path is login, just return because user needs to be authenticated inside users.login action
			// if (req.url == '/users/login') {
			// 	return
			// }
			// console.log(route)
			// Read the token from header
			// console.log('test deploy')
			// ctx.meta.$responseType = "text/html";
			ctx.meta.$responseHeaders = {
				'Access-Control-Allow-Origin': 'https://simp-internship-management.herokuapp.com'
			};

			const auth = req.headers["token"];

			const list = {};
			const cookieHeader = req.headers.cookie;
			if (!cookieHeader) return list;

			cookieHeader.split(`;`).forEach(function (cookie) {
				let [name, ...rest] = cookie.split(`=`);
				// name = name?.trim();
				if (!name) return;
				const value = rest.join(`=`).trim();
				if (!value) return;
				list[name] = decodeURIComponent(value);
			});



			if (!'token' in list || Object.keys(list).length == 0) {
				//Either token doesnt exist in the cookie or there are no cookies in the browser at all
				return false
			}

			const token = list.token;

			try {
				const ticket = await client.verifyIdToken({
					idToken: token,
					requiredAudience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
				});
				const payload = ticket.getPayload();
				return { payload, token };
			} catch (err) {
				//if error is produced, redirect user to login
				console.log(err)
				//false indicates that token validdation failed.
				return false
			}

		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			const token = req.headers.authorization;
			try {
				await client.verifyIdToken({
					idToken: token,
					requiredAudience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
				});
			} catch (err) {
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN
				);
			}

			//send role from frontend request through headers with the header names as role
			let roles = []
			for (let i = 0; i < route.opts.roles.length; i++) {
				let role = route.opts.roles[i]
				roles.push(role)
			}
			const userRole = req.headers.role;
			if (roles.includes(userRole)) {
				return
			} else {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			}

		},
		// Reference example: https://github.com/moleculerjs/moleculer-realworld-example-app
		async authenticateAdmin(ctx, route, req) {
			return true;
		},

		async authenticateStudent(ctx, route, req) {
			return true;
		},


		async authenticateCoAdmin(ctx, route, req) {
			return true;
		},

		async authenticateEmployer(ctx, route, req) {
			return true;
		},
	},
};
