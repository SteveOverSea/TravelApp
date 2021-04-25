const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/client/index.js",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/views/index.html"
        })
    ],
    output: {
        filename: "main.js",
        path: Path.resolve(__dirname, "dist")
    }
}