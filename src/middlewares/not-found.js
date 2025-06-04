const notFoundHandler = (_, res) => {
	res.status(404).redirect('/');
};

module.exports = notFoundHandler;