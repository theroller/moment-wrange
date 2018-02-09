'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Build Multiple Configurations
module.exports = [
    getConfig(),
    getConfig({ minify: true })
];

// Access to unique configs
module.exports.getConfig = getConfig;


function getConfig(opts) {

    // Options
    const defaultOpts = {
        minify: false,      // Minify Output
        test: false         // Test / Production Environment
    };
    opts = Object.assign({}, defaultOpts, opts);

    // Result
    const config = {};


    // Defaults
    // -------------------------------------------------------------------------
    const entry = './src/index.js';
    const externals = {
        moment: 'moment'
    };
    const module = {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    cacheDirectory: '/tmp/',
                    presets: ['env']
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre'
            }
        ]
    };
    const output = {
        filename: 'moment-wrange.js',
        library: 'moment-wrange',
        libraryTarget: 'umd',
        path: path.join(__dirname, 'dist'),
        umdNamedDefine: true
    };
    const plugins = [
        new webpack.NoEmitOnErrorsPlugin()
    ];
    const resolve = {
        modules: [
            path.resolve(__dirname, './src'),
            path.resolve(__dirname, './node_modules')
        ]
    };
    const resolveLoader = {
        modules: [
            path.resolve(__dirname, './node_modules')
        ]
    };


    // Customizations Based on Output
    // -------------------------------------------------------------------------

    // Minification
    if (opts.minify) {
        output.filename = 'moment-wrange.min.js',
        plugins.push(new UglifyJsPlugin({
            parallel: true,
            sourceMap: true
        }));
    }

    // Test vs Production
    if (opts.test) {
        config.devtool = 'inline-source-map';
    } else {
        config.devtool = 'source-map';
        config.entry = entry;
        config.externals = externals;
        config.output = output;
        config.plugins = plugins;
    }

    // Universal
    config.module = module;
    config.resolve = resolve;
    config.resolveLoader = resolveLoader;

    return config;
};
