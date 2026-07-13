// Client-side progress tracking for projects, persisted in localStorage.
//
// The site is fully static, so "your progress" can't live on a server. Instead
// we record the set of completed day numbers per project in localStorage and
// hydrate the progress card, syllabus, and day pages from it on the client (see
// src/scripts/progress.ts). This module holds the storage helpers plus the
// visual constants shared between the server render (the pre-hydration default)
// and the client hydration, so the two never drift.

/** Colors used by the syllabus + progress UI, shared by server and client. */
export const COLORS = {
	accent: '#6e9bde',
	done: '#6fb894',
	chapNumIdle: '#565961',
	chapNameIdle: '#aeb2ba',
	chapNameActive: '#edeef1',
	rowActive: '#edeef1',
	rowDone: '#9ca0a8',
	rowTodo: '#8a8e96',
} as const;

export type RowState = 'done' | 'current' | 'todo';

const STORAGE_PREFIX = '20m:progress:';
const key = (slug: string) => `${STORAGE_PREFIX}${slug}`;

/** Read the set of completed day numbers for a project. Empty when unset or in
 *  a non-browser context. Never throws. */
export function getCompleted(slug: string): Set<number> {
	if (typeof localStorage === 'undefined') return new Set();
	try {
		const raw = localStorage.getItem(key(slug));
		if (!raw) return new Set();
		const data = JSON.parse(raw) as { completed?: unknown };
		const days = Array.isArray(data?.completed) ? data.completed : [];
		return new Set(days.filter((d): d is number => Number.isInteger(d)));
	} catch {
		return new Set();
	}
}

/** Persist the completed-day set for a project. */
export function setCompleted(slug: string, days: Set<number>): void {
	if (typeof localStorage === 'undefined') return;
	try {
		const completed = [...days].sort((a, b) => a - b);
		localStorage.setItem(key(slug), JSON.stringify({ completed }));
	} catch {
		// Storage full or unavailable (e.g. private mode) - progress is best-effort.
	}
}

export function isComplete(slug: string, day: number): boolean {
	return getCompleted(slug).has(day);
}

/** Toggle a day's completion and return its new state. */
export function toggleComplete(slug: string, day: number): boolean {
	const days = getCompleted(slug);
	const nowComplete = !days.has(day);
	if (nowComplete) days.add(day);
	else days.delete(day);
	setCompleted(slug, days);
	return nowComplete;
}

/** Forget all tracked progress for a project. */
export function resetProgress(slug: string): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.removeItem(key(slug));
	} catch {
		// no-op
	}
}

/** The day to resume on: the lowest authored day not yet completed, falling back
 *  to the last authored day (everything done) or the given default. */
export function resumeDay(
	completed: Set<number>,
	authoredDays: number[],
	fallback: number,
): number {
	const next = authoredDays.find((d) => !completed.has(d));
	if (next !== undefined) return next;
	return authoredDays[authoredDays.length - 1] ?? fallback;
}
