---
project: build-a-spell-checker
lesson: 32
title: Correcting a document, fast
overview: Close the chapter by running the indexed corrector over a whole passage. Today you build CorrectionsFast and confirm it produces the same report as the slow path, now cheap enough for real text.
goal: Correct every unknown word in a passage using the index, matching the earlier Corrections output.
spec:
  scenario: Fast document correction
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary with counts the:1000, cat:500, sat:100, indexed into a BK-tree'
    - kw: When
      text: 'CorrectionsFast("teh cat sat") is called'
    - kw: Then
      text: 'it returns one entry: "teh" at start 0, corrected to "the"'
    - kw: And
      text: 'its output is identical to Corrections("teh cat sat") from the generator-based path'
code:
  lang: go
  source: |
    func (d *Dictionary) CorrectionsFast(text string) []Correction {
      // like Corrections, but call CorrectFast on each unknown token
    }
checkpoint: The whole corrector now runs on the fast index over real passages. Commit and stop here.
---

The document corrector, now on the index: `CorrectionsFast` walks the unknown tokens
of a passage and corrects each with `CorrectFast`. Its output matches the slow
`Corrections` byte for byte, because every piece underneath was proven equivalent -
but it is now fast enough to run over pages of prose without the two-edit generator's
explosion of strings.

That completes the performance arc of the project. From here on, the checker is fast
and correct, and the remaining chapter is about the **product**: turning
corrections into a real tool with top-N suggestions, original-case output, line and
column reporting, a readable report format, and a personal ignore list. The engine
is done; the polish begins.
