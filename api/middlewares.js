const routesGet = require('./routes/get');
const routesPost = require('./routes/post');
const routesDelete = require('./routes/delete');
const routesPatch = require('./routes/patch');

const middlewares = [
	routesGet,
	routesPost,
	routesDelete,
	routesPatch
];

module.exports = middlewares;