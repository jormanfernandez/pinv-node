const express = require('express');
const router = express.Router();
const Category = require("../../models/Category");

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

	if(param.last && !isEmpty(param.last)) {
		last  = {
			'_id': {
				$gt: param.last
			}
		}
	}

	let query = Category.find(Object.assign(last, search));

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
