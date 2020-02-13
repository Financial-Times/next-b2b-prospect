const path = require('path');

module.exports = {
    plugins: [
        require('@financial-times/dotcom-build-js').plugin(),
        require('@financial-times/dotcom-build-sass').plugin(),
        require('@financial-times/dotcom-build-bower-resolve').plugin(),
        require('@financial-times/dotcom-build-code-splitting').plugin()
    ],
    settings: {
        build: {
            entry: {
                scripts: './client/main.js',
                styles: './client/main.scss',
                'page-kit-layout-styles': require.resolve('@financial-times/dotcom-ui-layout/styles.scss')
            },
            outputPath: path.resolve('./public')
        }
    }
};
