module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "generated-wundergraph"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
