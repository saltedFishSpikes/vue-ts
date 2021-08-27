const path = require('path');
const openInEditor = require('launch-editor-middleware')

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  assetsDir: 'static',
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'));
    config.output.filename('js/[name].[hash:8].js').end();
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        },
      },
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        resolve("./src/assets/less/var.less"),
      ],
    },
  },
  devServer: {
    before(app) {
      app.use('/__open-in-editor', openInEditor())
    }
  }
}