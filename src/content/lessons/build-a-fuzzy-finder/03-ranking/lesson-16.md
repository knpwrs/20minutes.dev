---
project: build-a-fuzzy-finder
lesson: 16
title: Breaking ties
overview: Real candidate lists produce lots of equal scores, and a finder should break those ties sensibly rather than at random. Today you add a deterministic tie-breaker - shorter candidates first, then stable input order.
goal: When scores are equal, order the shorter candidate first, and preserve input order when both score and length are equal.
spec:
  scenario: Deterministic tie-breaking
  status: failing
  lines:
    - kw: Given
      text: 'the query "ab"'
    - kw: When
      text: 'rank sorts the candidates ["abcd", "abc", "ab"], and separately sorts ["p_ab", "q_ab"]'
    - kw: Then
      text: 'for ["abcd", "abc", "ab"] - all scoring 40 - the order becomes "ab", "abc", "abcd" (shorter first), and for ["p_ab", "q_ab"] - both scoring 46 and equal length - the order stays "p_ab", "q_ab" (original input order preserved)'
code:
  lang: go
  source: |
    // Compare by score desc; on a tie, shorter candidate wins; on a
    // further tie, keep input order. A stable sort gives the last part
    // for free if your less() returns false for equal-key pairs.
    sort.SliceStable(results, func(i, j int) bool {
      if results[i].Score != results[j].Score {
        return results[i].Score > results[j].Score
      }
      return len(results[i].Candidate) < len(results[j].Candidate)
    })
checkpoint: Equal-scoring matches now order predictably instead of arbitrarily. Commit and stop here.
---

A scoring model as coarse as this one produces **ties constantly** - a whole column of file paths where the query matches the same run of characters scores identically. Left unbroken, ties would surface in whatever order the sort happened to leave them, which feels random to the user. A finder needs a **deterministic** rule.

The rule is a small cascade: highest **score** first; on a tie, the **shorter** candidate, because a query fills more of a short string and is more likely what you meant; and if score and length are equal too, the **original input order** wins, which a stable sort preserves as long as your comparison reports equal-key pairs as "not less". Pinning both the length case and the equal-length stability case is what makes the ordering fully predictable - the same input always yields the same list, which matters the moment results start updating on every keystroke.
