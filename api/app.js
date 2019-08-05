require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", [
  	"Origin", 
  	"X-Requested-With", 
  	"Content-Type", 
  	"Accept", 
  	"Authorization"
  	].join(", "));
  next();
});

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


/**
 * ***********
 * Session handler
 * ***********
 **/
app.use("/api", async (req, res, next) => {

	const excludedMethods = [
		"OPTIONS"
	];

	const excludedPath = [
		"/api/token"
	];

	if (excludedMethods.indexOf(req.method) > -1 || excludedPath.indexOf(req.originalUrl) > -1) {
		next();
		return;
	}

	res.locals.user = {
		logged: false
	}

	console.log("***** method: ", req.method);
	console.log("***** uri: ", req.originalUrl);

	let oAuth = req.get("Authorization");

	if (!oAuth) {
		res.send({
			code: 200,
			tokenExpired: true
		})
		return;
	}

	const Session = require("./models/Sessions");

	const {detectIp, detectBrowser, createId} = require("./app/principals");
	const ip = detectIp(req);
	const browser = detectBrowser(req);

	let response = "";

	try {
		response = await Session.findOne({ id: oAuth, browser: browser, ip: ip });
	} catch (e) {
		next();
		return;
	}

	if (!response) {
		res.send({
			code: 200,
			tokenExpired: true
		})
		return;
	}

	res.locals.session = oAuth;

	if(!response.user) {
		next();
		return;
	}

	const User = require("./models/User");

	let user = "";

	try {
		user = await User.findeOne({_id: response.user});

		if (!user) {
			next();
			return;
		}
	} catch (e) {
		console.error("Error obteniendo usuario: ", e)
		next();
		return;
	}

	res.locals.user = Object.assign(user, {logged: true});
	console.log(res.locals);
	next();
});

const mongoose = require("mongoose");
const dbUrl = `${process.env.DB_HOST}:${process.env.DB_PORT}`;

/**
 * ***********
 * Creamos la conexion a Mongo
 * ***********
 **/
(async () => {
	try {
		await mongoose.connect(
			`mongodb://${dbUrl}/${process.env.DB_NAME}`, 
			{
				useNewUrlParser: true,
				reconnectTries: Number.MAX_VALUE,
				reconnectInterval: 500,
				poolSize: 20,
				bufferMaxEntries: 0,
				connectTimeoutMS: 1000
			}
		);
	} catch (e) {
		throw new Error(e);
	}
})();

global.mongoose = mongoose;
const db = mongoose.connection;

db.on("error", resolve => {
	throw new Error(resolve);
});

db.once("open", () => {
	const middlewares = require('./middlewares.js');
	console.log("********* Connected to MongoDB");

	/**/
	// Middlewares
	console.log(`********* Setting Middlewares`);
	middlewares.forEach(route => app.use("/api", route));
	console.log(`********* Done setting Middlewares`);
	/**/


	/**
	 * No queremos acumular sesiones basura
	 * Asi que buscamos las sesiones 
	 * que no han sido utilizadas en los ultimos 2 dias
	 */
	const gc = setInterval(() => {

		const Session = require("./models/Sessions");

		let date = new Date();
		date.setTime(date.getTime() - (1000 * 60 * 60 * 24 * 2))
		Session.find({
			last_access: {
				$lte: date
			}
		}).deleteMany().exec()
	}, 1000 * 60 * 60)


	app.listen(8080, () => {
	  console.log(`********* Server up and running`);
	});

});
