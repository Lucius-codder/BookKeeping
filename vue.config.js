const { defineConfig } = require("@vue/cli-service");
const path = require('path')
const { name } = require('./package')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.symlinks(true);
  },
  configureWebpack: (config) => {
    // 生产环境下使用gzip
    if (process.env.NODE_ENV === "production") {
      const CompressionWebpackPlugin = require("compression-webpack-plugin");
      // 增加浏览器CPU（需要解压缩）， 减少网络传输量和带宽消耗 （需要衡量，一般小文件不需要压缩的）
      // 图片和PDF文件不应该被压缩，因为他们已经是压缩的了，试着压缩他们会浪费CPU资源而且可能潜在增加文件大小。
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]", // asset -> filename
          algorithm: "gzip",
          test: /\.(js|css)$/,
          threshold: 10240, // 达到10kb的静态文件进行压缩 按字节计算
          minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
          deleteOriginalAssets: false, // 是否删除压缩的源文件
        })
      );
    } else {
      return {
        resolve: {
          alias: {
            '@': resolve('src')
          }
        },
        output: {
          // 把子应用打包成 umd 库格式
          library: `${name}-[name]`,
          libraryTarget: 'umd', // 把微应用打包成 umd 库格式
          chunkLoadingGlobal: `webpackJsonp_${name}`,
        },
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            "text-color": "#111",
            "border-color": "#eee",
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          },
        },
      },
    },
  },
  devServer: {
    port: 8087,
    headers: {
      'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': '*',
'Access-Control-Allow-Headers': '*',
'Access-Control-Allow-Credentials': true
    },
    proxy: {
      "/ISAPI": {
        //指定后端服务路径
        target: "http://127.0.0.1:3000",
        //后端路径中没有api,所以需要在代理中重写
        pathRewrite: {
          "^/ISAPI": "",
        },
      },
    },
  }
});
