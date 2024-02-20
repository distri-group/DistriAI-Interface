const path = require("path");

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
        },
      },
    },
  },
};
