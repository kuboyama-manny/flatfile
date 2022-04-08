let mix = require('laravel-mix')
let path = require('path')
let fs = require('fs')
let exec = require('child_process').exec

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.sass('resources/assets/sass/app.scss', 'public/css')
  .sass('resources/assets/sass/new-retail.scss', 'public/css')
  .sass('resources/assets/sass/demo-v2.scss', 'public/css')
  .sass('resources/assets/sass/pre-signin.scss', 'public/css')
  .copy('node_modules/sweetalert/dist/sweetalert.min.js', 'public/js/sweetalert.min.js')
  .sass('resources/assets/sass/app-rtl.scss', 'public/css')
  .then(() => {
    exec('node_modules/rtlcss/bin/rtlcss.js public/css/app-rtl.css ./public/css/app-rtl.css')
  })
  .js('resources/assets/js/app.js', 'public/js')
  .js('resources/assets/js/demo.js', 'public/js')
  .js('resources/assets/js/retail.js', 'public/js')
  .js('resources/assets/js/new-retail.js', 'public/js')
  .webpackConfig({
    resolve: {
      modules: [
        path.resolve(__dirname, 'vendor/laravel/spark-aurelius/resources/assets/js'),
        'node_modules'
      ],
      alias: {
        'vue$': 'vue/dist/vue.js'
      }
    }
  })

if (fs.existsSync(`${__dirname}/public/flatfile-bundle/simple/index.js`)) {
  mix.version(['public/flatfile-bundle/simple/index.js'])
}
