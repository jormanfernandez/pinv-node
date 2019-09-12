const express = require('express');
const router = express.Router();
const Person = require("../../models/Person");

router.get("/", (req, res) => {

	const {isEmpty} = require("../../app/principals");

	let param = req.query;
	console.log(param);
	let search = {};
	let last = {};

	const limit = 10;

	if (param.nombre && !isEmpty(param.nombre)) {
		search.nombre = {
			$regex: `.*${param.nombre}.*`,
			$options: 'ix'
		}
	}

	if (param.apellido && !isEmpty(param.apellido)) {
		search.apellido = {
			$regex: `.*${param.apellido}.*`,
			$options: 'ix'
		}
	}

	if (!isNaN(param.cedula) && param.cedula > 0) {
		search.cedula = {
			$gte: param.cedula
		}
	}

	if(param.last && !isEmpty(param.last)) {
		last  = {
			'_id': {
				$gt: param.last
			}
		}
	}

	const query = Person.find(Object.assign(last, search)).limit(limit);
	query.exec((err, response) => {
		if (err) {
			res.send({
				code: 500,
				message: err
			})
			return;
		}

		if(!response) {
			res.send({
				code: 200,
				message: []
			});
			return;
		}

		res.send({
			code: 200,
			message: response
		})
	});
});


module.exports = router;
