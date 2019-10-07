const express = require('express');
const router = express.Router();
const Management = require("../../models/Management");

router.get("/", (req, res) => {

	const {isEmpty, extractTime, extractDate} = require("../../app/principals"); 
	const mongoose = global.mongoose; 
	const ObjectId = mongoose.Types.ObjectId;

	let {
		department, 
		category, 
		assigned, 
		date_max, 
		date_min,
		serial,
		state, 
		mark
	} = req.query;
	let aggregate = [
		{
			$lookup: {
				from: 'articles',
				localField: 'article',
				foreignField: '_id',
				as: 'article'
			}
		},
		{
			$unwind: '$article'
		},
		{
			$lookup: {
				from: 'article_states',
				localField: 'state',
				foreignField: '_id',
				as: 'state'
			}
		},
		{
			$unwind: '$state'
		}
	];

	if (!isEmpty(serial)) {
		aggregate.push({
			$match: {
				'article.serial': serial
			}
		});
	}

	if (!isEmpty(date_max)) {
		date_max = new Date(date_max);
		date_max.setHours(0, 0, 0);
		aggregate.push({
			$match: {
				created: {
					$lte: date_max
				}
			}
		});
	}

	if (!isEmpty(date_min)) {
		date_min = new Date(date_min);
		date_min.setHours(23, 59, 59);
		aggregate.push({
			$match: {
				created: {
					$gte: date_min
				}
			}
		});
	}

	if (!isEmpty(state)) {
		aggregate.push({
			$match: {
				'state._id': new ObjectId(state.padStart(12, '0'))
			}
		});
	}

	if (!isEmpty(department)) {
		aggregate.push({
			$match: {
				department: new ObjectId(department.padStart(12, '0'))
			}
		});
	}

	aggregate.push({
		$lookup: {
			from: 'personas',
			localField: 'person',
			foreignField: '_id',
			as: 'person'
		}
	});
	aggregate.push({
		$unwind: {
			path: '$person',
			preserveNullAndEmptyArrays: true
		}
	});

	aggregate.push({
		$lookup: {
			from: 'departments',
			localField: 'department',
			foreignField: '_id',
			as: 'department'
		}
	});
	aggregate.push({
		$unwind: {
			path: '$department',
			preserveNullAndEmptyArrays: true	
		}
	});

	aggregate.push({
		$lookup: {
			from: 'categories',
			localField: 'article.category',
			foreignField: '_id',
			as: 'article.category'
		}
	});
	aggregate.push({
		$unwind: {
			path: '$article.category',
			preserveNullAndEmptyArrays: true
		}
	});

	aggregate.push({
		$lookup: {
			from: 'marks',
			localField: 'article.mark',
			foreignField: '_id',
			as: 'article.mark'
		}
	});
	aggregate.push({
		$unwind: {
			path: '$article.mark',
			preserveNullAndEmptyArrays: true
		}
	});


	if (!isEmpty(category)) {
		aggregate.push({
			$match: {
				'article.category._id': new ObjectId(category.padStart(12, '0'))
			}
		});
	}

	if (!isEmpty(mark)) {
		aggregate.push({
			$match: {
				'article.mark._id': new ObjectId(mark.padStart(12, '0'))
			}
		});
	}

	/**/
	aggregate.push({
		$project: {
			"created": 1,
			"article.serial": 1,
			"article.category.nombre": 1,
			"article.mark.nombre": 1,
			"state.nombre": 1,
			"department.nombre": 1,
			"person.nombre": 1,
			"person.apellido": 1,
			"person.cedula": 1,
			"note": 1,
			"assigned": 1

		}
	});
	/**/

	let query = Management.aggregate(aggregate);

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

		response = response.map(value => {
			let row = {};
			row['Fecha'] = `${extractDate(value.created)} ${extractTime(value.created)}`;
			row['Articulo - Serial'] = value.article.serial;
			row['Articulo - Categoria'] = value.article.category.nombre;
			row['Articulo - Marca'] = value.article.mark.nombre;
			row['Estado'] = value.state.nombre;
			row['Asignado'] = value.assigned ? 'Si' : 'No';
			row['Departamento'] = value.assigned ? value.department.nombre : '-';
			row["Persona - Nombre"] = value.persona ? `${value.persona.apellido} ${value.persona.nombre}`: '-' ;
			row["Persona - Cedula"] = value.persona ? value.persona.cedula : '-';
			row["Puesto"] = value.puesto || '-';
			row['Nota'] = value.note || '-';
			return row;
		});

		res.send({
			code: 200,
			message: response
		})
	});
});


module.exports = router;
