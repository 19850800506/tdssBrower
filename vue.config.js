const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const cesiumSource = './node_modules/mars3d-cesium/Build/Cesium'

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  publicPath: './',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: false,
  // webpack 简单配置
  configureWebpack: (config) => {
    config.resolve.alias['@'] = resolve('src')
    config.resolve.extensions.push('.ts', '.tsx')

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, cesiumSource),
            to: './static/js/Cesium',
          },
        ],
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./static/js/Cesium'),
      })
    )
  },
  transpileDependencies: ['screenfull'],
}
