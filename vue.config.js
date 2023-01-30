const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
    /* 输出文件目录：在npm run build时，生成文件的目录名称 */
    outputDir: 'dist',
    assetsDir: "assets",
    indexPath: 'index.html',
    lintOnSave: true,
    runtimeCompiler: false,
    transpileDependencies: [],
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    configureWebpack: (config) => {
        if (isProduction) {
          // 开启分离js
          config.optimization = {
            runtimeChunk: 'single',
            splitChunks: {
              chunks: 'all',
              maxInitialRequests: Infinity,
              minSize: 20000,
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name(module) {
                    // get the name. E.g. node_modules/packageName/not/this/part.js
                    // or node_modules/packageName
                    const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                    // npm package names are URL-safe, but some servers don't like @ symbols
                    return `npm.${packageName.replace('@', '')}`;
                  },
                },
              },
            },
          };
          // 取消webpack警告的性能提示
          config.performance = {
            hints: 'warning',
            // 入口起点的最大体积
            maxEntrypointSize: 50000000,
            // 生成文件的最大体积
            maxAssetSize: 30000000,
            // 只给出 js 文件的性能提示
            assetFilter(assetFilename) {
              return assetFilename.endsWith('.js');
            },
          };
        }
      },
      chainWebpack(config) {
        config.resolve.symlinks(true),
        config.plugin('html').tap(args=>{
          args[0].remark = "在里是配置的remark";
          return args
        })
        config.module
          .rule('yml')
          .test(/\.ya?ml$/)
          .use('json')
          .loader('json-loader')
          .end()
          .use('yaml')
          .loader('yaml-loader')
          .end();
    
        config.module
          .rule('i18n')
          .resourceQuery(/blockType=i18n/)
          .type('javascript/auto')
          .use('i18n')
          .loader('@kazupon/vue-i18n-loader')
          .end()
          .use('yaml')
          .loader('yaml-loader')
          .end();
      },
    css: {
        // extract: true,
        //  1. 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        //  2. 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        sourceMap: false,
        // 1. 是否开启 CSS source map？ 设置为 true 之后可能会影响构建的性能。
        loaderOptions: {
            css: {
              // 这里的选项会传递给 css-loader
            },
            // 给 sass-loader 传递选项
            sass: {
              // @/ 是 src/ 的别名
              // 所以这里假设你有 `src/variables.scss` 这个文件
            //   data: '@import "@/assets/styleSheet/variables.scss";',
            },
        },
        requireModuleExtension: true    
      },
    devServer: {
        //open 在devServer启动且第一次构建完成时，自动用我们的系统的默认浏览器去打开要开发的网页
        open: false,
        //默认是 localhost。如果你希望服务器外部可访问，指定如下 host: '0.0.0.0'，设置之后之后可以访问ip地址
        host: '0.0.0.0',
        port: 8088,
        https: false,
        hot: true,
        hotOnly: false,
        /* 使用代理 */
        proxy: {
          '/api': {
            target: 'http://admin.naturalhigh.xyz/api',  
            // target: 'https://cd.admin.idworlds.com/api/',
            secure: false,  // 如果是https接口，需要配置这个参数
            ws: false,//是否代理websockets
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        }
      },
}