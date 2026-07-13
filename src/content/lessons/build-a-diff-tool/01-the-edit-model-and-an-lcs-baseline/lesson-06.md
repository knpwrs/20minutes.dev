---
project: build-a-diff-tool
lesson: 6
title: Printing an edit script
overview: An edit script you cannot see is hard to trust. Today you render one as text - a Keep line prefixed with a space, a Delete with a minus, an Insert with a plus - the same prefixes real diffs use, giving you a readable payoff at the end of the first chapter.
goal: Render an edit script as prefixed lines, one per operation.
spec:
  scenario: An edit script renders as prefixed lines
  status: failing
  lines:
    - kw: Given
      text: 'the edit script for ["a", "b", "c"] against ["a", "x", "c"]'
    - kw: When
      text: 'Format renders it, joining the lines with newlines and ending with a trailing newline'
    - kw: Then
      text: 'the four rendered lines are " a", "-b", "+x", " c" (Keep gets a leading space, Delete a leading "-", Insert a leading "+")'
    - kw: And
      text: 'the full returned string is " a\n-b\n+x\n c\n"'
    - kw: And
      text: 'Format of an empty script is the empty string, and Format of the diff of [] against ["x", "y"] is "+x\n+y\n"'
code:
  lang: go
  source: |
    func Format(ops []Op) string {
      var sb strings.Builder
      for _, op := range ops {
        switch op.Kind {
        case Keep:
          sb.WriteByte(' ')
        case Delete:
          sb.WriteByte('-')
        case Insert:
          sb.WriteByte('+')
        }
        sb.WriteString(op.Line)
        sb.WriteByte('\n')
      }
      return sb.String()
    }
checkpoint: You can diff two documents and print the result as a readable script. Commit and stop here.
---

Every diff format is, at heart, the edit script with a one-character prefix on each line telling you what happened to it: a space for a line that stayed, a `-` for a line that left, a `+` for a line that arrived. This simple renderer is not yet the unified diff format - there are no hunk headers or context grouping - but it is the same prefix convention, and it lets you *see* the script your `Diff` produces. Diff two short documents and eyeball the result: the shared lines carry a space, the change shows as a `-` line immediately followed by a `+` line.

This closes the first chapter with something demoable: a complete, correct line diff, from raw text through `Lines`, `Diff`, and `Format`. It is quadratic and its output is bare, but every value is exact and every piece is honest. The rest of the project replaces the engine underneath with Myers' algorithm and dresses the output up into the real unified diff format - but the `[]Op` edit script in the middle, and this way of reading it, stays the same.
