export default {
	form: (req, res, next) => {
		res.render('form', {
			title: 'Signup',
			layout: 'vanilla',
			countryCode: res.locals.countryCode
		});
	},
	confirmation: (req, res, next) => {
		res.render('confirm', {
			title: 'Signup',
			layout: 'vanilla'
		});
	},
}
