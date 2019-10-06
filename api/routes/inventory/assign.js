const express = require('express');
const router = express.Router();
const ArticleState = require("../../models/ArticleState");
const Department = require("../../models/Department");
const Management = require("../../models/Management");
const Article = require("../../models/Article");
const Person = require("../../models/Person");

router.put("/", async (req, res) => {

	const {trim} = require("../../app/principals");

	let {article, department, state, cedula, puesto, note} = req.body;

	if (!department) {
		cedula = null;
		puesto = null;
	}

	note = trim(note || '');

	let persona = null;

	if (!state) {
		return res.send({
			code: 500,
			message: 'Debe indicar un estado'
		})
	}

	try {

		article = await Article.findOne({
			_id: article
		});

		if (!article) {
			return res.send({
				code: 500,
				message: 'El articulo indicado no existe'
			});
		}

		state = await ArticleState.findOne({
			_id: state
		}, {_id: true});

		if (!state) {
			return res.send({
				code: 500,
				message: 'El estatus indicado no existe'
			});
		}

		state = state._id;

	} catch (e) {
		console.log(e);
		return res.send({
			code: 500,
			message: 'Problema leyendo el estatus'
		});
	}

	if (cedula) {
		try {
			persona = await Person.findOne({
				cedula : cedula
			}, {_id: true});

			if (!persona) {
				return res.send({
					code: 500,
					message: `No se encontro a la persona con el numero de cedula ${cedula}`
				});
			}

			persona = persona._id;
		} catch (e) {
			console.log(e);
			return res.send({
				code: 500,
				message: 'Problema leyendo la cedula'
			});
		}
	}

	if (department) {
		try {
			department = await Department.findOne({
				_id: department
			}, {_id: true});

			if (!department) {
				return res.send({
					code: 500,
					message: 'El departamento ingresado no existe'
				});
			}

			department = department._id;
		} catch (e) {
			console.log(e);
			return res.send({
				code: 500,
				message: 'Problema leyendo el departamento'
			});
		}
	} else {
		department = null;
		puesto = null;
		persona = null;
	}

	let management = new Management({
		department: department,
		state: state,
		article: article._id,
		person: persona,
		assigned: department ? true : false,
		puesto: puesto,
		created: new Date(),
		note: note
	});

	management.save(err => {
		if (err) {
			return res.send({
				code: 500,
				message: `Error agregando gestion: ${err}`
			});
		}

		article.state = state;
		article.save();

		res.send({
			code: 200,
			message: 'El articulo ha sido gestionado exitosamente'
		})
	});
});


module.exports = router;
