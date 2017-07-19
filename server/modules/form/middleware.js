export default (req, res, next) => {

	res.locals.countryCode = req.query.countryCode || 'GBR';

	return next();
}
