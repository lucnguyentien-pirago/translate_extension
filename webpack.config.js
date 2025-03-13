const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        background: './src/background.js',
        content: './src/content.js',
        popup: './src/popup.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    plugins: [
        // Copy manifest.json và các tài nguyên tĩnh khác
        new CopyPlugin({
            patterns: [
                {
                    from: "src/manifest.json",
                    to: "manifest.json",
                    transform(content) {
                        // Cập nhật manifest.json nếu cần
                        const manifest = JSON.parse(content.toString());
                        return JSON.stringify(manifest, null, 2);
                    },
                },
                { from: "src/icons", to: "icons" },
                { from: "src/styles.css", to: "styles.css" },
            ],
        }),
        // Xử lý file HTML
        new HtmlWebpackPlugin({
            template: './src/popup.html',
            filename: 'popup.html',
            chunks: ['popup']
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
