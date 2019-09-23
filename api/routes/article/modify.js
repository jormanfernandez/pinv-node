const express = require('express');
const router = express.Router();
const Article = require("../../models/Article");

router.patch("/", async (req, res) => {

	const {validation, trim} = require("../../app/principals");

	let param = req.body;

	if (!param._id) {
		res.send({
			code: 500,
			message: 'No se encontro el estado a modificar'
		});
		return;
	}

	let update = {}
	let validate = {}

	if (param.nombre) {
		try {
			param.nombre = trim(param.nombre);
		} catch (e) {
			throw new Error(`Error detectando nombre: ${e}`);
		}
		update.nombre = param.nombre;
		validate.nombre = {
			value: update.nombre,
			type: String,
			empty: true
		}
	} else {
		update.nombre = ''
	}
	
	if (param.serial) {
		try {
			param.serial = trim(param.serial);
		} catch (e) {
			throw new Error(`Error detectando serial: ${e}`);
		}
		update.serial = param.serial;
		validate.serial = {
			value: update.serial,
			type: String
		}
	}

	if (!update) {
		res.send({
			code: 500,
			message: 'Campos vacios'
		})
		return;
	}

	validate = validation(validate);

	if (!validate.rsp) {
		res.send({
			code: 500,
			message: validate.data
		})
		return;
	}

	let exists = "";

	try {
		exists = await Article.findOne({
			serial: {
				$regex: `^${update.serial}$`,
				$options: 'ix'
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
			message: 'Ya se encuentra un articulo con este serial en el sistema'
		});
		return;
	}

	Article.updateOne({
		_id: param._id
	}, update, {
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
				message: 'No se pudo actualizar el articulo'
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
