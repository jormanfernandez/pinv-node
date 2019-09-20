const express = require('express');
const router = express.Router();
const User = require("../../models/User");
const Person = require("../../models/Person");

router.get("/", async (req, res) => {

	const {isEmpty} = require("../../app/principals");

	let param = req.query;
	let search = {};
	let last = {};

	const limit = 10;

	if (param.nick && !isEmpty(param.nick)) {
		search.nick = {
			$regex: `.*${param.nick}.*`,
			$options: 'ix'
		}
	}

	if (!isNaN(param.cedula) && param.cedula > 500000) {
		let person = undefined;

		try {
			person = await Person.findOne({cedula: param.cedula});

			if (person) {
				search.person = person._id;
			} else {
				search.person = null
			}
		} catch (e) {
			console.error(`Error buscando persona en usuarios: ${e}`);
		}

		person = undefined;
	}

	if(param.last && !isEmpty(param.last)) {
		last  = {
			'_id': {
				$gt: param.last
			}
		}
	}

	const query = User.find(Object.assign(last, search), {
		password: 0
	}).limit(limit);
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
