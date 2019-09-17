const express = require('express');
const router = express.Router();
const Person = require("../../models/Person");

router.patch("/", async (req, res) => {

	const {validation, trim} = require("../../app/principals");

	let param = req.body;

	if (!param._id) {
		res.send({
			code: 500,
			message: 'No se encontro la persona a modificar'
		});
		return;
	}

	try {
		param.cedula = parseInt(param.cedula);
	} catch (e) {
		throw new Error(`Error detectando cedula: ${e}`);
	}

	let validate = validation({
		nombre: {
			value: param.nombre,
			type: String
		},
		apellido: {
			value: param.apellido,
			type: String
		},
		cedula: {
			value: param.cedula,
			type: Number,
			gt: 500000
		}
	});

	if (!validate.rsp) {
		res.send({
			code: 500,
			message: validate.data
		})
		return;
	}

	let exists = "";

	try {
		exists = await Person.findOne({
			cedula: param.cedula,
			_id: {
				$ne: param._id
			}
		});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error ${e}`
		})
		return;
	}

	

	if (exists) {
		res.send({
			code: 500,
			message: 'Ya hay alguien con este numero de cedula'
		});
		return;
	}

	const person = {
		nombre: param.nombre,
		apellido: param.apellido,
		cedula: param.cedula
	};

	Person.updateOne({
		_id: param._id
	}, person, {
		upsert: false
	}, (err, update) => {

		if (err) {
			res.send({
				code: 500,
				message: err
			});
			return;
		}

		if (!update.ok) {
			res.send({
				code: 500,
				message: 'No se pudo actualizar a la persona'
			});
			return;
		}

		res.send({
			code: 200,
			message: true
		})

	});
});


module.exports = router;
