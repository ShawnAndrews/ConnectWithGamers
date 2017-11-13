var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/entry.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader' ]
        })
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
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
      extensions: ['.js', '.jsx'],
  }
};