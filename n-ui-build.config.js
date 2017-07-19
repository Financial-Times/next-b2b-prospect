module.exports = {
	withBabelPolyfills: true,
	withHashedAssets: false,
	entry: {
		'./public/main.js': './client/main.js',
		'./public/main.css': './client/main.scss'
	}
};
