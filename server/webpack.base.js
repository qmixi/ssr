const Dotenv = require('dotenv-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // tell webpack to run babel on the each file
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                query: {
                    cacheDirectory: true,
                    plugins: [
                        'transform-decorators-legacy',
                        "transform-class-properties"
                    ],
                    presets: ['es2015', 'react', 'stage-2', ['env', { targets: { browsers: 'last 2 versions' } }]]
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ]
                })
            }
        ]
    },
    plugins: [
        new Dotenv(),
        new ExtractTextPlugin("styles.css")
    ]
}