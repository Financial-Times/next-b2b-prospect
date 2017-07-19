module.exports = {
	withBabelPolyfills: true,
	withHashedAssets: true,
	entry: {
		'./public/main.js': './client/main.js',
		'./public/main.css': './client/main.scss'
	}
};
