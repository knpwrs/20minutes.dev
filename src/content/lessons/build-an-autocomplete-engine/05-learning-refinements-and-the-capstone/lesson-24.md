---
project: build-an-autocomplete-engine
lesson: 24
title: Tolerating a single typo
overview: A small, optional refinement - when a prefix matches nothing, one mistyped character should not leave the user with no suggestions. Today you add a fallback that tries every single-character substitution of the prefix.
goal: When an exact prefix has no matches, return completions of prefixes that differ by exactly one substituted character.
spec:
  scenario: One substitution rescues a mistyped prefix
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cat", 5), Add("cot", 1), Add("cut", 4), Add("dog", 2)'
    - kw: When
      text: 'FuzzySuggest("cit", 3) is called and cit matches no stored prefix'
    - kw: Then
      text: 'it substitutes one character to reach cat, cot, and cut, and returns their completions ranked: ["cat", "cut", "cot"]'
    - kw: And
      text: 'FuzzySuggest("ca", 3) - an exact prefix that does match - returns Suggest("ca", 3) = ["cat"] with no fuzzing'
code:
  lang: go
  source: |
    func (t *Trie) FuzzySuggest(prefix string, k int) []string {
      if t.HasPrefix(prefix) { // exact first: no typo tolerance needed
        return t.Suggest(prefix, k)
      }
      // Walk the trie matching prefix runes, spending ONE substitution:
      // at each position, follow the exact child (free) or any other child
      // (costs the single edit). Collect the reached length-len(prefix) nodes,
      // union their completions, rank by the same order, take k.
      // Deletions/insertions/multiple edits are left as an extension.
      ...
    }
checkpoint: A single mistyped character still yields sensible suggestions; exact prefixes are unaffected. Commit and stop here.
---

This is a deliberately **small** extension, not the theme of the engine: real typo
tolerance is a whole field (edit distance, symmetric deletes, and more), but a
lot of value comes from handling the single most common case - one wrong
character. `FuzzySuggest` tries the exact prefix first and, only if that matches
nothing, walks the trie spending exactly **one substitution**: at each position it
may follow the matching child for free or step into a different child at the cost
of its single edit. `cit` matches nothing, but substituting the middle character
reaches `cat`, `cot`, and `cut`, whose completions are then merged and ranked.

Keeping the fuzzy path behind an exact-match check matters: when the prefix is
real, you return the precise, cheap answer and never pay for fuzzing - only a
genuine miss triggers the fallback. This handles substitutions of the same length
only; deletions, insertions, and multi-character typos are exactly the kind of
extension the caveats point to, and edit-distance search is a different tool for a
different job.
