var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [{
    resolve: {
        alias: {
            'velocity': path.join(__dirname, '/bower_components/velocity/velocity.min'),
			'jquery.validation': path.join(__dirname, '/bower_components/jquery-validation/dist/jquery.validate.min'),
			'bootstrap': path.join(__dirname, '/node_modules/bootstrap/dist/js/bootstrap.min'),
			'notify': path.join(__dirname, '/bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min')
        }
    },
    context: __dirname + '/assets/js',
    entry: {
        mainHome: './main-home',
        mainVideoMedia: './main-video-media',
        mainLook: './main-look',
        mainProfile: './main-profile',
        commons: './common'
    },
    output: {
        path: path.join(__dirname, '/public/js'),
        filename: '[name].js',
        publicPath: '/js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'common.js'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            "window.Tether": 'tether'
        })
    ],
    module: {
        loaders: [
            {
                test: /tether\.js$/,
                loader: 'expose',
                query: 'Tether'
            }
        ]
    }
},
{
    resolve: {
        alias: {
            'styles': path.join(__dirname, '/assets/sass/styles.scss')
        }
    },
    context: __dirname + '/assets/js',
    entry: {
        mainCss: './main-styles'        
    },
    output: {
        path: path.join(__dirname, '/public/css'),
        filename: '[name].css',
        publicPath: '/css'
    },   
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                "style",
                "css!sass")
            }            
        ]        
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
}];