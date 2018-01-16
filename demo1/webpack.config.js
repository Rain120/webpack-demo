const path = require('path')
const uglify = require('uglifyjs-webpack-plugin')
const htmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const glob = require('glob')
const purifyCssPlugin = require('purifycss-webpack')
const webpack = require('webpack')
const copyWebpackPlugin= require("copy-webpack-plugin");

if(process.env.type == "build") {
  const webSite = {
    publicPath: 'http://192.168.226.254:3300/'
  }
} else {
  const webSite = {
    publicPath: 'https://cdn.bootcss.com/xxxx'
  }
}
module.exports = {
  // devtool: 'source-map',
  devtool: 'eval-source-map',
  // devtool: 'cheap-module-source-map',
  // devtool: 'cheap-module-eval-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    // publicPath: webSite.publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ['style-loader', 'css-loader'], use: [   {     loader: 'style-loader'
        // }, {     loader: 'css-loader'   } ] loader: ['style-loader', 'css-loader'],
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        })
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 500000,
              outputPath: 'images/'
            }
          }
        ]
      }, {
        test: /\.(htm|html)$/,
        use: ['html-withimg-loader']
      }, {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'less-loader'
          }
        ]
      }, {
        test: /\.sass$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }
        ]
      }, {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "es2015",
              "react"
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new uglify(),
    new htmlPlugin({
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    }),
    new extractTextPlugin('./src/css/index.css'),
    new purifyCssPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    }),
    new webpack.BannerPlugin('Rainy'),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['juqery', 'vue'],
      filename: 'assets/js/[name].js',
      minChunks: 2
    }),
    new copyWebpackPlugin([{
      from: __dirname + '/src/public',
      to: './public'
    }])
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost',
    compress: true,
    port: 3300
  }
}