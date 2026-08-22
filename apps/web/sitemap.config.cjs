module.exports = {
  siteUrl: "https://connectedpsychiatriccare.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.8,
  exclude: [
    "/auth/*",
    "/patient",
    "/patient/*",
    "/cart",
    "/checkout",
    "/checkout/*",
    "/icon.png",
    "/manifest.webmanifest",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/", "/patient/", "/cart", "/checkout"],
      },
    ],
    additionalSitemaps: ["https://connectedpsychiatriccare.com/sitemap.xml"],
  },
};
