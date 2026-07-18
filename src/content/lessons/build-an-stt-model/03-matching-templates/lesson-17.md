---
project: build-an-stt-model
lesson: 17
title: The DTW path
overview: The cost matrix says how expensive the best alignment is; today you walk it backwards to see exactly which alignment that is, using a tie-break rule that makes the walk reproducible whenever two routes cost exactly the same.
goal: Backtrack lesson 16's cost matrix from its bottom-right cell to its top-left cell, using the pinned tie-break, and confirm the exact path.
spec:
  scenario: Backtracking the cost matrix into an alignment path
  status: failing
  lines:
    - kw: Given
      text: 'lesson 16''s completed cost matrix for reference [1, 3, 4, 5] and test [1, 2, 4, 4, 5]'
    - kw: And
      text: 'the backtracking rule: from cell (i, j), step to whichever of the diagonal (i-1, j-1), upward (i-1, j), or leftward (i, j-1) neighbor has the lowest cost; on a tie, prefer diagonal, then upward, then leftward'
    - kw: When
      text: 'the path is backtracked from the bottom-right cell, row 3 column 4, to the top-left cell, row 0 column 0'
    - kw: Then
      text: 'the path, in order from start to end, is (0, 0), (1, 1), (2, 2), (2, 3), (3, 4)'
    - kw: And
      text: 'that is four moves - three diagonal moves and one move that advances only the test index, from (2, 2) to (2, 3) - reference frame 4 (value 5) never gets matched against test frame 4 (value 4) directly, only against frame index 3 and then 4'
    - kw: And
      text: 'the path''s final cell, (3, 4), carries the same total cost lesson 16 already found there: 1.0'
code:
  lang: go
  source: |
    // walk backward from (len(cost)-1, len(cost[0])-1) to (0, 0); at each
    // step compare cost[i-1][j-1], cost[i-1][j], cost[i][j-1] and move to
    // the cheapest, preferring diagonal, then upward, then leftward on a tie
    func Backtrack(cost [][]float64) [][2]int {
      i, j := len(cost)-1, len(cost[0])-1
      path := [][2]int{{i, j}}
      for i > 0 || j > 0 {
        // decide the next (i, j) here, then prepend it to path
      }
      return path
    }
checkpoint: You can turn any cost matrix into a concrete alignment path, using a tie-break rule that makes the answer reproducible. Commit and stop for today.
---

The cost matrix tells you the price of the best alignment; the **path** tells you what that alignment actually looked like, frame by frame. Reading it out means walking backward from the bottom-right cell - the one holding the total cost - repeatedly stepping to whichever neighbor produced that cost, until you land back at the top-left. Every step is one of the same three moves the matrix was built from: diagonal, upward, or leftward, only now in reverse.

Today's walk does not happen to cross one of the ties lesson 16 pointed out, but the rule for breaking them still has to be pinned, because it is the only thing standing between "an" optimal alignment and "the" optimal alignment. Two implementations that both correctly minimize total cost can still disagree on which of several equally-cheap routes to report, and without a fixed rule for resolving that, the exact same cost matrix could hand back two different paths depending on which one you happened to write.
