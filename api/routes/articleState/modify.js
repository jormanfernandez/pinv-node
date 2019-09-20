const express = require('express');
const router = express.Router();
const ArticleState = require("../../models/ArticleState");

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
		exists = await ArticleState.findOne({
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
			message: 'Este estado ya se encuentra en el sistema'
		});
		return;
	}

	const state = {
		nombre: param.nombre
	};

	ArticleState.updateOne({
		_id: param._id
	}, state, {
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
				message: 'No se pudo actualizar el estado'
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
