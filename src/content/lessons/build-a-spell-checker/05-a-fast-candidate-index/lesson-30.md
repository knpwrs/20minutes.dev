---
project: build-a-spell-checker
lesson: 30
title: Candidates from the index, by tier
overview: The candidate ladder wants the nearest tier of real words - and the index can produce it without generating a single edit. Today you turn a radius search into distance tiers and get the same candidates the generator did.
goal: Produce the nearest non-empty tier of candidates from the BK-tree, matching the generator's known1 or known2.
spec:
  scenario: Tiered candidates straight from the index
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary containing "the", "ten", "tea", "cat", indexed into a BK-tree'
    - kw: When
      text: 'IndexCandidates("teh") is called'
    - kw: Then
      text: 'it returns ["tea", "ten", "the"] - the distance-1 tier - identical to known1("teh")'
    - kw: And
      text: 'for the typo "korrekt" against a dictionary of "correct", IndexCandidates returns ["correct"] - the distance-2 tier, matching known2'
code:
  lang: go
  source: |
    func (d *Dictionary) IndexCandidates(word string) []string {
      // known word? -> [word]
      // else IndexNearby(word, 1); if non-empty, that is the tier
      // else IndexNearby(word, 2)
      // else [word]
    }
checkpoint: The candidate ladder now draws from the index instead of edit generation. Commit and stop here.
---

The candidate ladder from chapter four asked for the nearest tier of real words and
got them by *generating* edits. The index gives the same tiers directly: a radius-1
search is exactly the one-edit real words (`known1`), and a radius-2 search that adds
nothing new at radius 1 gives the two-edit tier (`known2`). `IndexCandidates("teh")`
returns `tea`, `ten`, `the` - the very list the generator produced, now found by
pruned tree lookups instead of hundreds of thousands of string edits.

This is the swap the whole chapter was building toward: same candidates, same tiers,
a completely different engine underneath. Because you proved `IndexNearby` equals
`Nearby`, and `known1`/`known2` also equal `Nearby`, all three agree by construction
- so replacing generation with the index cannot change a single suggestion. The next
lesson feeds these index-sourced candidates into `Correct` and confirms the
corrections are identical.
