---
project: build-a-fuzzy-finder
lesson: 14
title: A ranked result
overview: To rank a list you first need a result you can compare - a candidate paired with its score and matched positions. Today you score every matching candidate into a Result.
goal: Produce a Result (candidate, score, positions) for each candidate that matches the query, skipping those that do not.
spec:
  scenario: Scoring a candidate list into results
  status: failing
  lines:
    - kw: Given
      text: 'the candidates ["src/main.go", "README.md", "go.mod", "src/app.go"] and the query "go"'
    - kw: When
      text: rank produces a Result for each match
    - kw: Then
      text: 'it returns three results, in input order, for "src/main.go", "go.mod", and "src/app.go" - "README.md" is skipped because it does not match'
    - kw: And
      text: 'the result for "go.mod" has score 40 and positions [0, 1] (the best alignment of "go" on it)'
code:
  lang: go
  source: |
    type Result struct {
      Candidate string
      Score     int
      Positions []int
    }
    // For each candidate: run the match gate, and if it passes, compute
    // the best score and its positions (the DP + traceback from ch. 2).
    func rank(query string, candidates []string) []Result {
      var out []Result
      // append a Result per matching candidate, input order for now
      return out
    }
checkpoint: Every matching candidate now carries its score and positions. Commit and stop here.
---

Ranking needs a unit of comparison. That unit is a **Result**: a candidate bundled with the **score** of its best alignment and the **positions** behind that score. Producing one is just composing what chapter two built - gate each candidate with the match test, and for the ones that pass, run the dynamic program to get the score and trace back the positions.

Today `rank` returns the results in **input order**, unsorted - the sorting is the next lesson's single idea. Non-matches are simply dropped, so the result list is already the filtered set, now annotated with quality. Bundling score and positions together here means every later step - sorting, tie-breaking, top-K, rendering - works on one tidy value instead of recomputing scores. This is the shape the whole back half of the project passes around.
