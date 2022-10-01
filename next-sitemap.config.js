/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL,
  generateRobotsTxt: true,
  exclude: ["/stories/*/*", "/server-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [`${process.env.SITE_URL}/server-sitemap.xml`],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
