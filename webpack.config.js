const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // mode: 'development',
  entry: {
    index: './src/js/index.js',
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'public/build'
  },
  resolve: {
    alias: {
      js: 'src/js'
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            }
          ]
        })
      },
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.ts|tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          }
        ]
      },
      {
        test: /\.png|jpg|jpeg|gif$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 500000,
              outputPath: 'images/'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html',
      filename: __dirname + '/build/index.html',
      hash: true
    }),
    new ExtractTextWebpackPlugin({
      filename: './src/css/index.css',
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    port: 3200,
    compress: true,
    open: true,
    hot: true
  }
}