import rss from '@astrojs/rss';
import { getPosts } from '../lib/content';
import { site } from '../site.config';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: `${site.title} — Blog`,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
