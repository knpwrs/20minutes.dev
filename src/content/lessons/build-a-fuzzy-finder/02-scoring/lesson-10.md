---
project: build-a-fuzzy-finder
lesson: 10
title: Bonus at word boundaries
overview: A query that lands on the start of a word or path segment feels like a much better hit than one landing mid-word. Today you reward matches that fall on a boundary.
goal: Add a bonus for a matched character that begins a word - the character right after a separator.
spec:
  scenario: Word-boundary bonus
  status: failing
  lines:
    - kw: Given
      text: 'a +8 bonus for any matched character whose preceding candidate character is a separator (one of space, slash, underscore, hyphen, or dot)'
    - kw: When
      text: 'score is called with candidate "a/bc" and positions [2], then with candidate "abc" and positions [2]'
    - kw: Then
      text: 'candidate "a/bc" with positions [2] scores 22 (16, minus 2 for the leading gap, plus 8 because index 2 follows the slash separator), and candidate "abc" with positions [2] scores 14 (16, minus 2 for the leading gap, with no boundary bonus)'
code:
  lang: go
  source: |
    // A boundary is a matched char preceded by a separator. Add the bonus
    // for every matched position that qualifies, regardless of gap.
    const scoreBoundary = 8
    func isBoundary(candidate string, p int) bool {
      if p == 0 { return false }        // start-of-string handled by leading gap
      return isSeparator(candidate[p-1]) // space / _ - .
    }
    // after adding the per-char reward, for every k:
    if isBoundary(candidate, p) { s += scoreBoundary }
checkpoint: Matches at the start of a word or path segment now score higher. Commit and stop here.
---

Where a match sits **within** a word matters as much as how tight it is. Typing `main` and landing on the `m` that begins the `main` segment of `src/main.go` is a far better hit than landing on an `m` in the middle of some word. A **boundary** is the position right after a **separator** - a space, slash, underscore, hyphen, or dot - the spots where a new word or path segment starts. A matched character on a boundary earns **+8**.

This bonus stacks with everything from the earlier lessons; it is added per matched position, independent of the gap logic. One deliberate choice: index 0 is **not** treated as a boundary here - a match at the very start already benefits from a zero leading gap, so rewarding it again would double-count. Keeping start-of-string out of the boundary rule is what lets the earlier leading-gap lesson and this one compose cleanly, each owning its own effect.
