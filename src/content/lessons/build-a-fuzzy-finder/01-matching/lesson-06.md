---
project: build-a-fuzzy-finder
lesson: 6
title: Highlighting the match
overview: A finder that shows you why a line matched is far easier to trust. Today you turn match positions into a highlighted string and wire it into the filter output, closing the first chapter with a visible result.
goal: Render a candidate with its matched characters marked, given the candidate and its list of match positions.
spec:
  scenario: Marking matched characters
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "src/main.go" and the match positions [0, 4, 9]'
    - kw: When
      text: highlight is called
    - kw: Then
      text: 'it returns "[s]rc/[m]ain.[g]o" - each matched character wrapped in square brackets, every other character unchanged'
    - kw: And
      text: 'an empty position list returns the candidate unchanged, and adjacent positions each get their own brackets'
code:
  lang: go
  source: |
    // Walk the candidate; when the index is in the position set, wrap it.
    // A set (map[int]bool) or a sorted-positions cursor both work.
    func highlight(candidate string, pos []int) string {
      inMatch := indexSet(pos)
      var b strings.Builder
      for i, ch := range candidate {
        if inMatch[i] { b.WriteString("[" + string(ch) + "]") } else {
          b.WriteRune(ch)
        }
      }
      return b.String()
    }
checkpoint: The filter can now show which characters matched. Commit and stop here.
---

Highlighting is the finder's feedback loop: it shows the user **why** a candidate matched, which characters the query landed on. With positions already in hand from the last lesson, rendering is a straight walk over the candidate - wrap the characters whose index is in the match set, leave the rest alone. Using a simple `[x]` marker keeps this testable as an exact string; a real terminal build swaps the brackets for reverse-video or color later without changing the logic.

Wiring this into filter mode closes the loop for chapter one: pipe in a list, pass a query, and see each surviving line with its match lit up. The positions are still the **greedy** ones, so the brackets sit on the leftmost occurrence of each query character - occasionally not the prettiest choice. That is exactly the gap the scoring chapter opens next: once you can score an alignment, you can find the one that both reads best and highlights best.
