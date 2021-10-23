const CopyWebpackPlugin = require('copy-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.js',
    popup: './src/popup.js'
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: ['pt-br']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/images',
          to: 'images'
        },
        {
          from: './src/_locales',
          to: '_locales'
        },
        {
          from: './src/manifest.json'
        },
        {
          from: './src/popup.html',
        }
      ]
    })
  ]
}