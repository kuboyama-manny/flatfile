const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
const webpack = require('webpack')

const srcDir = join(__dirname, 'resources', 'importer', 'src')
const themesDir = join(srcDir, 'themes')

const getDirectories = dir => readdirSync(dir)
  .filter(name => lstatSync(join(dir, name)).isDirectory())

const dist = join(__dirname, 'public', 'flatfile-bundle')
const exclude = /(node_modules)/

const languageModule = join(srcDir, 'language', process.env.LANGUAGE || 'en')
console.log('Language data will be loaded from', languageModule)

module.exports = getDirectories(themesDir).map(themeName => ({
  devServer: {
    contentBase: join(srcDir, 'documentation'),
    port: process.env.PORT || 2000,
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/theme:([^/]+)\//,
          to: data => {
            return `/${data.match[1]}/dev.html`
          }
        }
      ]
    },
    compress: false,
    inline: true,
    hot: true
  },
  devtool: 'source-map',
  entry: {
    index: ['babel-polyfill', join(srcDir, 'themes', themeName)]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
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
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'public/fonts/[name].[ext]',
          outputPath: `${themeName}/`
        }
      },
      {
        test: /\.(html|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: `${themeName}/`
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
            presets: ['stage-1', 'es2015'],
            plugins: [
              [ 'transform-react-jsx', { pragma: 'h' } ]
            ]
          }
        }
      }
    ]
  },
  output: {
    path: dist,
    filename: `${themeName}/[name].js`,
    publicPath: process.env.WATCHING ? '/' : '/flatfile-bundle/'
  },
  resolve: {
    alias: {
      // Node modules
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      'handsontable': 'handsontable-pro',

      // Packages
      'reactsymbols-kit': join(__dirname, 'resources', 'reactsymbols-kit'),

      // Local source (this env value must be set to PROD on heroku)
      config: join(srcDir, 'config', process.env.ENV || 'dev'),
      elements: join(srcDir, 'elements'),
      language: languageModule,
      logic: join(srcDir, 'logic'),
      scenes: join(srcDir, 'scenes'),
      styles: join(srcDir, 'styles'),
      theme: join(themesDir, themeName)
    },
    extensions: ['.js', '.jsx']
  },
  plugins: [].concat(
    process.env.ENV === 'prod' ? [new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      output: {
        comments: false
      }
    })] : []
  )
}))
