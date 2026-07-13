---
project: build-a-qr-code-encoder
lesson: 26
title: Timing patterns
overview: 'Two dotted lines - one across, one down - run between the finders so a scanner can count off module positions. Today you draw the timing patterns.'
goal: 'Draw the alternating timing patterns along row 6 and column 6.'
spec:
  scenario: 'Alternating timing lines connect the finders'
  status: failing
  lines:
    - kw: Given
      text: 'row 6 and column 6 between the finder regions (positions 8 through 12 in Version 1)'
    - kw: When
      text: 'the timing modules are set, dark where the coordinate is even and light where it is odd'
    - kw: Then
      text: 'row 6 columns 8 through 12 are dark, light, dark, light, dark (1, 0, 1, 0, 1)'
    - kw: And
      text: 'column 6 rows 8 through 12 are the same pattern 1, 0, 1, 0, 1, so the lines start and end on a dark module'
code:
  lang: go
  source: |
    // Row 6 and column 6, only the cells between the separators.
    for i := 8; i <= 12; i++ {
      g.set(6, i, dark(i%2 == 0)) // dark on even coordinate
      g.set(i, 6, dark(i%2 == 0))
    }
checkpoint: 'The timing patterns connect the finders. Commit and stop here.'
---

Between the finder patterns run two **timing patterns**: a horizontal line along **row 6** and a vertical line down **column 6**, each an alternating dark-light-dark sequence. They act like a ruler - a scanner counts the alternations to work out exactly where each module column and row falls, which keeps it aligned even if the printed symbol is slightly distorted.

The rule is simply **dark on even coordinates, light on odd**. In Version 1 the free stretch runs from position 8 to 12 (the finders and separators own 0-7, and the far finder owns 13 onward), giving `1, 0, 1, 0, 1` - starting and ending dark, connecting the dark borders of the finders they run between. These are the last of the always-fixed patterns whose values never change. One special single module and the reserved format strip remain before data can flow.
