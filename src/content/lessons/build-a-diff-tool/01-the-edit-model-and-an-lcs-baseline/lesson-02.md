---
project: build-a-diff-tool
lesson: 2
title: The edit operation
overview: A diff is a list of edit operations that turn one document into another - keep a line, delete a line, insert a line. Today you define that operation type and write the first, trivial diff - two identical documents need no edits at all, just keeps.
goal: Define an edit operation and make Diff return an all-keep script when the two inputs are identical.
spec:
  scenario: Diffing a document against itself keeps every line
  status: failing
  lines:
    - kw: Given
      text: 'two identical documents ["a", "b", "c"] and ["a", "b", "c"]'
    - kw: When
      text: 'Diff is called on them'
    - kw: Then
      text: 'it returns three operations, each a Keep: Keep "a", Keep "b", Keep "c"'
    - kw: And
      text: 'diffing two empty documents returns an empty edit script'
code:
  lang: go
  source: |
    type Kind int
    const (
      Keep Kind = iota
      Insert
      Delete
    )
    type Op struct {
      Kind Kind
      Line string
    }
    // for now, assume the inputs are identical
    func Diff(a, b []string) []Op {
      ops := make([]Op, 0, len(a))
      for _, line := range a {
        ops = append(ops, Op{Keep, line})
      }
      return ops
    }
checkpoint: You have an Op type and a Diff that handles identical inputs. Commit and stop here.
---

A diff is best understood as a **program that edits** one document into another. That program is a sequence of three kinds of operation: **Keep** a line that appears in both, **Delete** a line that is in the old document but not the new, and **Insert** a line that is in the new but not the old. Read the operations top to bottom and you walk from the old document to the new one. This `[]Op` edit script is the central value our whole library produces, formats, and applies.

Today's `Diff` only handles the easy case - two identical documents, where the answer is simply "keep everything." That is the walking skeleton: a real public `Diff` you can call and test right now, even though it is not yet correct for documents that actually differ. The next lessons make it handle deletions, then insertions, then arbitrary changes. Define `Op` with room for all three kinds now, even though we only emit `Keep` today.
