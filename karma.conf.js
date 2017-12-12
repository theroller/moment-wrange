'use strict';

const webpackConfig = require('./webpack.config.js').getConfig({ test: true });

module.exports = function(config) {
    config.set({
        browserConsoleLogOptions: {
            level: 'error',
            format: '%b %T: %m',
            terminal: false
        },

        browsers: ['PhantomJS', 'ChromeHeadless', 'FirefoxHeadless'],

        client: {
            mocha: {
                reporter: 'html'
            }
        },

        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: [ '-headless' ],
            },
        },

        files: [
            { pattern: 'test/*.spec.js', watched: false }
        ],

        frameworks: ['babel-polyfill', 'mocha', 'chai'],

        junitReporter: {
            outputDir: 'junit',
            outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {} // key value pair of properties to add to the <properties> section of the report
        },

        logLevel: config.LOG_ERROR,

        plugins: [
            'karma-babel-polyfill',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-junit-reporter',
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
