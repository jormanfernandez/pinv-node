const express = require('express');
const router = express.Router();
const User = require("../../models/User");

router.post("/login", (req, res) => {

	const {validation, trim} = require("../../app/principals");

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

	const sha256 = require("../../app/sha256");
	const Cipher = require("../../app/Cipher");
	let cipher = new Cipher(process.env.SALT);	

	param.nick = trim(param.nick);
	param.pass = trim(param.pass);
	param.pass = sha256(cipher.cifrar(param.pass)); 

	/**/
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

		if(user.password != param.pass) {
			res.send({
				code: 500,
				message: `Contraseña incorrecta`
			});
			return;
		}

		user.logIn(res.locals.session, (err, response) => {

			if(err) {
				res.send({
					code: 500,
					message: `Error logueando usuario: ${err}`
				});
				return;
			}

			if (!response.ok) {

				res.send({
					code: 500,
					message: "Error iniciando sesion"
				})
				return;
			}

			res.send({
				code: 200,
				message: {
					access: user.access,
					nick: user.nick
				}
			});
		});		
	});
	/**/
});

module.exports = router;
