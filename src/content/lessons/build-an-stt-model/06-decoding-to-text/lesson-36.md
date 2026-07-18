---
project: build-an-stt-model
lesson: 36
title: Greedy CTC decode
overview: Turning a per-frame symbol stream into text needs both collapsing and blank removal - and doing them in the wrong order silently loses letters. Today you build the correct order, and see the wrong one fail.
goal: Decode lesson 34's raw sequence into text by collapsing repeats first and removing blanks second, and confirm that reversing the two steps silently loses a letter.
spec:
  scenario: Decoding by collapsing before removing, and seeing why the order matters
  status: failing
  lines:
    - kw: Given
      text: 'lesson 34''s 6-frame raw sequence A, A, -, A, A, B, lesson 35''s collapse-repeats step, and a separate remove-blanks step that simply drops every blank symbol from a sequence'
    - kw: When
      text: 'the sequence is decoded by collapsing repeats first and then removing blanks'
    - kw: Then
      text: 'collapsing gives A, -, A, B, and removing its one blank gives A, A, B - the text "AAB", with both letters recovered'
    - kw: When
      text: 'instead the same raw sequence is decoded in the opposite order - blanks removed first, then repeats collapsed'
    - kw: Then
      text: 'removing blanks first gives A, A, A, A, B, and collapsing that run of four identical A frames into one gives A, B - the text "AB", silently missing a letter'
    - kw: And
      text: 'both orders start from the identical raw sequence, so the missing A is not a bug in either step alone - it is the blank''s separating information being discarded before collapsing had a chance to use it'
code:
  lang: go
  source: |
    // PINNED order: collapse first, then remove - swapping is the bug
    func RemoveBlanks(seq []string) []string { return nil } // drop every Blank
    func GreedyCTCDecode(seq []string) []string {
      return RemoveBlanks(CollapseRepeats(seq))
    }
    func WrongOrderDecode(seq []string) []string {
      return CollapseRepeats(RemoveBlanks(seq))
    }
checkpoint: You can decode a raw per-frame sequence into real text, and you have seen with your own two outputs why the order of these two steps is not a matter of taste - reversing it loses a letter. Commit and stop for today.
---

Collapsing and removing blanks are each one simple pass over a sequence, but doing them in the wrong order throws away information the correct order still has available. Collapse first, and the blank between the two pairs of `A` frames is still sitting there to keep them apart when it is finally dropped: `A, A, -, A, A, B` collapses to `A, -, A, B`, and only then does removing the blank leave `A, A, B` - the text `"AAB"`, both letters intact.

Reverse the two steps and the blank is destroyed before it gets to do its job. Removing it first turns `A, A, -, A, A, B` directly into `A, A, A, A, B` - four `A` frames now sitting in an unbroken run, with no record that they were ever two separate events. Collapsing that run afterwards has no way to tell it apart from a single letter that simply lasted four frames, so it merges down to one `A`, giving `"AB"`. Both computations start from exactly the same input; the missing letter is not a bug in collapsing or in removing blanks individually - it is what happens when the one piece of information that could have prevented it is thrown away first.
