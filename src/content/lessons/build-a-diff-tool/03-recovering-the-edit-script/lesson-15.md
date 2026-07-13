---
project: build-a-diff-tool
lesson: 15
title: From path to edit script
overview: The coordinate path carries all the information of a diff - you just have to name each step. Today you classify every unit move into a Keep, Delete, or Insert, producing a full Myers edit script identical in shape to the baseline's.
goal: Turn the ordered unit moves into a keep/delete/insert edit script.
spec:
  scenario: Path steps become edit operations
  status: failing
  lines:
    - kw: Given
      text: 'the forward-ordered path steps for ["a", "b", "c"] against ["a", "x", "c"]'
    - kw: When
      text: 'myersDiff classifies each step into an operation'
    - kw: Then
      text: 'it returns exactly Keep "a", Delete "b", Insert "x", Keep "c"'
    - kw: And
      text: 'myersDiff(["a"], []) is Delete "a", myersDiff([], ["a"]) is Insert "a", and identical documents give all Keeps'
code:
  lang: go
  source: |
    for _, s := range steps { // s = {prevX, prevY, x, y}
      px, py, x, y := s[0], s[1], s[2], s[3]
      switch {
      case x > px && y > py:
        ops = append(ops, Op{Keep, a[px]})   // diagonal: a[px] == b[py]
      case x > px:
        ops = append(ops, Op{Delete, a[px]}) // right: old line dropped
      default:
        ops = append(ops, Op{Insert, b[py]}) // down: new line added
      }
    }
checkpoint: Myers produces a complete keep/delete/insert edit script. Commit and stop here.
---

A diagonal step consumed a matching line from both documents, so it is a **Keep** carrying `a[px]` (which equals `b[py]`). A right step consumed an old line with no new partner, so it is a **Delete** of `a[px]`. A down step consumed a new line, so it is an **Insert** of `b[py]`. That is the entire mapping - three cases, one per move kind - and it turns the abstract path into the same `[]Op` value the LCS baseline produced back in chapter one.

You now have a second, independent implementation of a diff engine, built the fast way. It should agree with the baseline on the simple, unambiguous cases - a single changed line gives `Keep, Delete, Insert, Keep` from either engine. On inputs with several equally-short diffs the two may pick different (but equally minimal) scripts, which is expected and fine. The next lesson makes the public `Diff` use this Myers path, and the one after celebrates it on the classic worked example.
