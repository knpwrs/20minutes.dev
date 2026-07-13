---
project: build-a-fuzzy-finder
lesson: 17
title: Every word must fit
overview: Real queries have spaces - "src go" should mean "matches src AND matches go". Today you split the query into terms and require every one to match, summing their scores.
goal: Split the query on spaces into terms and require a candidate to match all of them, scoring the sum and combining the positions.
spec:
  scenario: Multi-term AND matching
  status: failing
  lines:
    - kw: Given
      text: 'the query "src go" (two terms) against candidate "src/main.go"'
    - kw: When
      text: the candidate is matched and scored against every term
    - kw: Then
      text: 'it matches (both "src" and "go" are found), its score is 109 (64 for "src" plus 45 for "go"), and its combined positions are [0, 1, 2, 9, 10] (the union of both terms'' positions)'
    - kw: And
      text: 'the query "src xyz" does not match "src/main.go" - a candidate must satisfy every term, and "xyz" is not found'
code:
  lang: go
  source: |
    // A query is a list of terms. Front-load the shape now; later lessons
    // fill in the flags.
    type Term struct {
      Text        string
      Exact       bool
      AnchorStart bool
      AnchorEnd   bool
      Negate      bool
    }
    func parseQuery(q string) []Term { /* split on spaces -> Term{Text: w} */ }
    // Candidate matches iff EVERY term matches; score = sum, positions =
    // sorted union across terms.
checkpoint: Space-separated queries now behave as an AND of terms. Commit and stop here.
---

Once queries get real, they get **spaces**. Typing `src go` for `src/main.go` means "the candidate must contain a `src`-ish run **and** a `go`-ish run" - two independent fuzzy matches, both required. So the query stops being one string and becomes a list of **terms**, split on whitespace, and a candidate is a match only if **every** term matches it.

Scoring composes naturally: run each term's best-alignment score and **sum** them, and take the **union** of their positions for highlighting. This is also the moment to introduce the `Term` type with room for the flags the next lessons need - exact, anchored, negated - even though today every term is a plain fuzzy term. Giving `Term` its full shape now means those lessons only set a flag and branch, instead of forcing a rewrite of this matching loop. The single new idea today is "all terms must fit"; the flags stay dormant until their lessons.
