---
project: build-an-autocomplete-engine
lesson: 25
title: 'Capstone: as-you-type over a real list'
overview: The finale loads a weighted term list, serves ranked completions as a prefix grows character by character, records a couple of selections, and shows the rankings change - every layer you built proving itself at once.
goal: Load a weighted list, serve ranked completions as-you-type, record selections, and assert the exact re-ranked lists.
spec:
  scenario: A full session ends in learned, re-ranked suggestions
  status: failing
  lines:
    - kw: Given
      text: 'a fresh engine loaded with go=10, golang=6, google=8, good=9, goodbye=4, gopher=5'
    - kw: When
      text: 'a session types "go" then "goo" then "goog", then Record("golang") five times, then Record("gospel") once (a new term)'
    - kw: Then
      text: 'as-you-type gives Suggest("go",3)=["go","good","google"], Suggest("goo",3)=["good","google","goodbye"], and Suggest("goog",3)=["google"]'
    - kw: And
      text: 'after the selections Suggest("go",3)=["golang","go","good"] (golang at 11 leads) and Len() is 7 with Suggest("go",8)=["golang","go","good","google","gopher","goodbye","gospel"]'
code:
  lang: go
  source: |
    e := NewTrie()
    for _, c := range []Completion{{"go",10},{"golang",6},{"google",8},
      {"good",9},{"goodbye",4},{"gopher",5}} {
      e.Add(c.Term, c.Weight)
    }
    // as-you-type: e.Suggest("go",3); e.Suggest("goo",3); e.Suggest("goog",3)
    for i := 0; i < 5; i++ { e.Record("golang") } // golang: 6 -> 11
    e.Record("gospel")                            // brand-new term at weight 1
    // e.Suggest("go",3) == ["golang","go","good"]; e.Len() == 7
checkpoint: Your engine loads a real list, completes as-you-type, and learns from selections. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **autocomplete
engine**. Loading the list builds a trie whose every node already carries its
cached top completions, so each keystroke - `go`, then `goo`, then `goog` - is an
instant cache read that narrows the ranked suggestions exactly as a search box
does. `go` offers the heaviest completions of `go`; `goo` drops to the words under
`goo`; `goog` resolves to the single `google`. No rescan, no re-sort - just walk
the prefix and read.

Then the engine **learns**. Five selections of `golang` lift it from 6 to 11, past
`go` at 10, so the very next `Suggest("go", 3)` leads with `golang` - the rankings
changed because a person used it. Recording `gospel`, a term never loaded, adds it
on the fly at weight 1, taking the count to 7 and appearing at the tail of a full
`Suggest("go", 8)` that falls back to a scan for the larger request. From an empty
trie you have built the honest core of a production typeahead - a prefix tree,
ranked top-K completions cached for O(prefix + K) reads, learning from selections,
case-folding, phrases, and a single-typo fallback - the same design that sits
inside Elasticsearch's completion suggester and the search box you use every day,
minus the compression and sharding they layer on top. That is a real autocomplete
engine, and it is yours.
