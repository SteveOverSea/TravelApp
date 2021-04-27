const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: "./src/client/index.js",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            },
            {
                test: /\.png$/,
                //https://knowledge.udacity.com/questions/539026#539551
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets/icons"
                        } 
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/views/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "main.css"
        })
    ],
    output: {
        filename: "main.js",
        path: Path.resolve(__dirname, "dist")
    }
}