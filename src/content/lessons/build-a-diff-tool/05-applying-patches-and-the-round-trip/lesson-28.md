---
project: build-a-diff-tool
lesson: 28
title: 'Capstone: diff, patch, round-trip'
overview: The finale runs the whole pipeline on two real documents - diff them into a unified patch, then apply that patch back and get the target exactly. Every layer you built, from Myers to the applier, proves itself at once.
goal: Diff two real documents into a unified patch, apply it back, and confirm the round-trip reproduces the target.
spec:
  scenario: A full diff-and-apply round-trip on real documents
  status: failing
  lines:
    - kw: Given
      text: 'old text "Title\nalpha\nBody\ngamma\nEnd\n" and new text "Title\nbeta\nBody\ndelta\nEnd\n", names "old.txt" and "new.txt", context 3'
    - kw: When
      text: 'UnifiedDiff produces the patch and Apply replays it on the old document'
    - kw: Then
      text: 'the edit distance is 4, and the patch is exactly "--- a/old.txt", "+++ b/new.txt", "@@ -1,5 +1,5 @@", " Title", "-alpha", "+beta", " Body", "-gamma", "+delta", " End"'
    - kw: And
      text: 'Apply(Lines(oldText), Parse(patch)) equals Lines(newText) - the round-trip reproduces the target exactly'
code:
  lang: go
  source: |
    patch := UnifiedDiff("old.txt", "new.txt", oldText, newText, 3)
    got, err := Apply(Lines(oldText), Parse(patch))
    // err == nil; got equals Lines(newText)
    // and EditDistance(Lines(oldText), Lines(newText)) == 4
checkpoint: Your diff tool diffs two documents, emits a unified patch, and applies it back to reproduce the target. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real, working **diff tool**. The two documents differ on two lines a single kept line apart, so with three lines of context they land in one hunk, `@@ -1,5 +1,5 @@`, with the changed lines shown as paired `-`/`+` and the shared lines as context. That the edit distance is exactly 4 is Myers' greedy pass talking; that the hunk is shaped just so is the grouping and header math; that the `-` lines precede the `+` lines is the tie-break you chose in chapter one - every layer visible in a few lines of output.

Then the round-trip closes the loop: parse your own patch, apply it to the original, and get the target back byte for byte. `apply(a, diff(a, b)) == b` is the invariant that makes a diff format trustworthy, and you have built both halves of it from first principles - the edit graph and snakes, the V array and its trace, the backtrack into an edit script, the unified format with hunks and context, and a context-checking applier. From splitting text into lines to reconstructing a document from a patch, this is the same core that powers `git diff` and `patch`, minus the fuzzy matching and word-level refinements they layer on top. That is a real diff tool, and it is yours.
