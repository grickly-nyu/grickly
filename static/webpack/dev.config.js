const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
require("dotenv").config();
module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'bootstrap-loader',
        'webpack-hot-middleware/client',
        './src/index',
    ],
    output: {
        publicPath: '/dist/',
    },

    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass',
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"',
                host: process.env.host,
            },
            __DEVELOPMENT__: true,
        }),
        new ExtractTextPlugin('bundle.css'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
        }),
    ],
};
