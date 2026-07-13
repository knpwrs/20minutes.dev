// Client-side hydration for project progress. Runs on every page (via the root
// Layout) and no-ops where the relevant markup is absent. It reads the completed
// lessons from localStorage and rewrites the progress card, syllabus rows/chapters,
// and the lesson page's "mark complete" toggle to match - mirroring the same
// state/color logic the server uses for its pre-hydration default.

import {
	COLORS,
	getCompleted,
	resetProgress,
	resumeDay,
	toggleComplete,
} from '../lib/progress';

const pad = (n: number) => String(n).padStart(2, '0');

const CHECK_SVG = `<svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="${COLORS.done}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const DOT_CURRENT = '<span class="block h-2 w-2 rounded-full bg-accent"></span>';
const DOT_TODO = '<span class="block h-[5px] w-[5px] rounded-full bg-[#3a3d44]"></span>';

/** The project slug shown on this page, from whichever region is present. */
function pageSlug(): string | null {
	const el = document.querySelector<HTMLElement>('[data-syllabus],[data-progress],[data-mark-complete]');
	return el?.getAttribute('data-slug') ?? null;
}

/** Authored lesson numbers on the page, read from the syllabus rows (ascending). */
function authoredLessons(): number[] {
	return [...document.querySelectorAll<HTMLElement>('[data-syllabus] [data-row]')]
		.map((r) => Number(r.dataset.lesson))
		.filter((n) => Number.isFinite(n))
		.sort((a, b) => a - b);
}

function hydrateSyllabus(completed: Set<number>, current: number | null): void {
	const root = document.querySelector<HTMLElement>('[data-syllabus]');
	if (!root) return;

	root.querySelectorAll<HTMLElement>('[data-row]').forEach((row) => {
		const lesson = Number(row.dataset.lesson);
		const isActive = row.dataset.active !== undefined;
		const state = completed.has(lesson) ? 'done' : lesson === current ? 'current' : 'todo';

		const marker = row.querySelector<HTMLElement>('[data-marker]');
		if (marker) marker.innerHTML = state === 'done' ? CHECK_SVG : state === 'current' ? DOT_CURRENT : DOT_TODO;

		const link = row.querySelector<HTMLElement>('[data-row-link]');
		if (link) {
			const highlight = isActive || state === 'current';
			link.style.color = highlight
				? COLORS.rowActive
				: state === 'done'
					? COLORS.rowDone
					: COLORS.rowTodo;
			link.style.fontWeight = highlight ? '600' : '400';
		}
	});

	root.querySelectorAll<HTMLElement>('[data-chapter]').forEach((chapter) => {
		const from = Number(chapter.dataset.from);
		const to = Number(chapter.dataset.to);
		const lessonNums = (chapter.dataset.lessons ?? '')
			.split(',')
			.map(Number)
			.filter((n) => Number.isFinite(n));

		const done = lessonNums.length > 0 && lessonNums.every((n) => completed.has(n));
		const inProgress = !done && current !== null && current >= from && current <= to;

		const num = chapter.querySelector<HTMLElement>('[data-chap-num]');
		if (num) num.style.color = inProgress ? COLORS.accent : done ? COLORS.done : COLORS.chapNumIdle;

		const name = chapter.querySelector<HTMLElement>('[data-chap-name]');
		if (name) name.style.color = done || inProgress ? COLORS.chapNameActive : COLORS.chapNameIdle;

		const tag = chapter.querySelector<HTMLElement>('[data-chap-tag]');
		if (tag) {
			const label = done ? 'DONE' : inProgress ? 'IN PROGRESS' : '';
			tag.textContent = label;
			tag.style.color = done ? COLORS.done : COLORS.accent;
			tag.style.display = label ? '' : 'none';
		}
	});
}

function hydrateProgressCard(completed: Set<number>): void {
	const card = document.querySelector<HTMLElement>('[data-progress]');
	if (!card) return;

	const lessons = Number(card.dataset.lessons) || 0;
	const count = completed.size;

	const countEl = card.querySelector<HTMLElement>('[data-progress-count]');
	if (countEl && lessons) countEl.textContent = `${count} / ${lessons} done`;

	const bar = card.querySelector<HTMLElement>('[data-progress-bar]');
	if (bar && lessons) bar.style.width = `${Math.round((count / lessons) * 100)}%`;
}

/** Point every "resume" link (progress card + nav CTA) at the resume lesson, with a
 *  label that reflects state: Start (untouched) → Continue → Review (all done). */
function hydrateContinueLinks(slug: string, completed: Set<number>, current: number | null, lessons: number[]): void {
	if (current === null || !lessons.length) return;
	const href = `/projects/${slug}/lesson-${pad(current)}`;
	const label =
		completed.size === 0
			? 'Start'
			: lessons.every((n) => completed.has(n))
				? `Review - Lesson ${pad(current)}`
				: `Continue - Lesson ${pad(current)}`;
	document.querySelectorAll<HTMLAnchorElement>('[data-continue]').forEach((a) => {
		a.href = href;
		a.textContent = label;
	});
}

function hydrateMarkButton(completed: Set<number>): void {
	const btn = document.querySelector<HTMLButtonElement>('[data-mark-complete]');
	if (!btn) return;

	const lesson = Number(btn.dataset.lesson);
	const done = completed.has(lesson);
	const label = btn.querySelector<HTMLElement>('[data-mark-label]');
	const icon = btn.querySelector<SVGElement>('[data-mark-icon]');

	btn.setAttribute('aria-pressed', String(done));
	if (done) btn.dataset.complete = '';
	else delete btn.dataset.complete;
	if (label) label.textContent = done ? `Lesson ${pad(lesson)} complete` : `Mark lesson ${pad(lesson)} complete`;
	if (icon) icon.classList.toggle('hidden', !done);
}

/** Re-read storage and refresh every progress-aware region on the page. */
function hydrate(): void {
	const slug = pageSlug();
	if (!slug) return;

	const completed = getCompleted(slug);
	const lessons = authoredLessons();
	const current = lessons.length ? resumeDay(completed, lessons, lessons[0]) : null;

	hydrateSyllabus(completed, current);
	hydrateProgressCard(completed);
	hydrateContinueLinks(slug, completed, current, lessons);
	hydrateMarkButton(completed);
}

function wire(): void {
	const btn = document.querySelector<HTMLButtonElement>('[data-mark-complete]');
	if (btn) {
		btn.addEventListener('click', () => {
			const slug = btn.dataset.slug ?? '';
			const lesson = Number(btn.dataset.lesson);
			if (!slug || !Number.isFinite(lesson)) return;
			toggleComplete(slug, lesson);
			hydrate();
		});
	}

	const reset = document.querySelector<HTMLAnchorElement>('[data-reset]');
	if (reset) {
		reset.addEventListener('click', (e) => {
			const slug = pageSlug();
			if (!slug) return;
			if (getCompleted(slug).size === 0) return; // nothing tracked - just navigate
			if (!confirm('Start over? This clears your saved progress for this project.')) {
				e.preventDefault();
				return;
			}
			resetProgress(slug);
			// Navigation to lesson 1 proceeds and the fresh page hydrates from empty storage.
		});
	}
}

wire();
hydrate();
