---
project: build-a-diff-tool
lesson: 5
title: A baseline diff from the table
overview: With the LCS table in hand, you can recover the whole diff by walking backward through it. Today Diff becomes genuinely correct for any two documents - a working baseline you will later check the Myers algorithm against.
goal: Backtrack the LCS table into a full keep/delete/insert edit script for arbitrary inputs.
spec:
  scenario: A mixed change becomes a keep/delete/insert script
  status: failing
  lines:
    - kw: Given
      text: 'the documents ["a", "b", "c"] and ["a", "x", "c"]'
    - kw: When
      text: 'Diff is called'
    - kw: Then
      text: 'it returns exactly Keep "a", Delete "b", Insert "x", Keep "c" (deletions before insertions within a change)'
    - kw: And
      text: 'the earlier identical and empty-side cases still produce their same scripts'
code:
  lang: go
  source: |
    // walk from the bottom-right corner back to the origin
    i, j := len(a), len(b)
    var rev []Op
    for i > 0 || j > 0 {
      switch {
      case i > 0 && j > 0 && a[i-1] == b[j-1]:
        rev = append(rev, Op{Keep, a[i-1]}); i--; j--
      case j > 0 && (i == 0 || C[i][j-1] >= C[i-1][j]):
        rev = append(rev, Op{Insert, b[j-1]}); j--
      default:
        rev = append(rev, Op{Delete, a[i-1]}); i--
      }
    }
    // rev is end-to-start; reverse it
checkpoint: Diff produces a correct edit script for any two documents. Commit and stop here.
---

The table told you *how many* lines can be kept; walking it backward tells you *which* ones, and what to do with the rest. Start at the bottom-right cell `C[n][m]` and step toward the origin. When the current old and new lines match, that line is part of the LCS - emit a **Keep** and step diagonally. When they do not, you came from whichever neighbour the table value was copied from: move that way and emit a **Delete** (step up, consuming an old line) or an **Insert** (step left, consuming a new line). Because you walked backward, reverse the collected operations at the end.

One deliberate tie-break decides readability: when a line was both deleted and inserted (a changed line), we prefer to emit the **Delete before the Insert**, matching how every diff tool displays a change - the old `-b` line above the new `+x` line. That is why the condition prefers the insert-consuming move (`>=`) during the backward walk, which lands the delete first once reversed. This baseline is correct but O(nm) in time and space; the Myers algorithm in the next chapter reaches the same answer far more cheaply, and this version is what you will test it against.
