/**
 * This file contains the service for mail.
 * 
 * @author Pan Wei Hung <wpan0017@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * 
 * Created at     : 12-09-2022
 * Last modified  : 20-10-2022
 */
"use strict";
/*
To get clientId, clientSecret, refreshToken from Google Cloud
https://alexb72.medium.com/how-to-send-emails-using-a-nodemailer-gmail-and-oauth2-fe19d66451f9

Reference for future update for email with template
https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-mail

Other references:
https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
https://www.labnol.org/google-api-service-account-220405
*/
const MailService = require("../mixins/mail.mixin");

module.exports = {
	mixins: [MailService],
	settings: {
		from: "simp.monash.no.reply@gmail.com",
		transport: {
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "simp.monash.no.reply@gmail.com",
				clientId:
					"276576898963-4akubm1ofdu3ack4k44ft4rek2h7ldvl.apps.googleusercontent.com",
				clientSecret: "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",
				refreshToken:
					"1//04PB5kuaXeUofCgYIARAAGAQSNwF-L9IrmWjDuvHjwqm2x0xfI4YYKjblK3I9qsajidu-a11b7zFpeXJsGOm40KVCpTIiUUN4s54",
			},
		},
	},
	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		console.log("Mail service started");
	},

	async afterConnected() {
		console.log("Mail service connected!");
	},
};
