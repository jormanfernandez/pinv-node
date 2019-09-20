const express = require('express');
const router = express.Router();
const Category = require("../../models/Category");

router.patch("/", async (req, res) => {

	const {validation, trim} = require("../../app/principals");

	let param = req.body;

	if (!param._id) {
		res.send({
			code: 500,
			message: 'No se encontro la categoria a modificar'
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
		exists = await Category.findOne({
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
			message: 'Esta categoria ya se encuentra en el sistema'
		});
		return;
	}

	const category = {
		nombre: param.nombre
	};

	Category.updateOne({
		_id: param._id
	}, category, {
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
				message: 'No se pudo actualizar a la categoria'
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
