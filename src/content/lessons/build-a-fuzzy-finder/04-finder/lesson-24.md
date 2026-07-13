---
project: build-a-fuzzy-finder
lesson: 24
title: The finder's state
overview: An interactive finder is a little state machine - a corpus, the current query, the current results, and which one is selected. Today you build that state and the operation that updates it when the query changes.
goal: Build a Finder holding candidates, query, results, and a selection index, where setting the query re-ranks and resets the selection to the top.
spec:
  scenario: Finder state on a query change
  status: failing
  lines:
    - kw: Given
      text: 'a Finder over candidates ["src/main.go", "go.mod", "src/app.go"]'
    - kw: When
      text: 'its query is set to "go", then set to "" (empty)'
    - kw: Then
      text: 'after "go" the results are ["src/app.go", "src/main.go", "go.mod"] (ranked) with the selection index at 0, and after "" every candidate is a result in input order with the selection back at 0'
code:
  lang: go
  source: |
    type Finder struct {
      Candidates []string
      Query      string
      Results    []Result
      Selection  int
    }
    func (f *Finder) SetQuery(q string) {
      f.Query = q
      f.Results = rank(q, f.Candidates)  // empty query -> all, score 0
      f.Selection = 0                    // selection returns to the top
    }
checkpoint: The finder holds live state that updates whenever the query changes. Commit and stop here.
---

Everything so far has been stateless functions. An interactive finder needs to **remember**: the full candidate list, what the user has typed, the current results, and which result is highlighted. Bundling those into a **Finder** turns the batch pipeline into a live object you can poke at - the model behind the screen, independent of any terminal.

The one operation today is **setting the query**, and it does two things: re-rank the candidates for the new query, and **reset the selection to the top**. Resetting matters because the result list just changed out from under the cursor - keeping an old index would point at an unrelated line, or off the end entirely. An empty query is the natural resting state: every candidate is a result, scored zero, in input order. From here, the remaining lessons add the other things a user does - move the selection, accept one, edit the query - each as one more method on this state.
