/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config({ path: `${process.env.NODE_ENV}.env` });
const nextConfig = {
  env: {
    MONGODB_URL: process.env.MONGODB_URL,
  },
};

module.exports = nextConfig;
