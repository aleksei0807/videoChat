/* eslint-disable */
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || '8080';
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
		'webpack-dev-server/client?https://10.2.0.1:' + PORT,
		'webpack/hot/dev-server',
		'./client/src/index.jsx'
	],
	output: {
		path: path.join(__dirname, 'client/dist'),
		filename: '/js/index.js'
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './client/index.html'
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
			postCssModules({
				scopeBehaviour: 'global',
				generateScopedName: '[name]__[local]___[hash:base64:5]',
			}),
			autoprefixer,
			precss({
				variables: {
					variables: require('./client/src/styles/vars.css')
				}
			}),
			functions({
				functions: require('./client/src/styles/funcs.css')
			})
		];
	},
	devServer: {
		contentBase: './client/dist',
		hot: true,
		host: '10.2.0.1',
		port: PORT,
		https: true,
	}
};
