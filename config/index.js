var path = require('path') //使用Node自带的文件路径插件
module.exports = {
  // 生产环境配置
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'), // 编译注入的 index.html 文件,必须是本地的绝对路径
    assetsRoot: path.resolve(__dirname, '../dist'), // 编译输出的静态资源根路径
    assetsSubDirectory: 'static', // 编译输出的二级目录
    assetsPublicPath: './', // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
    productionSourceMap: true, //生成用于生产构建的源映射
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 是否开启 gzip
    productionGzipExtensions: ['js', 'css'], // 需要使用 gzip 压缩的文件扩展名

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report, //一个实用工具,用于分析项目的依赖关系https://www.npmjs.com/package/webpack-bundle-analyzer
  },

  // 开发环境
  dev: {
    env: require('./dev.env'), // 使用 config/dev.env.js 中定义的编译环境
    assetsSubDirectory: 'static', // 编译输出的二级目录
    assetsPublicPath: '', // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
    host: 'localhost.hotel.com',
    port: 8086,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true,
    proxyTable: {
      '/rest': { // 开发环境起代理
        target: 'https://patientlist.7sugou.cn', 
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/rest': 'rest',
        },
      },
    },
  },
}
