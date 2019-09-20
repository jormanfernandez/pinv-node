const express = require('express');
const router = express.Router();
const Department = require("../../models/Department");

router.patch("/", async (req, res) => {

	const {validation, trim} = require("../../app/principals");

	let param = req.body;

	if (!param._id) {
		res.send({
			code: 500,
			message: 'No se encontro el departamento a modificar'
		});
		return;
	}

	try {
		param.nombre = trim(param.nombre);
	} catch (e) {
		throw new Error(`Error detectando nombre: ${e}`);
	}

	let validate = validation({
		nombre: {
			value: param.nombre,
			type: String
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
		exists = await Department.findOne({
			nombre: {
				$regex: `^${param.nombre}$`,
				$options: 'i'
			},
			_id: {
				$ne: param._id
			}
		});
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
			message: 'Este departamento ya se encuentra en el sistema'
		});
		return;
	}

	const department = {
		nombre: param.nombre
	};

	Department.updateOne({
		_id: param._id
	}, department, {
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
				message: 'No se pudo actualizar el departamento'
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
