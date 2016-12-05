/* global process */
var path = require('path'),
	  DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
	  entry: {
		      'main': ['babel-polyfill', './src/js/main.es6'],
		    },
	  output: {
		      publicPath: './static/ssd-labeling/js/',
		      filename: '[name].bundle.js',
		      chunkFilename: '[name].[id].[chunkhash].chunked.js',
		    },
	  devServer: {
		        contentBase: [__dirname, path.join(__dirname, "./www")],
		        port: 9999
		    },
	  module: {
		      loaders: [
			            {
					            test: /\.es6$/,
					            exclude: /node_modules/,
					            loader: 'babel',
					            query: {
							              cacheDirectory: true,
							            },
					          },
			            {test: /\.json$/, loader: 'json'},
			            {
					            test: /\.css$/,
					            exclude: /node_modules/,
					            loader: "style-loader!css-loader"
					          },
			          ],
		    },
	  resolve: {
		      root: path.resolve('./src/js'),
		      modulesDirectories: ['node_modules'],
		      extensions: ['', '.es6', '.js'],
		    },
	  plugins: [
		      new DefinePlugin({
			            'DANCE_ENV': JSON.stringify(process.env.DANCE_ENV),
			            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			          }),
		    ],
}
