const webpackConfig = require('./webpack.config.js');

delete webpackConfig.entry;
delete webpackConfig.externals;
delete webpackConfig.output;
delete webpackConfig.plugins;

webpackConfig.devtool = 'inline-source-map';

module.exports = function(config) {
    config.set({
        browserConsoleLogOptions: {
            level: 'error',
            format: '%b %T: %m',
            terminal: false
        },

        browsers: ['PhantomJS', 'ChromeHeadless'],

        client: {
            mocha: {
                reporter: 'html'
            }
        },

        files: [
            { pattern: 'test/*.spec.js', watched: false }
        ],

        frameworks: ['babel-polyfill', 'mocha', 'chai'],

        logLevel: config.LOG_ERROR,

        plugins: [
            'karma-babel-polyfill',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-sourcemap-loader',
            'karma-chai',
            'karma-webpack'
        ],

        preprocessors: {
            'test/*.spec.js': ['webpack', 'sourcemap']
        },

        reporters: ['dots'],

        singleRun: true,

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true,
            stats: 'errors-only'
        }
    });
};
