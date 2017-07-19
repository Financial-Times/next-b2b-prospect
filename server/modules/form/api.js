export default {
	form: (req, res, next) => {
		res.render('form', {
			layout: 'vanilla',
			countryCode: res.locals.countryCode
		});
	},
	confirmation: (req, res, next) => {
		res.render('confirm', {
			layout: 'vanilla'
		});
	},
}
