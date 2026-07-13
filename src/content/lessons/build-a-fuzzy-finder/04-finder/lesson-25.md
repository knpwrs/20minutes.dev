---
project: build-a-fuzzy-finder
lesson: 25
title: Moving the cursor
overview: A finder lets you move a highlight up and down the result list. Today you add that movement, clamped so it never runs off either end.
goal: Move the selection down and up through the results, clamped to the first and last positions.
spec:
  scenario: Clamped selection movement
  status: failing
  lines:
    - kw: Given
      text: 'a Finder with three results and the selection at index 0'
    - kw: When
      text: 'down is pressed three times, then up is pressed three times'
    - kw: Then
      text: 'the selection goes 0, 1, 2, 2 (it stops at the last result, index 2, and does not wrap), then 2, 1, 0, 0 (it stops at the first result and does not go negative)'
code:
  lang: go
  source: |
    func (f *Finder) Down() {
      if f.Selection < len(f.Results)-1 { f.Selection++ }
    }
    func (f *Finder) Up() {
      if f.Selection > 0 { f.Selection-- }
    }
checkpoint: The selection moves through the results and stops cleanly at both ends. Commit and stop here.
---

The finder's cursor is a single index into the results, and moving it is just incrementing or decrementing that index. The only real decision is what happens at the **ends**. **Clamping** - stopping at the first and last result - is the behavior most finders use and the easiest to reason about: pressing down at the bottom leaves you at the bottom, pressing up at the top leaves you at the top.

The edges are the whole lesson, so pin them: down at the last result must **not** wrap to the top, and up at the first must **not** go negative and crash the next render. An empty result list is the degenerate case - with zero results the selection simply stays at 0 and both moves are no-ops. Getting this boundary logic right now means the keystroke handling later can dispatch an arrow key straight to these methods without re-checking anything.
