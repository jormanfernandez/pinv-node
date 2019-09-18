const express = require('express');
const router = express.Router();
const User = require("../../models/User");
const Person = require("../../models/Person");

router.put("/", async (req, res) => {

	const {validation, trim, junkPassword} = require("../../app/principals");

	let param = req.body;

	try {
		param.cedula = parseInt(param.cedula);
	} catch (e) {
		throw new Error(`Error detectando cedula: ${e}`);
	}

	let validate = validation({
		username: {
			value: param.username,
			type: String
		},
		password: {
			value: param.pwd,
			type: String
		},
		cedula: {
			value: param.cedula,
			type: Number,
			gt: 500000
		},
		acceso: {
			value: param.access,
			type: Array,
			empty: true
		}
	});

	if (!validate.rsp) {
		res.send({
			code: 500,
			message: validate.data
		})
		return;
	}

	const username = trim(param.username).toLowerCase();
	const password = junkPassword(trim(param.pwd));
	const cedula = param.cedula;
	const access = param.access;

	let person = "";
	let exists = "";



	try {
		person = await Person.findOne({
			cedula: cedula
		})
	} catch (e) {
		res.send({
			code: 500,
			message: `Error: ${e}`
		})
		return;
	}

	if (!person) {
		res.send({
			code: 500,
			message: `La persona ingresada no existe`
		})
		return;
	}

	try {
		exists = await  User.findOne({
			username: username
		})
	} catch (e) {
		res.send({
			code: 500,
			message: `Error: ${e}`
		})
		return;
	}

	if (exists) {
		res.send({
			code: 500,
			message: `Ya hay un usuario con el nick ${username}`
		})
		return;
	}

	try {
		exists = await User.findOne({
			person: person._id
		})
	} catch (e) {
		res.send({
			code: 500,
			message: `Error: ${e}`
		})
		return;
	}

	if (exists) {
		res.send({
			code: 500,
			message: `${person.nombre} ${person.apellido} Ya tiene un usuario`
		})
		return;
	}

	const user = new User({
		nick: username,
		password: password,
		person: person._id,
		created_date: new Date(),
		access: access
	});

	user.save(err => {
		if (err) {
			res.send({
				code: 500,
				message: `Error creando el usuario: ${err}`
			})
			return;
		}

		res.send({
			code: 200,
			message: `Usuario ${username} creado exitosamente`
		})
	});
});

module.exports = router;
