---
project: build-a-semver-parser
lesson: 12
title: Sorting a list of versions
overview: With a complete Compare, sorting any pile of versions into precedence order is a short step - and a satisfying one. Today you sort a shuffled list and watch the whole ordering fall into place.
goal: Sort a list of versions into ascending precedence order using Compare.
spec:
  scenario: A shuffled list sorts into precedence order
  status: failing
  lines:
    - kw: Given
      text: 'the list ["1.0.0", "1.0.0-beta.11", "1.0.0-alpha", "1.0.0-rc.1", "1.0.0-beta", "1.0.0-alpha.beta", "1.0.0-beta.2", "1.0.0-alpha.1"]'
    - kw: When
      text: 'it is sorted ascending with Sort'
    - kw: Then
      text: 'the order becomes 1.0.0-alpha, 1.0.0-alpha.1, 1.0.0-alpha.beta, 1.0.0-beta, 1.0.0-beta.2, 1.0.0-beta.11, 1.0.0-rc.1, 1.0.0'
    - kw: And
      text: 'sorting the single-element and empty lists leaves them unchanged'
code:
  lang: go
  source: |
    // Reuse Compare as the ordering. Sort a slice of Version ascending: a before b when
    // Compare(a, b) < 0. Any standard library sort with a comparator works.
    func Sort(vs []Version) { /* sort in place using Compare */ }
checkpoint: You can sort any list of versions into precedence order. The precedence chapter is complete; commit and stop here.
---

Ordering two versions generalizes to ordering a whole list for free: hand
`Compare` to any standard sort as its comparison function and a shuffled pile of
versions lands in precedence order. This is the kind of thing a package manager
does constantly - "show me the available versions from oldest to newest," "pick
the latest" - and it all rides on the `Compare` you spent this chapter building.

The spec's eight-version chain makes a perfect test because there is exactly one
correct order, and it exercises every precedence rule at once, so a single sorted
result confirms the whole chapter. Sorting is where a subtle bug in `Compare`
would finally show - a mis-ranked pair leaves the list visibly out of order - so a
clean sort of this list is strong evidence the comparison is right. With precedence
finished, the next chapter turns to the other half of the library: ranges, and
whether a version falls inside one.
