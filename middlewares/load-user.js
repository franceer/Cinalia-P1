module.exports = function (req, res, next){
	if(req.isAuthenticated())
		res.locals.user = req.user.toJSON();
	
	next();
}