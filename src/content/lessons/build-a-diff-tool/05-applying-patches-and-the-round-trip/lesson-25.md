---
project: build-a-diff-tool
lesson: 25
title: Parsing a unified diff
overview: A patch is a file header plus a sequence of hunks, each a header and prefixed body lines. Today you parse the whole thing back into hunks of keep/delete/insert operations - the same Op list your diff produces.
goal: Parse a unified diff string into a list of hunks, each with its ranges and its operations.
spec:
  scenario: A unified diff parses back into hunks and operations
  status: failing
  lines:
    - kw: Given
      text: 'the unified diff text for ["line1".."line5"] against the same list with "line3" changed to "CHANGED"'
    - kw: When
      text: 'Parse reads it'
    - kw: Then
      text: 'it returns 1 hunk with old start 1 and new start 1, holding 6 operations'
    - kw: And
      text: 'those operations are Keep "line1", Keep "line2", Delete "line3", Insert "CHANGED", Keep "line4", Keep "line5" (from the " ", "-", and "+" prefixes)'
code:
  lang: go
  source: |
    for _, line := range strings.Split(patch, "\n") {
      switch {
      case strings.HasPrefix(line, "--- "), strings.HasPrefix(line, "+++ "):
        continue // file header
      case strings.HasPrefix(line, "@@"):
        // start a new hunk from parseHunkHeader(line)
      case strings.HasPrefix(line, "\\"):
        continue // "\ No newline at end of file" marker
      case strings.HasPrefix(line, " "):
        // Keep line[1:]
      case strings.HasPrefix(line, "-"):
        // Delete line[1:]
      case strings.HasPrefix(line, "+"):
        // Insert line[1:]
      }
    }
checkpoint: You can parse a full unified diff into hunks of operations. Commit and stop here.
---

Parsing a patch is a line-by-line classification, using the very prefixes you emit when writing one. The `---` and `+++` file-header lines are skipped, an `@@` line opens a new hunk (parsed by the previous lesson's helper), and the `\ No newline at end of file` marker is skipped for now since it carries no operation. Every other line is a body line whose first character - space, minus, or plus - tells you whether it is a `Keep`, `Delete`, or `Insert`, with the rest of the line being the content. The result is a hunk holding the same `[]Op` your `Diff` produces, which is exactly what makes applying it straightforward.

Notice the symmetry: writing a diff turned operations into prefixed lines, and reading it turns prefixed lines back into operations. The unified format is really just a serialization of the edit script with enough location metadata (the `@@` ranges) to apply it to a file that may have shifted. With a parsed patch in hand, the applier can walk the original document and the hunk together, and the round-trip is one lesson away.
