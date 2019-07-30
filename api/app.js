require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


/**
 * ***********
 * Cookie handler
 * ***********
 **/
app.use((req, res, next) => {

	let name = "ucc";
	let value = req.cookies ? req.cookies[name] : undefined;

	console.log(value);

	if(value) {
		
		res.locals.session = value;
		res.locals.user = {
			logged: false
		}

		const Session = require("./models/Sessions");
		Session.findOne({id: value}, (err, data) => {

			if(err) {

				res.send({
					code: 500,
					message: `Error detectando usuario: ${err}`
				})
				return;
			}

			if(!data) {
				res.locals.user = {
					logged: false
				}
				next();
				return;
			}

			const User = require("./models/User");

			User.findOne({_id: data.toJSON().user}, (err, user) => {

				if(err) {
					res.send({
						code: 500,
						message: `Error buscando usuario: ${err}`
					});
					return;
				}

				if(!user) {
					res.send({
						code: 500,
						message: `Usuario no encontrado`
					});
					return;
				}

				res.locals.user = Object.assign({logged: true}, user.toJSON());
				next();
			});
		});
		return;
	}

	const {createId} = require("./app/principals");
	value = createId(45, true, ["-", "_"]);
	res.cookie(name, value);
	res.locals.session = value;
	res.locals.user = {
		logged: false
	}
	next();
});

app.use("/cookie", (req, res) => {
	res.send({
		code: 200,
		message: req.cookies
	})
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


	app.listen(8080, () => {
	  console.log(`********* Server up and running`);
	});
});
