---
project: build-a-fuzzy-finder
lesson: 8
title: Reward consecutive matches
overview: A run of adjacent matched characters is a much stronger signal than the same characters scattered around. Today you add a bonus for consecutive matches so tight runs outscore loose ones.
goal: Add a bonus whenever a matched character is immediately adjacent to the previous matched character.
spec:
  scenario: Bonus for adjacency
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "abcd" and a +8 bonus whenever the gap between two consecutive matched characters is zero (they are adjacent)'
    - kw: When
      text: 'score is called with positions [0, 1], then with positions [0, 1, 2]'
    - kw: Then
      text: 'positions [0, 1] score 40 (16 + 16, plus an 8 adjacency bonus), and positions [0, 1, 2] score 64 (three matches at 16, plus two adjacency bonuses of 8)'
code:
  lang: go
  source: |
    // When gap == 0 the current match touches the previous one: add a
    // consecutive bonus on top of the base reward.
    const scoreConsecutive = 8
    // inside the k > 0 branch, after computing gap:
    if gap == 0 {
      s += scoreConsecutive
    }
checkpoint: Adjacent matched characters now score higher than scattered ones. Commit and stop here.
---

Humans read matches in **runs**. When you type `mai` and it lands on the contiguous `mai` inside `main.go`, that is a much better match than an `m`, an `a`, and an `i` sprinkled across the string, even though both are valid subsequences. The **consecutive bonus** encodes that intuition: whenever a matched character sits immediately after the previous matched character - a gap of exactly zero - it earns an extra **+8**.

This rides directly on the gap you already compute. A gap of zero means adjacency, so the same branch that would subtract nothing now also adds the bonus. Note how it compounds: three-in-a-row earns the bonus twice (between the first and second, and the second and third), so tight runs pull ahead fast. That compounding is what will later make a whole-word match dominate a scattered one in the rankings.
