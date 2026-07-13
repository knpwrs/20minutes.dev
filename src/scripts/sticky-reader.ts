// Pin the lesson reader's BOTTOM to the viewport bottom once you've scrolled to it,
// so the (usually taller) syllabus keeps scrolling beside a stuck reader.
//
// The reader is normally taller than the viewport, and it's top-aligned in a grid row
// whose height is driven by the syllabus. A plain `position: sticky; bottom: 0` can't
// pin it — bottom-sticky needs containing-block room ABOVE the element to hold against,
// and a top-aligned element has none. Top-sticky, however, has the room BELOW it that
// the tall syllabus provides. So we bottom-pin by using a NEGATIVE `top` offset equal to
// (viewportHeight - readerHeight). CSS can't express "own height", so we compute it here
// and keep it in sync with viewport and content-size changes.

const GAP = 24; // breathing room between the reader's bottom and the viewport bottom
const WIDE = window.matchMedia('(min-width: 920px)'); // matches the split layout breakpoint

function tune() {
	const reader = document.getElementById('reader');
	if (!reader) return;

	// Below the split breakpoint the columns stack; leave sticky positioning off.
	if (!WIDE.matches) {
		reader.style.top = '';
		return;
	}

	reader.style.top = `${window.innerHeight - reader.offsetHeight - GAP}px`;
}

tune();
window.addEventListener('resize', tune);
WIDE.addEventListener('change', tune);

// The reader's height changes as fonts load, images decode, or interactive blocks toggle.
const reader = document.getElementById('reader');
if (reader && 'ResizeObserver' in window) {
	// Changing `top` doesn't affect offsetHeight, so observing the reader can't loop.
	new ResizeObserver(tune).observe(reader);
}
