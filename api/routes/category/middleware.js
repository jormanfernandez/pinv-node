const middlewares = [
	require('./create'),
	require('./modify'),
	require('./list')
];

module.exports = middlewares;