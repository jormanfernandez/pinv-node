require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cookieParser(config.cookieSecret));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {

	let cookie = req.cookies.lct;
	let {createId, isEmpty} = require("app/principals");

	if(cookie, !isEmpty(cookie)) {
		return;
	}

	res.cookie(
		"lct", 
		createId(30, true), 
		{
			maxAge: 1000 * 60 * 60 * 24 * 365,
			signed: true,
			httpOnly: true
		}
	)
});

const mongoose = require("mongoose");
const dbUrl = `${process.env.DB_HOST}:${process.env.DB_PORT}`;

/*Creamos la conexion a Mongo*/
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


	app.listen(8080, () => {
	  console.log(`********* Server up and running`);
	});
});
