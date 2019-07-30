/*
 * **************
 * Encriptado SHA256
 * **************
 */
const crypto = require("crypto");

module.exports = text => {

	text = crypto.createHmac("sha256", process.env.DB_HASH)
		.update(text)
		.digest("hex");

	return text;
};
