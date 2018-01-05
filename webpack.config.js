const path = require('path');
// JS压缩插件
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
// 使用这个插件必须配合extract-text-webpack-plugin这个插件，
const PuryfyCssPlugin = require('purifycss-webpack');
const entry = require('./webpack_config/entry_webpack.js')
const copyWebpackPlugin = require('copy-webpack-plugin');

// const website = {
//   publicPath: "http://192.168.226.70:1717/"
// };
if(process.env.type == "build") {
  var website = {
    publicPath: "http://192.168.226.70:1717/"
  }
} else {
  var website = {
    publicPath: "http://cdn.jspang.com/"
  }
}

module.exports={
  // 打包文件模块
  // devtool: 'cheap-module-eval-source-map',
  //入口文件的配置项
  entry:{
      entry: entry.path,
      jquery: 'jquery',
      vue: 'vue'
  },
  //出口文件的配置项
  output:{
      //输出的路径，用了Node语法
      path: path.resolve(__dirname,'dist'),
      //输出的文件名称
      filename: '[name].js',
      // 静态图片路径
      publicPath: website.publicPath
  },
  //模块：例如解读CSS,图片如何转换，压缩
  module:{
    rules: [
      {
        // 用于匹配处理文件的扩展名的表达式，这个选项是必须进行配置的
        test: /\.css$/,
        // loader名称，就是你要使用模块的名称，这个选项也必须进行配置，否则报错
        // use: ['css-loader', 'style-loader'],
        use: extractTextPlugin.extract({
          // 在webpack.config.js文件的output选项中，主要作用就是处理静态文件路径的。
          fallback: 'style-loader',
          // use: 'css-loader'
          use: [
            { loader: 'css-loader', options: { importLoaders: 1} }, 
            'postcss-loader']
        })
      }, {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'            
        }, {
          loader: 'less-loader'
        }]
        // use: extractTextPlugin.extract({
        //   use: [{
        //     loader: 'css-loader'
        //   }, {
        //     loader: 'less-loader'
        //   }, {
        //     // use style-loader in development
        //     fallback: 'style-loader'
        //   }]
        // })
      }, {
        // /\.(png|jpg|gif)/是匹配图片文件后缀名称。
        test: /\.(jpg|png|gif)$/,
        // 是指定使用的loader和loader的配置参数。
        use: [{
          loader: 'url-loader',
          options: {
            // 是把小于500000B的文件打成Base64的格式，写入JS。
            limit: 500000,
            outputPath: 'images/'
          }
        }]
      }, {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              'env', 'react'
          ]
          }
        }]
      }, {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      }
    ]
  },
  //插件，用于生产模版和各项功能
  plugins:[
    new HotModuleReplacementPlugin(),
    new uglify(),
    new htmlPlugin({
      // 是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
      minify: {
        removeAttributeQuotes: true
      },
      // 为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
      hash: true,
      // 是要打包的html模版路径和文件名称。
      template: './src/index.html'
    }),
    new extractTextPlugin("/css/index.css"),
    // 使用这个插件必须配合extract-text-webpack-plugin这个插件，
    new PuryfyCssPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    }),
    // ProvidePlugin是webpack自带的插件
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    // 使用后会在JS中加上我们的版权或开发者声明。
    new webpack.BannerPlugin('Rainy test~~~'),
    // 优化组件
    new webpack.optimize.CommonsChunkPlugin({
      // name对应入口文件中的名字
      name: ['jquery', 'vue'],
      // 把文件打包到哪里，是一个路径
      filename: 'assets/js/[name].js',
      // 最小打包的文件模块数
      minChunks: 2
    }),
    new copyWebpackPlugin([{
      // 要打包的静态资源目录地址，这里的__dirname是指项目目录下，是node的一种语法，可以直接定位到本机的项目目录中。
      from: __dirname + 'src/public',
      // 要打包到的文件夹路径，跟随output配置中的目录。所以不需要再自己加__dirname。
      to: './public'
    }])
  ],
  //配置webpack开发服务功能
  devServer:{
    // 设置基本目录结构
    contentBase: path.resolve(__dirname, 'dist'),
    // 服务器IP地址，可以使用IP或localhost
    host: 'localhost',
    // 服务器压缩是否开启
    compress: true,
    // 配置服务端口号
    port: 1717
  },
  watchOptions: {
    // 检测修改的时间，以ms为单位
    poll: 1000,
    // 防止重复保存而发生重复编译错误
    aggregeateTimeout: 500,
    // 不监听的目录
    ignored: /node_modules/
  }
}