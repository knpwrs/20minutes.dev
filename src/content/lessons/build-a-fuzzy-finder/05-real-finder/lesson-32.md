---
project: build-a-fuzzy-finder
lesson: 32
title: When nothing matches
overview: A query that matches nothing is a normal state, not an error - the finder should say so rather than show a blank void. Today you give the frame an explicit empty-state line and confirm the header's match count stays live.
goal: Render an explicit "no matches" line under the header when nothing matches, and keep the header count accurate as matches come and go.
spec:
  scenario: The empty-result frame
  status: failing
  lines:
    - kw: Given
      text: 'a Finder over ["src/main.go", "go.mod"] rendered at height 5'
    - kw: When
      text: 'the query is "zzz" (no match), then "go" (both match)'
    - kw: Then
      text: 'for "zzz" the frame is exactly two lines - the header "> zzz [0/2]" and a "  (no matches)" line beneath it - and for "go" the header reads "> go [2/2]" with real result rows and no "(no matches)" line'
code:
  lang: go
  source: |
    // In Render, after the header: if there are zero results, emit one
    // explicit empty-state row instead of the (empty) result rows.
    if len(f.Results) == 0 {
      lines = append(lines, "  (no matches)")
    } else {
      // ... the existing marker + highlight rows
    }
checkpoint: The finder shows an explicit "no matches" state and keeps its count honest. Commit and stop here.
---

Typing a query that matches nothing happens constantly - a typo, a filter that is too narrow - and it is a perfectly ordinary state. A finder that just shows a bare header and empty space leaves the user wondering whether it is thinking, broken, or done. Far better to **say it plainly**: a single `  (no matches)` line under the header. The header's count, `0/2`, reinforces it - the query is the problem, not the tool.

The change is one branch in `Render`: when there are zero results, emit the empty-state line; otherwise emit the result rows exactly as before. Keeping the **match count** live is the other half - `2/2` when everything matches, `0/2` when nothing does - so the header always reflects reality as the user types and deletes. This is the kind of edge, the empty set, that a finder meets on real input all the time, so handling it explicitly now keeps the capstone's live session honest.
