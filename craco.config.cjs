const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: {
      resolve: {
        fallback: {
          path: false,
          util: false,
          url: false,
          http: false,
          https: false,
          stream: false,
          assert: false,
          querystring: false,
          zlib: false,
          crypto: false,
          net: false,
          tls: false,
          dns: false,
          fs: false,
          events: false,
          process: false,
        },
      },
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        const mod = resource.request.replace(/^node:/, "");
        switch (mod) {
          case "buffer":
            resource.request = "buffer";
            break;
          case "stream":
            resource.request = "readable-stream";
            break;
          default:
            throw new Error(`Not found ${mod}`);
        }
      }),
    ],
  },
  devServer: {
    proxy: {
      "/index-api": {
        target: "https://test.distri.ai",
        changeOrigin: true,
      },
    },
  },
};
