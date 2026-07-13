import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each lesson is one step of a project, authored as a markdown file under
// src/content/lessons/<project-slug>/<NN-chapter-slug>/lesson-XX.md — the folder
// gives the chapter (and its order), the filename the global lesson number.
// Structured pedagogical fields live in frontmatter; the body is the "Background".
const lessons = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
	schema: z.object({
		/** Project slug this lesson belongs to (matches the project collection id). */
		project: z.string(),
		/** 1-indexed lesson number within the project (matches the lesson-NN filename).
		 *  The chapter is derived from the NN-chapter folder the file lives in. */
		lesson: z.number().int().positive(),
		title: z.string(),
		/** What you're building today and why it matters - 1–2 sentences, shown at
		 *  the top of the day above everything else. */
		overview: z.string().optional(),
		/** The one-sentence brief of today's target, shown above the spec. */
		goal: z.string(),
		/** The concrete spec for the day: a small, checkable target with known-good
		 *  values that the day's code should satisfy. */
		spec: z.object({
			scenario: z.string(),
			status: z.enum(['failing', 'passing']).default('failing'),
			lines: z
				.array(z.object({ kw: z.string(), text: z.string() }))
				.min(1),
		}),
		/** A short reference snippet nudging toward the solution. */
		code: z.object({
			lang: z.string().default('text'),
			source: z.string(),
		}),
		/** Optional further-reading pointer. */
		reading: z.string().optional(),
		/** The checkpoint that marks the day done. */
		checkpoint: z.string(),
	}),
});

// Project metadata, mirroring the Project shape in src/data/projects.ts, authored
// as one markdown file per project under src/content/projects/<slug>.md. The
// slug (glob id) matches PROJECTS[].slug. The markdown body is currently unused.
const projects = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		/** 0-based index in the PROJECTS array; determines display order. */
		order: z.number().int(),
		lessons: z.number().int().positive(),
		size: z.enum(['Small', 'Medium', 'Large']),
		tech: z.array(z.string()),
		estMin: z.number().default(20),
		/** One-line card blurb on the projects index. Keep it to ~60-120 chars
		 * (one clause or two) so it fits a card; the fuller pitch goes in `blurb`.
		 * Capped so a multi-sentence desc fails the build instead of overflowing. */
		desc: z.string().max(180),
		/** Fuller one-or-two-sentence pitch: the project overview page header and
		 * the page meta description. Longer than `desc` but still tight. */
		blurb: z.string(),
		/**
		 * Orientation shown at the top of the project overview page: what the learner
		 * builds over the whole run and the end result. 2–4 sentences; blank lines
		 * separate paragraphs.
		 */
		overview: z.string().optional(),
		parts: z.array(
			z.object({
				name: z.string(),
				count: z.number().int().nonnegative(),
			}),
		),
		/**
		 * Honest scope of the reference implementation the project builds. Mirrors the
		 * CAVEATS.md produced by the verification's finalize pass: what works end to end,
		 * and what a learner would extend next. Surfaced on the project overview page.
		 */
		caveats: z
			.object({
				/** One-line honest summary of how complete the finished program is. */
				note: z.string().optional(),
				/** Prioritized "where to go next" / not-yet-covered extensions. */
				future: z.array(z.string()),
			})
			.optional(),
		/** Curated further-reading list: classic books and key references for the subject. */
		resources: z
			.array(
				z.object({
					title: z.string(),
					author: z.string().optional(),
					url: z.string().optional(),
					note: z.string().optional(),
				}),
			)
			.optional(),
	}),
});

export const collections = { lessons, projects };
