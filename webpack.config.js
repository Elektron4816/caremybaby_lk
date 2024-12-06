const path = require("path"); // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { scheduler } = require("timers/promises");

module.exports = {
  entry: {
    mainPage: "./src/mainPage/mainPage.js",
    another: "./src/another/another.js",
    auth: "./src/auth/auth.js",
    pay: "./src/pay/pay.js",
    schedule: "./src/schedule/schedule.js",
    items: "./src/items/items.js",
    profile: "./src/profile/profile.js",
    paymentError: "./src/pay/paymentError/paymentError.js",
    paymentSuccess: "./src/pay/paymentSuccess/paymentSuccess.js",
    accessError: "./src/accessError/accessError.js",
    registration: "./src/registration/registration.js",
    teacher: "./src/teacher/teacher.js",
    children: "./src/children/children.js",
    metrika: "./src/metrika/yandex_069a8d6659ffeea4.js",
    yc_frame: "./src/yc_frame/yc_frame.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name]/[name]_[contenthash].bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|mov)$/i,
        type: "asset/resource",
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: "[name]/[name].[contenthash].css",
    }),

    // new MiniCssExtractPlugin({
    //   filename: "index.css",
    // }),

    new HtmlWebpackPlugin({
      filename: "mainPage/mainPage.html",
      template: "./src/mainPage/mainPage.html",
      chunks: ["mainPage"],
    }),
    new HtmlWebpackPlugin({
      filename: "another/another.html",
      template: "./src/another/another.html",
      chunks: ["another"],
    }),
    new HtmlWebpackPlugin({
      filename: "auth/auth.html",
      template: "./src/auth/auth.html",
      chunks: ["auth"],
    }),
    new HtmlWebpackPlugin({
      filename: "pay/pay.html",
      template: "./src/pay/pay.html",
      chunks: ["pay"],
    }),
    new HtmlWebpackPlugin({
      filename: "schedule/schedule.html",
      template: "./src/schedule/schedule.html",
      chunks: ["schedule"],
    }),
    new HtmlWebpackPlugin({
      filename: "items/items.html",
      template: "./src/items/items.html",
      chunks: ["items"],
    }),
    new HtmlWebpackPlugin({
      filename: "profile/profile.html",
      template: "./src/profile/profile.html",
      chunks: ["profile"],
    }),
    new HtmlWebpackPlugin({
      filename: "paymentError/paymentError.html",
      template: "./src/pay/paymentError/paymentError.html",
      chunks: ["paymentError"],
    }),
    new HtmlWebpackPlugin({
      filename: "paymentSuccess/paymentSuccess.html",
      template: "./src/pay/paymentSuccess/paymentSuccess.html",
      chunks: ["paymentSuccess"],
    }),
    new HtmlWebpackPlugin({
      filename: "accessError/accessError.html",
      template: "./src/accessError/accessError.html",
      chunks: ["accessError"],
    }),
    new HtmlWebpackPlugin({
      filename: "registration/registration.html",
      template: "./src/registration/registration.html",
      chunks: ["registration"],
    }),
    new HtmlWebpackPlugin({
      filename: "metrika/yandex_069a8d6659ffeea4.html",
      template: "./src/metrika/yandex_069a8d6659ffeea4.html",
      chunks: ["metrika"],
    }),
    new HtmlWebpackPlugin({
      filename: "teacher/teacher.html",
      template: "./src/teacher/teacher.html",
      chunks: ["teacher"],
    }),
    new HtmlWebpackPlugin({
      filename: "children/children.html",
      template: "./src/children/children.html",
      chunks: ["children"],
    }),
    new HtmlWebpackPlugin({
      filename: "yc_frame/yc_frame.html",
      template: "./src/yc_frame/yc_frame.html",
      chunks: ["yc_frame"],
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Каталог для статики
    },
    open: true, // Автоматически открывать браузер
  },

  mode: "development", // Режим сборки
};
