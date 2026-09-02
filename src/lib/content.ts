import { getCollection, type CollectionEntry } from 'astro:content';

type Dated = { data: { date: Date; hidden: boolean } };

/** Hidden entries show in `astro dev`, but are dropped from production builds. */
const isPublished = (entry: Dated) =>
  import.meta.env.PROD ? !entry.data.hidden : true;

const byNewest = (a: Dated, b: Dated) =>
  b.data.date.valueOf() - a.data.date.valueOf();

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects');
  return all.filter(isPublished).sort(byNewest);
}

export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  const all = await getCollection('blog');
  return all.filter(isPublished).sort(byNewest);
}
