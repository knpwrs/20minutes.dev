---
project: build-a-fuzzy-finder
lesson: 11
title: camelCase humps
overview: In code, a capital letter in the middle of a word marks a new word just as clearly as a separator does. Today you extend the boundary rule to camelCase humps so matches on them score like word starts.
goal: Treat a lowercase-to-uppercase transition as a boundary, so a matched uppercase character following a lowercase one earns the boundary bonus.
spec:
  scenario: camelCase hump as a boundary
  status: failing
  lines:
    - kw: Given
      text: 'the boundary rule extended so a matched uppercase character preceded by a lowercase character also counts as a boundary'
    - kw: When
      text: 'score is called with candidate "myVar" and positions [2], then with candidate "myvar" and positions [2]'
    - kw: Then
      text: 'candidate "myVar" with positions [2] scores 22 (16, minus 2 for the leading gap, plus 8 because the uppercase V after lowercase y is a camelCase hump), and candidate "myvar" with positions [2] scores 14 (16, minus 2, no hump because v is lowercase)'
code:
  lang: go
  source: |
    // Extend isBoundary: a hump is upper(candidate[p]) after lower(candidate[p-1]).
    func isBoundary(candidate string, p int) bool {
      if p == 0 { return false }
      if isSeparator(candidate[p-1]) { return true }
      // camelCase hump:
      return isUpper(candidate[p]) && isLower(candidate[p-1])
    }
checkpoint: Matches on camelCase humps now score like matches at word starts. Commit and stop here.
---

Identifiers do not use spaces, they use **case**. `MainWindow`, `parseURL`, `httpClient` - each capital in the middle marks the start of a new word, exactly the way a separator does in a path. So the boundary rule extends: a matched **uppercase** character that follows a **lowercase** one is a **camelCase hump**, and it earns the same **+8** as a match after a separator.

This is a pure widening of the `isBoundary` predicate from the last lesson - separators still count, and now humps do too. The value is unchanged; only the definition of "boundary" grows. With this in place, typing `mw` for `MainWindow` or `pu` for `parseURL` scores as strong word-start matches, which is precisely what makes a fuzzy finder feel like it understands code. The scoring model is now complete: match reward, consecutive bonus, leading and interior gap penalties, and boundary bonuses. Next you find the alignment that maximizes it.
