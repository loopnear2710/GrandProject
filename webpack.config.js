import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
export default {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 }
                    },
                    'postcss-loader'
                ]

            },
        ],

    },

    mode: 'development',
    entry: './script.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js',
    },

  
    devServer: {
        static: path.resolve('dist'),
        port: 5000,
        open: true,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', 
            filename: 'index.html', 
            favicon: 'img/logo.png'
        }),
    ],


};