const middlewares = [
	require('./login'),
	require('./list'),
	require('./create'),
	require('./modify'),
];

module.exports = middlewares;