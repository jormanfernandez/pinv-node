const express = require('express');
const router = express.Router();
const Article = require("../../models/Article");
const ArticleState = require("../../models/ArticleState");
const Category = require("../../models/Category");
const Mark = require("../../models/Mark");

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
			type: String,
			empty: true
		},
		categoria: {
			value: param.category,
			type: String
		},
		serial: {
			value: param.serial,
			type: String
		},
		marca: {
			value: param.mark,
			type: String
		},
		estado: {
			value: param.state,
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
		exists = await Article.findOne({
			serial: param.serial
		});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error: ${e}`
		});
		return;
	}

	if(exists) {
		res.send({
			code: 500,
			message: `Ya se encuentra en el sistema un articulo con el serial ${param.serial}`
		});
		return;
	}

	try {
		exists = await ArticleState.findOne({
			_id: param.state
		});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error: ${e}`
		})
		return;
	}
	
	if (!exists) {
		res.send({
			code: 500,
			message: 'Este estado no se encuentra en el sistema'
		});
		return;
	}

	try {
		exists = await Category.findOne({
			_id: param.category
		});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error: ${e}`
		})
		return;
	}
	
	if (!exists) {
		res.send({
			code: 500,
			message: 'Esta categoria no se encuentra en el sistema'
		});
		return;
	}

	try {
		exists = await Mark.findOne({
			_id: param.mark
		});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error: ${e}`
		})
		return;
	}
	
	if (!exists) {
		res.send({
			code: 500,
			message: 'Esta marca no se encuentra en el sistema'
		});
		return;
	}

	const article = new Article({
		created_date: new Date(),
		category: param.category,
		nombre: param.nombre,
		serial: param.serial,
		state: param.state,
		mark: param.mark
	});

	article.save(err => {
		if (err) {
			res.send({
				code: 500,
				message: `Error al ingresar el articulo: ${err}`
			})
			return;
		}

		res.send({
			code: 200,
			message: 'Articulo ingresado exitosamente'
		})
	});


});


module.exports = router;
