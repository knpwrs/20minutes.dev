---
project: build-an-autocomplete-engine
lesson: 13
title: Ranking by weight
overview: Now the payoff of weights - suggestions ordered by importance. Today you build Suggest, which returns a prefix's completions sorted by weight, heaviest first.
goal: Return a prefix's completions ordered by weight, highest first.
spec:
  scenario: Suggest orders completions by descending weight
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cab", 2), Add("car", 5), Add("cat", 9)'
    - kw: When
      text: 'Suggest("ca", 5) is called'
    - kw: Then
      text: 'it returns exactly ["cat", "car", "cab"], ordered by weight 9, 5, 2'
    - kw: And
      text: 'the terms are just the ranked term strings, not the weights'
code:
  lang: go
  source: |
    func (t *Trie) Suggest(prefix string, k int) []string {
      cs := t.WeightedCompletions(prefix) // lexicographic by term
      sort.SliceStable(cs, func(i, j int) bool {
        return cs[i].Weight > cs[j].Weight // heaviest first
      })
      out := []string{}
      for _, c := range cs {
        out = append(out, c.Term)
      }
      return out
    }
checkpoint: Suggest returns a prefix's completions ranked by weight. Commit and stop here.
---

`Suggest` is the ranked query that autocomplete really wants: collect the weighted
completions, sort them so the heaviest weight comes first, and return just the
terms. Given `cab` at 2, `car` at 5, and `cat` at 9, typing `ca` should offer
`cat`, then `car`, then `cab` - most popular first. The `k` argument is the number
of suggestions the caller wants; today every example asks for more than exist, so
it returns them all, and the next lessons pin down ties and truncation.

One detail carries real weight: sort the lexicographic list with a **stable**
sort. Because `WeightedCompletions` already handed you the terms in lexicographic
order, a stable sort by weight leaves equal-weight terms in that lexicographic
order - which is exactly the tie-break you will formalise next. Starting from an
ordered list and sorting stably is what makes the ranking deterministic.
