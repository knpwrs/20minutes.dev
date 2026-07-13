---
project: build-a-fuzzy-finder
lesson: 12
title: The best alignment
overview: Greedy leftmost positions are not always the highest-scoring ones - a match packed against a boundary can beat one that starts earlier. Today you find the alignment with the maximum score using a dynamic program.
goal: Compute the maximum score achievable over every valid subsequence alignment of the query in the candidate.
spec:
  scenario: The maximum-scoring alignment
  status: failing
  lines:
    - kw: Given
      text: 'the completed scoring model and the query "ab" against candidate "a_xab"'
    - kw: When
      text: bestScore is computed over all valid alignments
    - kw: Then
      text: 'it returns 37 - the alignment on the second "a" and the "b" (positions [3, 4]) scores 37 because they are adjacent, beating the greedy leftmost alignment on positions [0, 4], which scores only 29'
    - kw: And
      text: 'bestScore for query "ab" against candidate "ab" is 40 (the single possible alignment), so the search never scores worse than the obvious match'
code:
  lang: go
  source: |
    // DP over query index i and candidate index j.
    // best[i][j] = highest score matching query[0..i] with query[i]
    //              placed at candidate index j (only where chars match).
    //   row 0 uses your leading-gap + boundary rules.
    //   later rows: today's per-char score, added to the best compatible
    //   earlier cell (any j' < j on the previous row), reusing your gap /
    //   consecutive / boundary logic.
    // Answer: the max over the last row. Build the per-char scoring you
    // already have into the transition; don't rescore whole strings.
checkpoint: The finder can find the highest-scoring way to match, not just any way. Commit and stop here.
---

Greedy matching takes the **leftmost** occurrence of each query character, but leftmost is not always **best**. Matching `ab` in `a_xab`, the greedy walk grabs the first `a` at index 0 and is then forced onto the far-away `b`, a scattered match. The better alignment ignores the early `a` and takes the `a` and `b` that sit **adjacent** near the end - the consecutive bonus more than pays for the later start. Finding that automatically is an optimization problem: over all valid subsequence alignments, which one **maximizes** the score?

The answer is a **dynamic program**, the same shape as sequence alignment. Build a table indexed by query character and candidate position; each cell holds the best score for matching the query up to that character with it placed at that candidate index. A cell's value is today's per-character score plus the best compatible earlier cell - so every subproblem is solved once and reused. This is the algorithmic heart of the finder; it is more work than the greedy walk, which is exactly why the earlier chapters used greedy for the cheap "does it match" gate and save this for scoring the matches that survive.
