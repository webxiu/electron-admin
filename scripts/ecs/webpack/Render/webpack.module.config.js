const Core = require('../../core');
const config = require('../../../../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /.*\.(tsx|ts)$/,
        exclude: [Core.JoinCwd('node_modules'), Core.JoinCwd('src', 'Render/assets/langage')],
        include: Core.JoinCwd('src', 'Render'),
        loader: Core.JoinCwd('language', 'lib'),
      },
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
        exclude: [Core.JoinCwd('node_modules'), Core.JoinCwd('src', 'Render/assets/icons')],
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
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        include: Core.JoinCwd('src', 'Render/assets/icons'),
        options: {
          symbolId: "icon-[name]"
        }
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
                javascriptEnabled: true
              }
            }
          },
          /** less全局变量 */
          {
            loader: 'style-resources-loader',
            options: {
              // globOptions: {},
              /** 导入资源的路径，绝对路径, 导入多个patterns可以为一个数组 */
              patterns: Core.JoinCwd('src', 'Render/assets/css/style.less'),
              /** prepend 和 append 样式资源导入在之前还是之后，后导入会覆盖前面导入的 */
              injector: 'append',
              /** 是否允许@import形式导入，默认true */
              resolveUrl: true
            }
          }
        ]
      },
      /** 项目全局 css 样式，没有 modules */
      {
        test: /\.(css)$/,
        // include: [Core.JoinCwd('src', 'Render', 'assets', 'css')],
        use: [
          Core.isPro() ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  /** autoprefixer css3 将未来的 CSS 特性带到今天！ 帮你将最新的 CSS 语法转换成大多数浏览器都能理解的语法，并根据你的目标浏览器或运行时环境来确定你需要的 polyfills，此功能基于 cssdb 实现 */
                  'postcss-preset-env',
                  /** @import ''; */
                  'postcss-import',
                  /** sass 语法 */
                  'precss',
                  /** css flex 解析，简写和全写 */
                  'postcss-flexbugs-fixes'
                  /** 压缩 optimize-css-assets-webpack-plugin 统一处理 */
                  // Core.isPro() ? ['cssnano'] : null
                ]
              }
            }
          }
        ]
      }
    ].filter(Boolean)
  }
};
