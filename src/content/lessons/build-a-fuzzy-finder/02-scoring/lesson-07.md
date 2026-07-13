---
project: build-a-fuzzy-finder
lesson: 7
title: A score for a match
overview: Filtering tells you what matches; ranking needs to know how well. Today you give a match a numeric score - a reward per matched character and a small penalty for every character skipped between matches.
goal: Score a match given its positions, awarding a fixed amount per matched character and a penalty per skipped character between matches.
spec:
  scenario: Base score with a gap penalty
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "abcd" and the scoring rule +16 per matched character and -1 for each candidate character skipped between two consecutive matched characters'
    - kw: When
      text: 'score is called with positions [0, 2], then with positions [0, 3]'
    - kw: Then
      text: 'positions [0, 2] score 31 (16 + 16, minus 1 for the skipped index 1), and positions [0, 3] score 30 (16 + 16, minus 2 for skipping indices 1 and 2)'
code:
  lang: go
  source: |
    // Sum a fixed reward per matched char; subtract the size of each gap
    // BETWEEN matched chars (skipped = thisPos - prevPos - 1).
    const scoreMatch = 16
    func score(candidate string, pos []int) int {
      s, prev := 0, -1
      for k, p := range pos {
        s += scoreMatch
        if k > 0 {
          gap := p - prev - 1
          s -= gap
        }
        prev = p
      }
      return s
    }
checkpoint: A match now has a numeric score that prefers tighter matches. Commit and stop here.
---

A finder that only filters leaves the best matches buried among mediocre ones. **Scoring** fixes that: it turns a match into a number so the good matches can float to the top. The base model is deliberately simple - every matched character is worth a fixed **+16**, and every candidate character you have to **skip** between two matched characters costs **-1**. A tight match (few gaps) scores higher than a scattered one.

The only subtlety is what a "gap" is: the number of candidate characters strictly between two consecutive matched positions, which is `thisPos - prevPos - 1`. Positions `[0, 2]` skip one character (index 1); `[0, 3]` skip two. This per-character gap penalty is the seed of the whole model - the next lessons layer bonuses and one more penalty on top, but they all plug into this same left-to-right walk over the positions.
