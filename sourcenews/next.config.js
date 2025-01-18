"use strict";

/* Package System */
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const path = require("path");

/* Package Application */
require("dotenv").config({
  path: path.join(
    __dirname,
    ".env" +
      (process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging"
        ? "." + process.env.NODE_ENV
        : ".development")
  ),
});

const environment = {
  BASE_URL: process.env.BASE_URL,
  API_URL: process.env.API_URL+process.env.PREFIX_API,
  TOKEN: process.env.TOKEN,
  GG_CLIENT_ID: process.env.GG_CLIENT_ID,
  FB_APP_ID: process.env.FB_APP_ID,
  GG_GTAG_ID: process.env.GG_GTAG_ID,
  GG_ADS_ID: process.env.GG_ADS_ID,
  CDN_URL: process.env.CDN_URL,
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  API_USER_URL: process.env.API_USER_URL+process.env.PREFIX_API_USER,
  X_APP_ID: process.env.X_APP_ID,
  CDN_URL_S3: process.env.CDN_URL_S3,
  MCV_IMAGE_URL: process.env.MCV_IMAGE_URL,
  RECAPTCHA_SITE_KEY : process.env.RECAPTCHA_SITE_KEY,
};

module.exports = {
  distDir: "_next",
  poweredByHeader: false,
  env: { ...environment },
  images: {
		domains: ['cdn.datafirst.solutions','flagcdn.com','cdn.mcvnetworks.us'],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
  eslint: { ignoreDuringBuilds: true },
  sassOptions: {
    includePaths: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "public/scss"),
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias["@libNode"] = path.join(__dirname, "node_modules");
    config.resolve.alias["@public"] = path.join(__dirname, "public");
    config.resolve.alias["@config"] = path.join(__dirname, "src/Config");
    config.resolve.alias["@libs"] = path.join(__dirname, "src/Libs");
    config.resolve.alias["@modules"] = path.join(__dirname, "src/Modules");
    config.resolve.alias["@views"] = path.join(__dirname, "src/Views");
    config.resolve.alias["@helpers"] = path.join(__dirname, "src/Helpers");

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/homepage",
      },
    ];
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};
