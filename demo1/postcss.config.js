module.exports = {
  // module: {
  //   test: /\.css$/,
  //   use: [
  //     {
  //       loader: 'style-loader'
  //     }, {
  //       loader: 'css-laoder',
  //       options: {
  //         modules: true
  //       }
  //     }, {
  //       loader: 'postcss-loader'
  //     }
  //   ]
  // },
  plugins: [
    require('autoprefixer')
  ]
}