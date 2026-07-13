---
project: build-a-spell-checker
lesson: 31
title: The fast corrector
overview: Wire the index into correction and you have a corrector that is both fast and provably unchanged. Today you build CorrectFast on the indexed candidates and confirm it returns exactly what the generator-based Correct did.
goal: Return the best correction using index-sourced candidates, matching the original Correct for every word.
spec:
  scenario: Fast correction, identical results
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary with counts the:1000, ten:100, tea:50, spelling:200, indexed into a BK-tree'
    - kw: When
      text: 'CorrectFast is called'
    - kw: Then
      text: 'CorrectFast("teh") is "the" and CorrectFast("speling") is "spelling"'
    - kw: And
      text: 'CorrectFast(word) equals Correct(word) for every word tested, including "the" (already correct) and "xyzzy" (no correction)'
code:
  lang: go
  source: |
    func (d *Dictionary) CorrectFast(word string) string {
      // same ranking as Correct, but candidates come from the index:
      //   return BestByFreq(IndexCandidates(word))
    }
checkpoint: The corrector runs on the pruned index while returning identical results. Commit and stop here.
---

`CorrectFast` is `Correct` with its engine replaced: it ranks the **index-sourced**
candidates by frequency instead of the generated ones. `teh` still corrects to
`the`, `speling` still to `spelling`, and crucially `CorrectFast(word)` equals
`Correct(word)` for every word - the same tiers ranked the same way must yield the
same answer. What changed is entirely under the hood: the candidates now come from a
pruned tree walk rather than tens of thousands of generated strings.

This is the satisfying end of the performance story. You built a correct-but-slow
corrector, proved a fast index equivalent to its oracle, and swapped it in without
altering a single result. A learner can keep either path - the generator is simpler
to explain, the index is what you would ship - and trust they agree. The last lesson
of the chapter runs the fast corrector across a whole passage.
