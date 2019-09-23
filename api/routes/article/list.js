const express = require('express');
const router = express.Router();
const Article = require("../../models/Article");

router.get("/", (req, res) => {

	const {isEmpty} = require("../../app/principals");

	let param = req.query;
	let search = {};
	let last = {};

	const limit = 10;

	if (param.nombre && !isEmpty(param.nombre)) {
		search.nombre = {
			$regex: `.*${param.nombre}.*`,
			$options: 'ix'
		}
	}

	if (param.serial && !isEmpty(param.serial)) {
		search.serial = {
			$regex: `.*${param.serial}.*`,
			$options: 'ix'
		}
	}

	if (param.category && !isEmpty(param.category)) {
		search.category = param.category
	}

	if (param.mark && !isEmpty(param.mark)) {
		search.mark = param.mark
	}

	if (param.state && !isEmpty(param.state)) {
		search.state = param.state
	}

	if(param.last && !isEmpty(param.last)) {
		last  = {
			'_id': {
				$gt: param.last
			}
		}
	}

	let query = Article.find(Object.assign(last, search))
		.populate("mark", "nombre _id")
		.populate("state", "nombre _id")
		.populate("category", "nombre _id");

	if(!param.all) {
		query = query.limit(limit);
	}
	
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
