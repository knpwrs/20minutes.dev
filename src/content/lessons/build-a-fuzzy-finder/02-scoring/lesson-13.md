---
project: build-a-fuzzy-finder
lesson: 13
title: Recovering the positions
overview: A maximum score is not enough to highlight a match - you need the actual positions that achieved it. Today you trace the dynamic program back to recover the best-scoring positions, and the highlighter finally shows the optimal match.
goal: Trace the dynamic program back from the best cell to recover the list of candidate positions that produce the maximum score.
spec:
  scenario: Tracing back the optimal positions
  status: failing
  lines:
    - kw: Given
      text: 'the query "ab" against candidate "a_xab" and its maximum score of 37'
    - kw: When
      text: the best alignment's positions are recovered
    - kw: Then
      text: 'they are [3, 4] - the adjacent "a" and "b" near the end, not the greedy [0, 4]'
    - kw: And
      text: 'highlighting "a_xab" with those positions gives "a_x[a][b]"'
code:
  lang: go
  source: |
    // Two ways to recover the path:
    //  - store a parent index in each cell as you fill the table, or
    //  - after filling, start at the argmax of the last row and walk
    //    backward, at each step picking the previous-row cell that the
    //    current cell's value was built from.
    // Collect positions, then reverse so they read left to right.
    // Feed them straight into highlight() from lesson 6.
checkpoint: The finder highlights the highest-scoring alignment, not just the greedy one. Commit and stop here.
---

A score ranks a match, but to **show** it you need the positions behind that score. The dynamic program from the last lesson already computed the best value in each cell; recovering the winning positions means **tracing back** through the choices that produced it. Either remember, for each cell, which earlier cell it built on, or re-derive that link on the way back by finding the predecessor whose value matches. Start at the highest cell in the last row and walk backward to the first query character, collecting positions as you go, then reverse them.

This closes the loop opened in chapter one. Back then, `highlight` marked the **greedy** positions; now it marks the **optimal** ones, so `a_xab` lights up the adjacent `[a][b]` at the end instead of the scattered greedy pair. The highlighter did not change at all - only the positions feeding it got smarter. With matching, scoring, the best alignment, and its positions all in hand, you have everything one candidate needs. The next chapter turns that into a **ranking** over a whole list.
