const express = require('express');
const User = require("../models/User");
const router = express.Router();

router.post("/user/login", async (req, res) => {

	const {validation, trim} = require("../app/principals");

	let param = req.body;
	let validate = validation({
		nick: {
			value: param.nick,
			type: String
		},
		pass: {
			value: param.pass,
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

	const sha256 = require("../app/sha256");
	const Cipher = require("../app/Cipher");
	let cipher = new Cipher(process.env.SALT);	

	param.nick = trim(param.nick);
	param.pass = trim(param.pass);
	param.pass = sha256(cipher.cifrar(param.pass));

	User.findOne({nick: param.nick.toLowerCase()}, (err, user) => {

		if(err) {
			res.send({
				code: 500,
				message: `Error buscando usuario: ${err}`
			});
			return;
		}

		if(!user) {
			res.send({
				code: 500,
				message: `Usuario no encontrado`
			});
			return;
		}

		let data = user.toJSON();
		if(data.pwd != param.pass) {
			res.send({
				code: 500,
				message: `Contraseña incorrecta`
			});
			return;
		}

		res.send({
			code: 500,
			message: `Ending service: ${param.nick} - ${param.pass}`
		});
	}).select({
		_id: true,
		pwd: true
	});
})

module.exports = router;
