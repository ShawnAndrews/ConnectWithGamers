
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/entry.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', 'less-loader' ]
        })
      },
      {
        test: /\.tsx?$/,
        loader: ['babel-loader', 'ts-loader'],
        exclude: ['node_modules', './dist']
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
			filename: "bundle.css"
		}),
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: 'index.html'
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".less"]
  }
};