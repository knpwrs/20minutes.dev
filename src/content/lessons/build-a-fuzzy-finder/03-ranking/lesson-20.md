---
project: build-a-fuzzy-finder
lesson: 20
title: Excluding matches
overview: Filtering out noise is as useful as finding signal - "main but not test" is a common need. fzf writes exclusion with a leading bang. Today you add negated terms.
goal: Support a term prefixed with a bang that excludes any candidate matching it, contributing no score.
spec:
  scenario: Negated terms
  status: failing
  lines:
    - kw: Given
      text: 'the candidates ["src/main.go", "src/main_test.go", "README.md"]'
    - kw: When
      text: 'the query is "main !test", then just "!test" against ["a_test", "hello"]'
    - kw: Then
      text: 'for "main !test" only "src/main.go" survives ("src/main_test.go" is excluded because it matches "test", and "README.md" is excluded because it lacks "main"), and for "!test" against ["a_test", "hello"] only "hello" survives, with score 0'
code:
  lang: go
  source: |
    // parseQuery: a leading ! sets Negate and strips the bang.
    // Matching rule per candidate:
    //   every positive term must match;
    //   every negated term must NOT match (else exclude the candidate).
    // Negated terms add 0 to the score and no positions.
    if strings.HasPrefix(word, "!") { t.Negate = true; t.Text = word[1:] }
checkpoint: Queries can now exclude candidates as well as require them. Commit and stop here.
---

The last piece of query syntax is **subtraction**. You want everything matching `main` **except** the tests - `main !test`. A **negated** term, written with a leading bang, flips the requirement: a candidate matching it is **excluded**. It contributes nothing to the score and no positions; its only job is to remove candidates.

The matching rule generalizes cleanly: a candidate survives when **every positive term matches and every negated term does not**. A query made only of negations - `!test` - is a legitimate "everything except" filter, so every candidate that lacks the excluded term matches with a score of **0** and nothing highlighted. With fuzzy, exact, anchored, and negated terms all parsed into the same `Term` list, the finder now speaks fzf's extended query language, and the next lesson wires the whole thing into the tool.
