import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: string }) {
  const posts = await getCollection("posts");

  return rss({
    title: "a",
    description: "a",
    site: context.site,

    // @ts-ignore
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      link: `/posts/${post.id}`,
      description: post.data.description,
      category: post.data.category,
      author: post.data.author,
      categories: post.data.tags ? [post.data.category, ...post.data.tags] : [post.data.category],
    })),
  });
}
