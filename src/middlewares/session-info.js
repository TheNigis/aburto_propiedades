async function setCustomSessionInfo (req, res, next) {
	res.locals.session = req.session;
	res.locals.user = req.user;

	next();
};

module.exports = { setCustomSessionInfo };