const Core = require('../../core');
const config = require('../../../../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      config.eslint && {
        test: /\.(tsx|ts)$/,
        enforce: 'pre',
        include: /Render/,
        use: [
          'thread-loader',
          {
            loader: 'eslint-loader',
            options: {
              fix: false,
              cache: false,
              emitError: true,
              emitWarning: true,
              /** 对输出进行格式化 */
              formatter: require.resolve('eslint-friendly-formatter')
            }
          }
        ]
      },
      {
        test: /\.(tsx|ts)$/,
        exclude: [Core.JoinCwd('node_modules'), Core.JoinCwd('src', 'Main')],
        use: [
          /** 'thread-loader' */
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              compact: false,
              presets: [
                /** presets */
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    debug: false,
                    targets: {
                      node: true,
                      browsers: 'last 2 versions'
                    },
                    corejs: {
                      version: 3
                    }
                  }
                ],
                [
                  '@babel/preset-typescript',
                  {
                    isTSX: true,
                    jsxPragma: 'React',
                    allExtensions: true,
                    allowNamespaces: true,
                    allowDeclareFields: true
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: [
                /** plugins */
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
                ['@babel/plugin-proposal-private-methods', { loose: true }],
                ['@babel/plugin-syntax-dynamic-import'],
                ['@babel/plugin-transform-runtime'],
                ['styled-jsx/babel'],
                ['babel-plugin-import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
                Core.isPro() ? null : ['react-refresh/babel']
              ].filter(Boolean)
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        exclude: [Core.JoinCwd('node_modules')],
        use: [
          {
            loader: 'file-loader',
            options: {
              //配置公共资源路径
              publicPath: '/assets/font',
              //配置输出路径
              outputPath: 'assets/font',
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.jpe?g|png|gif|svg|ico$/,
        exclude: [Core.JoinCwd('node_modules')],
        use: [
          {
            loader: 'url-loader',
            options: {
              /** 20k Base64 */
              limit: 20 * 1024,
              //配置公共资源路径
              publicPath: '/assets/img',
              //配置输出路径
              outputPath: 'assets/img',
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /** 处理第三方 less 样式 */
      {
        test: /\.(less)$/,
        include: [Core.JoinCwd('node_modules')],
        use: [
          Core.isPro() ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: config.antdTheme || {}
              }
            }
          }
        ]
      },
      /** 项目 less */
      {
        test: /\.(less)$/,
        exclude: [Core.JoinCwd('node_modules')],
        use: [
          /** 从 JS 中创建样式节点 */
          Core.isPro() ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          /** 转化 CSS 为 CommonJS */
          // {
          //   loader: 'css-loader',
          //   options: {
          //     url: true,
          //     import: true,
          //     sourceMap: false,
          //     esModule: true,
          //     importLoaders: 1,
          //     modules: {
          //       mode: 'local',
          //       exportGlobals: true,
          //       hashPrefix: 'hash',
          //       localIdentName: '[name]-[hash:8]'
          //     }
          //   }
          // },
          /** 编译 Less 为 CSS */
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                // 可再此处配置全局样式, 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                modifyVars: config.antdTheme,
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ].filter(Boolean)
  }
};
