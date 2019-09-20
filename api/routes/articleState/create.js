const express = require('express');
const router = express.Router();
const ArticleState = require("../../models/ArticleState");

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
		exists = await ArticleState.findOne({
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
			message: 'Este estado ya se encuentra en el sistema'
		});
		return;
	}

	const state = new ArticleState({
		nombre: param.nombre,
		created_date: new Date()
	});

	state.save(err => {
		if (err) {
			res.send({
				code: 500,
				message: `Error al ingresar estado: ${err}`
			})
			return;
		}

		res.send({
			code: 200,
			message: 'Estado de articulo ingresado exitosamente'
		})
	})
});


module.exports = router;
