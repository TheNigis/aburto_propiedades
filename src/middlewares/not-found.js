const notFoundHandler = (_, res) => {
	res.status(404).render('404', { user: {} });
};

module.exports = notFoundHandler;