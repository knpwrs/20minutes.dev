---
project: build-a-spell-checker
lesson: 34
title: The top few suggestions
overview: One suggestion is often not enough - a user wants to see the two or three most likely words. Today you rank the whole candidate tier and return the top N, so each Issue offers a short menu of the best guesses.
goal: Return the N highest-ranked candidates for a word, ordered by frequency then alphabetically.
spec:
  scenario: The N best suggestions for a typo
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary with counts the:1000, ten:100, tea:50'
    - kw: When
      text: 'SuggestN("teh", 3) is called'
    - kw: Then
      text: 'it returns ["the", "ten", "tea"] - all three candidates, highest frequency first'
    - kw: And
      text: 'SuggestN("teh", 2) returns ["the", "ten"] (the top two), and ties in frequency fall back to alphabetical order'
code:
  lang: go
  source: |
    func (d *Dictionary) SuggestN(word string, n int) []string {
      // take Candidates(word), sort by Count descending,
      // break ties alphabetically, return the first n
    }
checkpoint: The checker can offer the top few suggestions, best first. Commit and stop here.
---

`BestByFreq` collapsed a candidate set to one winner; a good tool shows a little
more of its reasoning. `SuggestN` ranks the **whole** tier - by frequency first,
alphabetically to break ties - and returns the top `n`. For `teh`, that is `the`,
`ten`, `tea`, in descending commonness, so a user who did not mean the top guess can
grab the second.

This is the same ranking rule as before, just applied to produce an ordered list
rather than a single element, and it is why the tie-break was worth pinning down: a
stable sort means the menu never reshuffles between runs. The `Checker` now fills
each `Issue`'s `Suggestions` with `SuggestN`, so every flagged word arrives with its
short list of the most likely corrections instead of a lone guess.
