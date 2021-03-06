/* eslint-disable */
const NODE_ENV = process.env.NODE_ENV || 'development';
const conf = require('./config.json').frontend;
const PORT = conf.port;
const host = conf.host;
console.log("Listening on", PORT);
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var functions = require('postcss-functions');
var precss = require('precss');
var atImport = require("postcss-import");
var easyImport = require('postcss-easy-import');
var postCssModules = require('postcss-modules');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var postCssLoader = [
	'css-loader?modules',
	'&importLoaders=1',
	'&localIdentName=[name]__[local]___[hash:base64:5]',
	'&disableStructuralMinification',
	'!postcss-loader'
];

module.exports = {
	devtool: 'cheap-eval-source-map',
	entry: [
		`webpack-dev-server/client?https://${host}:${PORT}`,
		'webpack/hot/dev-server',
		'./frontend/src/index.jsx'
	],
	output: {
		path: path.join(__dirname, 'frontend/dist'),
		filename: 'index.js'
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './frontend/src/index.html'
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
		})
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
				loaders: ['react-hot', 'babel'],
				exclude: /node_modules/,
				include: __dirname
			}, {
				test: /\.html$/,
				loader: 'raw-loader'
			}, {
				test: /\.css$/,
				loaders: ['style-loader', postCssLoader.join('')]
			}, {
				test: /\.png$/,
				loader: "file-loader?name=/images/[hash].[ext]"
			}, {
				test: /\.jpg$/,
				loader: "file-loader?name=/images/[hash].[ext]"
			}, {
				test: /\.gif$/,
				loader: "file-loader?name=/images/[hash].[ext]"
			}, {
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader?name=/fonts/[hash].[ext]'
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
	},
	devServer: {
		contentBase: './frontend/dist',
		hot: true,
		host,
		port: PORT,
		https: true,
	}
};
