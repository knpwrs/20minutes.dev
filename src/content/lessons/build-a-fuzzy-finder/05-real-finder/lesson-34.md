---
project: build-a-fuzzy-finder
lesson: 34
title: 'Capstone: find in a real tree'
overview: The final lesson runs the whole finder over a realistic file tree the way you would use it for real - type a query, watch it rank, move the selection, and accept a path. It exercises every piece the project built, end to end.
goal: Drive the finder over a realistic file-listing corpus through a full session, and prove the ranking and the accepted path are exactly what the design predicts.
spec:
  scenario: An interactive find over a project tree
  status: failing
  lines:
    - kw: Given
      text: 'a Finder over the corpus ["cmd/finder/main.go", "internal/score/score.go", "internal/score/score_test.go", "internal/match/match.go", "README.md", "go.mod"]'
    - kw: When
      text: 'the query "score" is typed, then Down is pressed, then Enter'
    - kw: Then
      text: 'the frame header reads "> score [2/6]" (two candidates contain "score"), the top result is "internal/score/score.go" (it ties on score with the test file but is shorter, so it leads), and after Down and Enter the accepted path is "internal/score/score_test.go"'
    - kw: And
      text: 'typing a query that matches nothing, such as "qqq", leaves the finder showing "> qqq [0/6]" with no rows and nothing to accept'
code:
  lang: go
  source: |
    // Build the finder from the corpus, then run the scripted session:
    //   type "score" -> Down -> Enter
    // Assert the header count (2/6), the ordering (score.go before
    // score_test.go by the length tie-break), and the accepted path.
    // This is your finder, used exactly as a person would use it.
checkpoint: Your fuzzy finder ranks a real file tree and returns the path you chose. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a working fuzzy finder, driven over a realistic **project tree** the way you would actually use one. Typing `score` narrows six paths to the two that contain it; both match the contiguous `score` run equally, so the **shorter** `score.go` leads the `score_test.go` on the length tie-break; pressing Down and Enter accepts the test file. Every layer is in play at once - the subsequence gate, the boundary- and consecutive-aware score, the dynamic program that finds the best alignment, the ranking and its tie-break, the selection, and accept.

From a one-line subsequence test you have built the honest core of fzf: fuzzy matching with smart-case, a real scoring model, an optimal alignment found by dynamic programming, ranked results with extended query syntax, highlighting, incremental narrowing, a bounded top-K fast path, and an interactive finder over a live corpus. The empty-query and no-match edges behave, the tie-breaks are deterministic, and the same pipeline serves both the scripted session and the `-f` filter. That is the core every real fuzzy finder - fzf, skim, selecta - is built around.
