const express = require('express');
const router = express.Router();
const Person = require("../../models/Person");

router.put("/", (req, res) => {

	const {validation, trim} = require("../../app/principals");

	let param = req.body;

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

	Person.findOne({
		cedula: param.cedula
	}, (err, response) => {
		if (err) {
			res.send({
				code: 500,
				message: `Error ingresando a la persona: ${err}`
			})
			return;
		}

		if (response) {
			res.send({
				code: 500,
				message: 'Esta persona ya se encuentra en el sistema'
			});
			return;
		}

		const person = new Person({
			nombre: param.nombre,
			apellido: param.apellido,
			cedula: param.cedula,
			created_date: new Date()
		});

		person.save(err => {
			if (err) {
				res.send({
					code: 500,
					message: `Error al ingresar a la persona: ${err}`
				})
				return;
			}

			res.send({
				code: 200,
				message: 'Persona ingresada exitosamente'
			})
		})
	});
});


module.exports = router;
