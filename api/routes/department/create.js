const express = require('express');
const router = express.Router();
const Department = require("../../models/Department");

router.put("/", async (req, res) => {

	const {validation, trim} = require("../../app/principals");

	let param = req.body;

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
			message: 'Este Departamento ya se encuentra en el sistema'
		});
		return;
	}

	const department = new Department({
		nombre: param.nombre,
		created_date: new Date()
	});

	department.save(err => {
		if (err) {
			res.send({
				code: 500,
				message: `Error al ingresar departamento: ${err}`
			})
			return;
		}

		res.send({
			code: 200,
			message: 'Departamento ingresado exitosamente'
		})
	})
});


module.exports = router;
