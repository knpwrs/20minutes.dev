---
project: build-a-text-editor
lesson: 31
title: Highlighting the match
overview: A found match should stand out on screen. Today you remember the last match and mark it in the rendered frame, tying search into the viewport.
goal: Remember the current match span and bracket it in the rendered frame; clear it when the text is edited.
spec:
  scenario: Marking the current match in the frame
  status: failing
  lines:
    - kw: Given
      text: 'an editor over the single line "foo bar" rendered at width 20'
    - kw: When
      text: 'FindNext("bar") succeeds and the frame is rendered'
    - kw: Then
      text: 'the rendered line is "foo [bar]" (the match wrapped in square brackets)'
    - kw: And
      text: 'after any edit (such as InsertChar) the highlight is cleared, so the line renders as plain text again'
code:
  lang: go
  source: |
    // a successful find records the match: matchRow, matchCol, matchLen.
    // in Render, on the match row, splice "[" before matchCol and "]"
    // after matchCol+matchLen.
    // every editing op clears the match (matchLen = 0) so a stale
    // highlight never lingers over changed text.
checkpoint: The editor highlights the current search match. Commit and stop here.
---

A match you cannot see is only half a search. When a find succeeds, the editor
**remembers** where the match is - its row, column, and length - and the renderer
draws attention to it by wrapping it in brackets, the same plain-text highlighting
trick the fuzzy-finder used to stay terminal-independent. In a real terminal those
brackets become reverse-video, but as a string they are exact and testable:
`"foo bar"` with `bar` found renders as `"foo [bar]"`.

The important half is **invalidation**. A remembered match is only valid until the
text changes - insert a character and the offsets shift, so a stale highlight would
bracket the wrong span. So every editing operation clears the match, and the
highlight simply disappears until the next find. This is the first feature to couple
search and rendering, and handling the "the text moved out from under it" case now is
what makes the next lesson - replacing the very match you just found - safe.
