---
project: build-a-diff-tool
lesson: 16
title: Making Diff use Myers
overview: With the Myers engine complete and trusted, the public Diff swaps its quadratic baseline for it. The library's front door now runs the fast algorithm, and every earlier behaviour stays exactly the same.
goal: Route the public Diff through the Myers engine while keeping all pinned behaviours identical.
spec:
  scenario: Diff runs on Myers with unchanged results
  status: failing
  lines:
    - kw: Given
      text: 'Diff reimplemented to call the Myers path (trace, backtrack, classify)'
    - kw: When
      text: 'it is called on the earlier examples'
    - kw: Then
      text: 'identical inputs still give all Keeps, empty-side inputs still give all Deletes or all Inserts, and ["a", "b", "c"] against ["a", "x", "c"] still gives Keep "a", Delete "b", Insert "x", Keep "c"'
    - kw: And
      text: 'for any pair, the number of Delete plus Insert operations in Diff(a, b) equals EditDistance(a, b)'
code:
  lang: go
  source: |
    func Diff(a, b []string) []Op {
      trace, d := shortestEditTrace(a, b)
      steps := backtrack(a, b, trace, d)
      return classify(a, b, steps)
    }
    // the old LCS version can stay as lcsDiff for cross-checking in tests
checkpoint: The public Diff is Myers-backed and behaves exactly as before. Commit and stop here.
---

This is the payoff of building two engines: because you proved they agree, you can replace the clear-but-slow baseline with the fast one behind the same `Diff` signature and nothing downstream notices. Every value the earlier lessons pinned still holds - the empty-side scripts, the identical-input all-keeps, the single-line change - because they were chosen to be the cases where any minimal diff is unique, so both engines land on the same answer. Keep the old LCS version around under a different name; it makes an excellent cross-check in your tests.

The tie between the two engines is worth asserting directly: the count of `Delete` and `Insert` operations in a script is precisely the edit distance `D`, since each of those operations is one edit and each `Keep` is free. That invariant will hold through the rest of the project no matter how the output is dressed up. From here on, "the diff" means this Myers-backed `[]Op`, and the remaining chapters format it and apply it - the algorithm work is done.
