require('dotenv').config()

const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
const webpack = require('webpack')

const srcDir = join(__dirname, 'resources', 'dashboard', 'src')

const dist = join(__dirname, 'public', 'flatfile-dashboard')
const exclude = /(node_modules)/

const languageModule = join(srcDir, 'language', process.env.LANGUAGE || 'en')
console.log('Language data will be loaded from', languageModule)

const applicationConfig = {
  OAUTH_LOGIN_URL: process.env.OAUTH_LOGIN_URL || '/dashboard-login',
  FLATFILE_API_BASE: process.env.FLATFILE_API_BASE || '/api',
  SPARK_API_BASE: process.env.SPARK_API_BASE || ''
}

const configPlugin = new webpack.DefinePlugin({
  'APP_CONFIG': JSON.stringify(applicationConfig)
})

module.exports = {
  devServer: {
    contentBase: join(srcDir, 'public'),
    port: process.env.PORT || 4000,
    compress: false,
    inline: true,
    hot: true,
    historyApiFallback: {
      rewrites: [
        {
          from: /^.*/,
          to: data => {
            return `/index.html`
          }
        }
      ]
    },
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  devtool: 'source-map',
  entry: {
    index: [
      'babel-polyfill',
      join(srcDir, 'index.jsx'),
      join(srcDir, 'public', 'index.html'),
      join(srcDir, 'styles', 'main.scss')
    ]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: [
          join(srcDir, 'styles', 'main.scss'),
          join(srcDir, 'styles', 'uikit.scss')
        ],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]-[hash:base64:8]',
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        include: [
          join(srcDir, 'styles', 'main.scss'),
          join(srcDir, 'styles', 'uikit.scss')
        ],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[hash].[ext]',
            limit: 5000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.(ttf|eot|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[hash].[ext]'
          }
        }
      },
      {
        test: /\.(html|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/'
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: exclude,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: ['stage-1', 'es2015', 'decorators-legacy'],
            plugins: [
              ['import', { 'libraryName': 'antd', 'libraryDirectory': 'es', 'style': 'css' }],
              [ 'transform-react-jsx' ],
              'transform-class-properties'
            ]
          }
        }
      }
    ]
  },
  output: {
    path: dist,
    filename: `index.js`,
    publicPath: '/flatfile-dashboard/'
  },
  resolve: {
    alias: {
      // Packages
      'reactsymbols-kit': join(__dirname, 'resources', 'reactsymbols-kit'),

      // Local source
      elements: join(srcDir, 'elements'),
      language: languageModule,
      api: join(srcDir, 'api'),
      logic: join(srcDir, 'logic'),
      scenes: join(srcDir, 'scenes'),
      styles: join(srcDir, 'styles'),
      store: join(srcDir, 'store')
    },
    extensions: ['.js', '.jsx']
  },
  plugins: [ configPlugin ].concat(
    process.env.ENV === 'prod' ? [
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false
        }
      })
    ] : []
  )
}
