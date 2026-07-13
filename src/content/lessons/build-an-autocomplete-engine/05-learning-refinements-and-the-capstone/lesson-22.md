---
project: build-an-autocomplete-engine
lesson: 22
title: Case-insensitive matching
overview: A user typing "app" expects to match "Apple", so matching should ignore case - while suggestions still show their original capitalisation. Today you fold case for storage and lookup but keep each term's display form.
goal: Match prefixes case-insensitively while returning each term in its original display form.
spec:
  scenario: Matching ignores case but display is preserved
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("Apple", 5), Add("App", 9), Add("apply", 3)'
    - kw: When
      text: 'Suggest("APP", 3) is called'
    - kw: Then
      text: 'it folds the prefix and returns exactly ["App", "Apple", "apply"] - ranked by weight, each in its stored capitalisation'
    - kw: And
      text: 'Contains("apple") and Contains("APPLE") are both true (lookup is case-insensitive)'
code:
  lang: go
  source: |
    func fold(s string) string { return strings.ToLower(s) }
    // Store: Add/Record walk the FOLDED key but save the original as display,
    //   and pass the original term to updateCache.
    //   at the end node: cur.end = true; cur.display = term
    // Look up: find folds its argument, so Contains/HasPrefix/Suggest all fold.
    // Collect: the DFS emits n.display (the original), not the folded path.
checkpoint: Matching is case-insensitive, and suggestions keep their original capitalisation. Commit and stop here.
---

People do not capitalise their searches to match your data, so the lookup key must
be **case-folded**: store every term under its lowercased path and fold each query
prefix the same way, so `APP`, `app`, and `App` all reach the same node. The catch
is that you still want to *show* `Apple`, not `apple` - the original capitalisation
is part of the suggestion. So each end node keeps a `display` string holding the
term exactly as it was added, and every place that produced a term by
reconstructing it from the path now emits `display` instead.

That one split - fold the key, preserve the display - runs through a few methods at
once: `Add` and `Record` fold the path but save the original, `find` folds its
argument so all lookups become case-insensitive, and the completion walk and the
node caches carry the display form. With distinct weights `App` (9), `Apple` (5),
`apply` (3) rank in that order for the prefix `APP`, each shown as stored. Real
term lists are full of mixed case, so this is what makes the engine usable on them.
