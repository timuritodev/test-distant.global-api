module.exports = (err, req, res, next) => {
	console.error('Error details:', {
		message: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
		body: req.body,
		params: req.params,
		query: req.query,
	});
	res.status(500).json({
		message: 'Server error',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined,
	});
};
