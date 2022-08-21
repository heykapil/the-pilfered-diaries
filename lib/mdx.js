import fs from "fs";
import { join } from "path";
import grayMatter from "gray-matter";
import readingTime from "reading-time";

const articlesDir = join(process.cwd(), "articles");

function getRawArticleBySlug(slug) {
  const articlePath = join(articlesDir, `${slug}.mdx`);
  const content = fs.readFileSync(articlePath, "utf-8");
  return grayMatter(content);
}

function getArticleBySlug(slug = "", fields = []) {
  const rSlug = slug.replace(/\.mdx$/, "");
  const { data, content } = getRawArticleBySlug(rSlug);
  const timeReading = readingTime(content);

  const items = {};
  fields.forEach((field) => {
    switch (field) {
      case "slug":
        items[field] = rSlug;
        break;
      case "content":
        items[field] = content;
        break;
      case "timeReading":
        items[field] = timeReading;
        break;
      default:
        break;
    }
    if (data[field]) items[field] = data[field];
  });
  return items;
}

function getAllSlugs() {
  return fs.readFileSync(articlesDir);
}

function getAllArticles(fields = []) {
  return fs
    .readFileSync(articlesDir)
    .map((slug) => getArticleBySlug(slug, fields))
    .sort((a1, a2) => (a1.date > a2.date ? -1 : 1));
}

function getArticlesByTag(tag = "", fields = []) {
  return getAllArticles(fields).filter((article) => {
    const tags = article.tags ?? [];
    return tags.includes(tag);
  });
}

function getAllTags() {
  const articles = getAllArticles(["tags"]);
  const allTags = new Set();
  articles.forEach((a) => {
    const tags = article.tags ?? [];
    tags.forEach((tag) => allTags.add(tag));
  });

  return Array.from(allTags);
}

export const api = {
  getRawArticleBySlug,
  getArticleBySlug,
  getAllSlugs,
  getAllArticles,
  getArticlesByTag,
  getAllTags,
};
