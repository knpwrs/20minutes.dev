---
project: build-an-autocomplete-engine
lesson: 14
title: Breaking weight ties
overview: When two completions share a weight, the order must still be deterministic - the same input can never produce two different suggestion lists. Today you pin the tie-break, so equal weights fall back to lexicographic order.
goal: Order equal-weight completions lexicographically, so ranking is fully deterministic.
spec:
  scenario: Equal weights break to lexicographic order
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cat", 5), Add("car", 5), Add("cab", 3)'
    - kw: When
      text: 'Suggest("ca", 5) is called'
    - kw: Then
      text: 'it returns exactly ["car", "cat", "cab"] - car before cat because they tie at weight 5 and car sorts first'
    - kw: And
      text: 'the result is identical no matter what order the terms were added'
code:
  lang: go
  source: |
    // Make the comparison total: weight first, then term as the tie-break.
    sort.Slice(cs, func(i, j int) bool {
      if cs[i].Weight != cs[j].Weight {
        return cs[i].Weight > cs[j].Weight // heavier first
      }
      return cs[i].Term < cs[j].Term // equal weight: lexicographic
    })
    // (An explicit total order is clearer than relying on a stable pre-sort.)
checkpoint: Equal-weight completions are ordered lexicographically, so ranking is deterministic. Commit and stop here.
---

Ranking by weight alone leaves a gap: what happens when `cat` and `car` both weigh
`5`? Without a rule, the answer depends on map iteration or sort internals, and the
same trie could return two different lists on two runs - unacceptable for a
suggestion box a person is reading. The fix is a **total order**: compare by weight
first, and when weights are equal, compare the terms lexicographically. `car` and
`cat` tie at 5, so `car` wins the tie and comes first, ahead of `cab` at 3.

Writing the comparison explicitly - weight descending, then term ascending - makes
the tie-break a stated part of the contract rather than an accident of a stable
sort. Every later feature (the cached ranking, learning from selections) must
preserve this exact order, so having it spelled out in one comparison function is
what keeps the whole engine's output reproducible.
