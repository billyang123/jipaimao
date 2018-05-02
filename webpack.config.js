var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'Public/js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        console.log(matchs);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'Public/js', item);
        }
    });
    console.log(JSON.stringify(files));
    return files;
}
var entries = getEntry();
var chunks = Object.keys(entries);
console.log('chunks',chunks)
module.exports = {
    cache: true,
    devtool: "#source-map",
    entry: entries,
    output: {
        path: path.join(__dirname, "dist/Public/js/"),
        publicPath: "dist/Public/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            jquery: srcDir + "/Public/js/lib/jquery.min.js",
            layer: srcDir + "/Public/js/lib/layer.min.js",
            core: srcDir + "/Public/js/core",
            ui: srcDir + "/Public/js/ui",
            tpl: srcDir + "/Public/js/tpl",
            config: srcDir + "/Public/js/config/index.js"
        }
    },
    module: {
      loaders: [
        { test: /\.hbs/, loader: "handlebars-template-loader"},
        // {
        //   test:/\.handlebars$/,
        //   loader: "handlebars-loader"
        //   // query: {
        //   //   helperDirs: [__dirname + "/src/helper"]
        //   // }
        // },
        { test: /\.jpg/, loader: "file-loader" },
        { test: /\.png/, loader: "url-loader?mimetype=image/png" },
        { test: /\.gif/, loader: "url-loader?mimetype=image/gif" },
        {
          test: /\.css$/,
          loaders: 'style-loader!css-loader'
        },
        {
          test: /\.js/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: chunks,
            minChunks: 4 || chunks.length
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
