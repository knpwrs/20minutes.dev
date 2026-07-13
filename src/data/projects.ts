// Project metadata is authored as markdown in the `projects` content collection
// (src/content/projects/<slug>.md, schema in src/content.config.ts) - one file
// per project. This module derives the typed project list from that collection so
// pages never hard-code a project array. Lessons live in the `lessons` collection
// under NN-chapter folders; the syllabus rows are built from those files.

import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

/** A project plus its slug (the collection file's id). Shape mirrors the
 *  `projects` schema, so adding a field there flows through automatically. */
export type Project = CollectionEntry<'projects'>['data'] & { slug: string };

/** Convenience aliases for the nested shapes, derived from the schema. */
export type ProjectPart = Project['parts'][number];
export type ProjectCaveats = NonNullable<Project['caveats']>;
export type ProjectResource = NonNullable<Project['resources']>[number];

function toProject(entry: CollectionEntry<'projects'>): Project {
	return { ...entry.data, slug: entry.id };
}

/** All projects, in display order (`order` frontmatter, ascending). */
export async function getAllProjects(): Promise<Project[]> {
	const entries = await getCollection('projects');
	return entries.map(toProject).sort((a, b) => a.order - b.order);
}

/** One project by slug, falling back to the first project if it's unknown. */
export async function getProject(slug: string): Promise<Project> {
	const entry = await getEntry('projects', slug);
	return entry ? toProject(entry) : (await getAllProjects())[0];
}

/** Derive a lesson's chapter name from its folder. Lesson ids look like
 *  `<slug>/<NN-chapter-slug>/lesson-XX`; the leading NN maps to the project's
 *  ordered `parts`. Chapter membership is structural (the folder), not a
 *  frontmatter string that could silently drift out of sync. */
export function chapterOf(lessonId: string, parts: ProjectPart[]): string {
	const folder = lessonId.split('/').at(-2) ?? '';
	const order = parseInt(folder, 10); // leading NN of "NN-chapter-slug"
	return parts[order - 1]?.name ?? '';
}
