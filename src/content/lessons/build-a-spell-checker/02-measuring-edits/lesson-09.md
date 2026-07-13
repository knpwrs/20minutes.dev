---
project: build-a-spell-checker
lesson: 9
title: Adjacent transposition
overview: The most common real typo is swapping two neighboring letters - "teh" for "the". Plain edit distance charges two edits for that; today you add transposition as a fourth operation so a swap costs one, matching how people actually mistype.
goal: Extend the distance so swapping two adjacent characters counts as a single edit.
spec:
  scenario: A swap of neighbors costs one edit
  status: failing
  lines:
    - kw: Given
      text: the distance function
    - kw: When
      text: it scores a pair whose only difference is two adjacent letters swapped
    - kw: Then
      text: 'Distance("teh", "the") is 1 and Distance("ab", "ba") is 1'
    - kw: And
      text: 'Distance("cat", "cat") is still 0 and Distance("kitten", "sitting") is still 3'
code:
  lang: go
  source: |
    // add ONE more candidate to the min, only when the last two
    // characters of each prefix are the swapped pair:
    //   if i>1 && j>1 && a[i-1]==b[j-2] && a[i-2]==b[j-1]:
    //       consider d[i-2][j-2] + 1
    // fold this option into the same min as the other three moves
checkpoint: A single adjacent swap now costs one edit, not two. Commit and stop here.
---

Look at real typing errors and one pattern dominates: **transposition**, two
neighboring letters swapped - `teh`, `recieve`, `adn`. Plain Levenshtein treats
`teh` to `the` as two substitutions (distance 2), which under-rates the single
finger-slip that actually happened. Charging a swap as **one** edit makes distance
match human error, so the right correction ranks first.

The change is one extra option in the same table. When the last two letters of the
two prefixes are exactly each other swapped, you may reach the current cell from
two rows and columns back, plus one - a transposition. Fold it into the same `min`
as insert, delete, and substitute. This is the **optimal string alignment**
variant of edit distance; it handles the swaps a spell checker meets constantly
while leaving every non-swap distance, like `kitten` to `sitting`, unchanged.
