const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./package.json');

let mode = 'production';
if (process.env.NODE_ENV === 'development') {
	mode = 'development';
}

module.exports = {
	mode,
	entry: {
		app: './src/index.js',
		vendor: Object.keys(pkg.dependencies),
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist/static'),
	},
	resolveLoader: {
		modules: [path.resolve(__dirname, 'node_modules')],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					enforce: true,
					chunks: 'all',
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react'],
					},
				},
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
							sourceMap: mode === 'development',
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: mode === 'development',
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
	devtool: mode === 'production' ? undefined : 'source-map',
};
