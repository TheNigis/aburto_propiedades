const checkSession = (req, res, next) => {
	if (req.user) return next();
	else res.redirect('/');
};

module.exports = checkSession;