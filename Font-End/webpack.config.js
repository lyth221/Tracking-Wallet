const path = require('path');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const minifyOptions = {
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true
};

let cleanFilesluginOptions = null,
    CleanFileslugin = function (options) {
        cleanFilesluginOptions = [];
        options.forEach(option => {
            if (option.path) {
                option = Object.assign({
                    fileExtension: '.js',
                    recursive: false
                }, option);
                option.path = __dirname + option.path;
                cleanFilesluginOptions.push(option);
                console.log('\x1b[46m%s\x1b[0m', 'Clean file ' + option.path + '!');
            }
        });
    };
CleanFileslugin.prototype.apply = compiler => {
    const fs = require('fs'),
        removeFiles = (option) => {
            fs.readdirSync(option.path).forEach(filePath => {
                filePath = option.path + '/' + filePath;
                const state = fs.statSync(filePath);
                if (option.recursive && state.isDirectory()) {
                    removeFiles({
                        path: filePath,
                        fileExtension: option.fileExtension,
                        excludeExtension: option.excludeExtension,
                        recursive: option.recursive
                    });
                } else if (state.isFile() && filePath.endsWith(option.fileExtension) && (option.excludeExtension == null || !filePath.endsWith(option.excludeExtension))) {
                    console.log('Delete file \x1b[36m%s\x1b[0m!', filePath);
                    fs.unlinkSync(filePath);
                }
            });
        };

    compiler.plugin('done', () =>
        cleanFilesluginOptions.forEach(option => {
            removeFiles(option)
        })
    );
};

const htmlPluginOptions = {
    inject: false,
    hash: true,
    minifyOptions,
    title: config.app.title,
    keywords: config.keywords,
    description: config.app.description
};

module.exports = (env, argv) => ({
    entry: [ 'babel-polyfill', path.join(__dirname, 'src/view/index.jsx') ],
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'js/[name]-[chunkhash].js',
        chunkFilename: 'js/[name]-[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                query: {
                    plugins: ['syntax-dynamic-import'],
                    presets: ['es2015','stage-2','env', 'react']
                },
                loader: 'babel-loader'
            }
        }, {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.pug$/,
            use: 'pug-loader'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin(Object.assign({}, htmlPluginOptions, {
            template: './src/view/theme/index.pug',
            filename: 'index.template'
        })),
        new HtmlWebpackPlugin(Object.assign({}, htmlPluginOptions, {
            template: './src/view/theme/admin.pug',
            filename: 'admin.template'
        })),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new CleanFileslugin(argv.mode === 'production' ? [] : [{
                path: '/public/js',
                fileExtension: '.js',
                excludeExtension: '.min.js',
                recursive: false
            },
            {
                path: '/public',
                fileExtension: '.template',
                recursive: true
            }
        ])
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: config.webpack.port,
        historyApiFallback: true
    }
});