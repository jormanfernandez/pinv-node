const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	res.send("api");
});

/**
 * Generamos nuevos tokens
 */
router.get("/token", async (req, res) => {

	const excludedMethods = [
		"OPTIONS"
	];

	if (excludedMethods.indexOf(req.method) > -1) {
		next();
		return;
	}

	const Session = require("./../models/Sessions");

	const {detectIp, detectBrowser, createId} = require("./../app/principals");
	const ip = detectIp(req);
	const browser = detectBrowser(req);
	let oAuth = req.get("Authorization");
	oAuth = oAuth && oAuth != '0' ? oAuth : null;

	if (oAuth)
		Session.find({ id: oAuth, browser: browser, ip: ip }).deleteMany().exec();

	let id = `${createId(55)}.${createId(35)}`;
	let exists = true;

	while(exists) {
		
		let search = await Session.find({id: id});
		exists = search.length > 0;

		if(exists)
			id = `${createId(55)}.${createId(35)}`;
	}

	try {
		let response = await Session.create({
			id: id,
			user: null,
			browser: browser,
			ip: ip,
			last_access: new Date()
		});

		res.send({
			code: 200,
			message: response.id
		});
	} catch (e) {
		return res.send({
			code: 500,
			message: `Error generando tokens: ${e}`
		})
	}	
	
});

router.get("/user/token/", async (req, res) => {

	const excludedMethods = [
		"OPTIONS"
	];

	if (excludedMethods.indexOf(req.method) > -1) {
		next();
		return;
	}

	let oAuth = req.get("Authorization");
	const Session = require("./../models/Sessions");

	const {detectIp, detectBrowser, createId} = require("./../app/principals");
	const ip = detectIp(req);
	const browser = detectBrowser(req);

	let response = "";

	try {
		response = await Session.findOne({ id: oAuth, browser: browser, ip: ip }, {user: true});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error leyendo sesion: ${e}`
		})
		return;
	}

	if (!response) {
		res.send({
			code: 200,
			tokenExpired: true
		})
		return;
	}

	const User = require("./../models/User");
	let user = "";

	try {

		user = await User.findOne({_id: response.user}, {
			password: 0,
			person: 0
		});

		if (!user) {
			res.send({
				code: 500,
				message: `No user`
			});
			return;
		}

	} catch (e) {
		res.send({
			code: 500,
			message: `Error obteniendo usuario: ${e}`
		});
		return;
	}

	res.send({
		code: 200,
		message: user
	});
});

module.exports = router;
