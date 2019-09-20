const express = require('express');
const router = express.Router();
const User = require("../../models/User");

router.patch("/", async (req, res) => {

	const {validation, trim, junkPassword} = require("../../app/principals");

	let param = req.body;

	if (!param._id) {
		res.send({
			code: 500,
			message: 'No se encontro el usuario a modificar'
		});
		return;
	}

	try {
		param.nick = trim(param.nick);
	} catch (e) {
		throw new Error(`Error de nick: ${e}`);
	}

	let validate = validation({
		nick: {
			value: param.nick,
			type: String
		},
		acceso: {
			value: param.access,
			type: Array
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
		exists = await User.findOne({
			_id: param._id
		});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error ${e}`
		})
		return;
	}

	if (!exists) {
		res.send({
			code: 500,
			message: 'No existe el usuario a modificar'
		});
		return;
	}

	try {
		exists = await User.findOne({
			nick: param.nick,
			_id: {
				$ne: param._id
			}
		});
	} catch (e) {
		res.send({
			code: 500,
			message: `Error ${e}`
		})
		return;
	}

	if (exists) {
		res.send({
			code: 500,
			message: 'Ya hay alguien con este nick'
		});
		return;
	}

	const user = {
		nick: param.nick,
		access: param.access
	};

	if (param.reset_pwd) {
		user.password = junkPassword(process.env.DEFAULT_PASS);
	}

	User.updateOne({
		_id: param._id
	}, user, {
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
				message: 'No se pudo actualizar el usuario'
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
