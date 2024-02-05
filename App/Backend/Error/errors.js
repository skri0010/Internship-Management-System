"use strict";
// https://github.com/moleculerjs/moleculer-web/blob/master/src/errors.js
const { MoleculerError, MoleculerClientError } = require("moleculer").Errors;

const ERR_NO_TOKEN = "NO_TOKEN";
const ERR_INVALID_TOKEN = "INVALID_TOKEN";
const ERR_UNABLE_DECODE_PARAM = "UNABLE_DECODE_PARAM";
const ERR_ORIGIN_NOT_FOUND = "ORIGIN_NOT_FOUND";
const ERR_ORIGIN_NOT_ALLOWED = "ORIGIN_NOT_ALLOWED";

/**
 * Not found HTTP error
 *
 * @class NotFoundError
 * @extends {Error}
 */
 class NotFoundError extends MoleculerError {
	/**
	 * Creates an instance of NotFoundError.
	 *
	 * @param {String} type
	 * @param {any} data
	 *
	 * @memberOf NotFoundError
	 */
	constructor(type, data) {
		super("Not found", 404, type || "NOT_FOUND", data);
	}
}