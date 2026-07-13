---
project: build-a-fuzzy-finder
lesson: 5
title: Where did it match?
overview: Knowing a query matches is not enough - to score and highlight a match you need to know exactly which candidate characters it landed on. Today the matcher starts reporting those positions.
goal: Change the matcher to return the list of candidate indices where each query character matched, using the greedy leftmost choice.
spec:
  scenario: Reporting greedy match positions
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "src/main.go"'
    - kw: When
      text: 'match positions are requested for query "smg", then for "main", then for "xyz", then for ""'
    - kw: Then
      text: 'for "smg" the positions are [0, 4, 9] (the first s, first m, first g, taken leftmost), for "main" they are [4, 5, 6, 7], for "xyz" there is no match, and for "" the positions are empty (a match with nothing highlighted)'
code:
  lang: go
  source: |
    // Same two-cursor walk, but record each candidate index you consume.
    // "Greedy leftmost": take the first candidate char that fits each
    // query char. Return the positions plus whether it matched at all.
    func matchPositions(query, candidate string) ([]int, bool) {
      pos := []int{}
      qi := 0
      for ci := 0; qi < len(query) && ci < len(candidate); ci++ {
        if equalSmartCase(query[qi], candidate[ci], query) {
          pos = append(pos, ci)
          qi++
        }
      }
      return pos, qi == len(query)
    }
checkpoint: The matcher now reports exactly where each query character landed. Commit and stop here.
---

A boolean answer was enough to filter, but everything ahead - scoring a match, highlighting it, ranking one candidate above another - needs to know **which characters** the query matched. So the matcher graduates from returning `true` to returning a list of **positions**: one candidate index per query character, in order.

The rule for *which* index is the **greedy leftmost** one: for each query character, take the first candidate character that fits. That is the natural output of the two-cursor walk you already have - just record each index as you consume it. Greedy positions are not always the best-looking match (a later lesson finds a higher-scoring alignment), but they are correct, cheap, and the right foundation. Note the edges: no match returns no positions and a false flag, and an empty query matches with an **empty** position list - a real match that highlights nothing.
