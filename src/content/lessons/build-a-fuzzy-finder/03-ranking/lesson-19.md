---
project: build-a-fuzzy-finder
lesson: 19
title: Anchoring the ends
overview: Path matching often wants "starts with" or "ends with". fzf uses caret and dollar for those. Today you add prefix and suffix anchors as two more term flags.
goal: Support a caret prefix meaning "candidate starts with this" and a dollar suffix meaning "candidate ends with this".
spec:
  scenario: Prefix and suffix anchors
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "src/main.go" with caret marking a prefix anchor and a trailing dollar marking a suffix anchor'
    - kw: When
      text: 'the query is "^src", then "^main", then "go$", then "mod$"'
    - kw: Then
      text: '"^src" matches with positions [0, 1, 2] (score 64), "^main" does not (the candidate does not start with "main"), "go$" matches with positions [9, 10] (score 45), and "mod$" does not (the candidate does not end with "mod")'
code:
  lang: go
  source: |
    // parseQuery: a leading ^ sets AnchorStart; a trailing $ sets AnchorEnd.
    // Anchored match = the literal text at the required end of the candidate.
    //   ^src : candidate must start with "src" -> positions [0..len-1]
    //   go$  : candidate must end with "go"    -> positions at the tail
    // Score the matched run with score() as before.
    if strings.HasPrefix(word, "^") { t.AnchorStart = true; t.Text = word[1:] }
    if strings.HasSuffix(t.Text, "$") { t.AnchorEnd = true; t.Text = t.Text[:len(t.Text)-1] }
checkpoint: Queries can now anchor a term to the start or end of a candidate. Commit and stop here.
---

Path and filename queries often mean something more precise than "contains". You want files that **start with** `src`, or ones that **end with** `.go`. fzf writes these as **anchors**: a leading caret means the term must match at the very start of the candidate, and a trailing dollar means it must match at the very end. Both are literal, like the exact term - the anchor is about *position*, not fuzziness.

Each is a flag on `Term` and a small change to how that term matches: `^src` succeeds only when the candidate begins with `src`, yielding the leading positions; `go$` succeeds only when it ends with `go`, yielding the trailing ones. The matched run scores through the same `score` function, so a suffix like `go$` still collects its boundary bonus if it starts after a separator. Because these are just more flags on the term you already parse, they slot in beside fuzzy and exact without disturbing the AND-of-terms loop.
