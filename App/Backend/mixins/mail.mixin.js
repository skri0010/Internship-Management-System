/*
 * moleculer-mail
 * Copyright (c) 2019 MoleculerJS (https://github.com/moleculerjs/moleculer-addons)
 * MIT Licensed
 */

"use strict";
require("dotenv").config();
const fs 			= require("fs");
const path 			= require("path");
const _ 			= require("lodash");

const { MoleculerError, MoleculerRetryableError } 	= require("moleculer").Errors;
const nodemailer 			= require("nodemailer");
const htmlToText 			= require("nodemailer-html-to-text").htmlToText;
const EmailTemplate 		= require("email-templates").EmailTemplate;

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

module.exports = {
	name: "mail",

	settings: {
		// Sender default e-mail address
		from: null,

		// Convert HTML body to text
		htmlToText: true,

		// Templates folder
		templateFolder: null,

		// Common data
		data: {},
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Send an email to recipients
		 */
		send: {
			handler(ctx) {
				const data = _.defaultsDeep(
					ctx.params.data || {},
					this.settings.data
				);
				if (ctx.params.template) {
					const templateName = ctx.params.template;
					// Use templates
					const template = this.getTemplate(templateName);
					if (template) {
						// Render template
						return template
							.render(data || {}, ctx.params.locale)
							.then((rendered) => {
								const params = _.omit(ctx.params, [
									"template",
									"locale",
									"data",
								]);
								params.html = rendered.html;
								if (rendered.text) params.text = rendered.text;
								if (rendered.subject)
									params.subject = rendered.subject;

								// Send e-mail
								return this.send(params);
							});
					}
					return this.Promise.reject(
						new MoleculerError(
							"Missing e-mail template: " + templateName
						)
					);
				} else {
					// Send e-mail
					const params = _.omit(ctx.params, [
						"template",
						"locale",
						"data",
					]);
					return this.send(params);
				}
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Get template renderer by name
		 *
		 * @param {any} templateName
		 * @returns
		 */
		getTemplate(templateName) {
			if (this.templates[templateName]) {
				return this.templates[templateName];
			}

			const templatePath = path.join(
				this.settings.templateFolder,
				templateName
			);
			if (fs.existsSync(templatePath)) {
				this.templates[templateName] = new EmailTemplate(templatePath);
				Promise.promisifyAll(this.templates[templateName]);

				return this.templates[templateName];
			}
		},

		/**
		 * Send an email
		 *
		 * @param {Object} msg
		 * @returns
		 */
		send(msg) {
			return new this.Promise((resolve, reject) => {
				this.logger.debug(
					`Sending email to ${msg.to} with subject '${msg.subject}'...`
				);

				if (!msg.from) msg.from = this.settings.from;

				if (this.transporter) {
					this.transporter.sendMail(msg, (err, info) => {
						if (err) {
							this.logger.warn("Unable to send email: ", err);
							reject(
								new MoleculerRetryableError(
									"Unable to send email! " + err.message
								)
							);
						} else {
							this.logger.info(
								"Email message sent.",
								info.response
							);
							resolve(info);
						}
					});
				} else
					return reject(
						new MoleculerError(
							"Unable to send email! Invalid mailer transport: " +
								this.settings.transport
						)
					);
			});
		},
		async createTransporter() {
			const oauth2Client = new OAuth2(
				this.settings.transport.auth.clientId,
				this.settings.transport.auth.clientSecret,
				"https://developers.google.com/oauthplayground"
			);

			oauth2Client.setCredentials({
				refresh_token: this.settings.transport.auth.refreshToken,
			});
            let accessToken;
            try {
               accessToken = await new Promise((resolve, reject) => {
				oauth2Client.getAccessToken((err, token) => {
					if (err) {
						reject();
					}
					resolve(token);
				});
			}); 
            }
			catch(err) {
                this.logger.warn(
					"Error accessing token",
					oauth2Client,
                    err,
					accessToken
				);
            }

			const transporter = nodemailer.createTransport({
				service: this.settings.transport.service,
				auth: {
					type: this.settings.transport.auth.type,
					user: this.settings.transport.auth.user,
					accessToken,
					clientId: this.settings.transport.auth.clientId,
					clientSecret: this.settings.transport.auth.clientSecret,
					refreshToken: this.settings.transport.auth.refreshToken,
				},
			});

			return transporter;
		},
	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
		this.templates = {};
		if (this.settings.templateFolder) {
			if (!fs.existsSync(this.settings.templateFolder)) {
				/* istanbul ignore next */
				this.logger.warn(
					"The templateFolder is not exists! Path:",
					this.settings.templateFolder
				);
			}
		}

		if (!this.settings.transport) {
			this.logger.error("Missing transport configuration!");
			return;
		}

		this.transporter = await this.createTransporter();

		if (this.transporter) {
			this.logger.info("Transporter Created Successfully");
			if (this.settings.htmlToText)
				this.transporter.use("compile", htmlToText());
		}
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {},
};
