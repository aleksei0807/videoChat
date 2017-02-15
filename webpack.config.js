/* eslint-disable */
const NODE_ENV = process.env.NODE_ENV || 'development';
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var RemoveWebpackPlugin = require('remove-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var functions = require('postcss-functions');
var precss = require('precss');
var atImport = require("postcss-import");
var easyImport = require('postcss-easy-import');
var postCssModules = require('postcss-modules');

var postCssLoader = [
	'css-loader?modules',
	'&importLoaders=1',
	'&localIdentName=[name]__[local]___[hash:base64:5]',
	'&disableStructuralMinification',
	'!postcss-loader'
];

module.exports = {
	devtool: 'source-map',
	entry: {
		index: './frontend/src/index.jsx'
	},
	output: {
		path: './frontend/dist',
		filename: 'static/index.js'
	},
	plugins: [
		new RemoveWebpackPlugin('./frontend/dist', 'hide'),
		new webpack.NoErrorsPlugin(),
		new HtmlWebpackPlugin({
            template: './frontend/src/index.html',
            inject: true
        }),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
		    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
		}),
		new ExtractTextPlugin("static/styles.css", {})
	],
	resolve: {
		moduleDirectories: ['node_modules'],
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.(js|jsx)$/,
				loaders: ['babel'],
				exclude: /node_modules/,
				include: __dirname
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', postCssLoader.join(''))
			}, {
				test: /\.png$/,
				loader: "file-loader?name=/static/images/[hash].[ext]"
			}, {
				test: /\.jpg$/,
				loader: "file-loader?name=/static/images/[hash].[ext]"
			}, {
				test: /\.gif$/,
				loader: "file-loader?name=/static/images/[hash].[ext]"
			}, {
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader?name=/static/fonts/[hash].[ext]'
			}
		]
	},
	postcss: function() {
		return [
			atImport({
				plugins: [easyImport],
			}),
			require('postcss-assets')({
				loadPaths: ['**'],
			}),
			require('postcss-mq-keyframes'),
			postCssModules({
				scopeBehaviour: 'global',
				generateScopedName: '[name]__[local]___[hash:base64:5]',
			}),
			autoprefixer,
			precss({
				variables: {
					variables: require('./frontend/src/styles/vars.css')
				}
			}),
			functions({
				functions: require('./frontend/src/styles/funcs.css')
			})
		];
	}
};

if (NODE_ENV === 'development') {
	module.exports.plugins.unshift(
		new RemoveWebpackPlugin('./frontend/dist', 'hide')
	);
}

if (NODE_ENV === 'production') {
	postCssLoader.splice(1, 1); // drop human readable names

	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				unsafe: true
			}
		})
	);
}
