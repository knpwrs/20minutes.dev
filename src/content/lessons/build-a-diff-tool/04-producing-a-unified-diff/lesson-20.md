---
project: build-a-diff-tool
lesson: 20
title: Rendering a hunk
overview: Now assemble a whole hunk as text - the @@ header with both ranges, then the body lines with their space, minus, and plus prefixes. This is the unified diff format, one hunk at a time.
goal: Render a hunk as its @@ header line followed by its prefixed body lines.
spec:
  scenario: A single-change hunk renders in unified format
  status: failing
  lines:
    - kw: Given
      text: 'the hunk from diffing ["line1","line2","line3","line4","line5"] against the same list with "line3" changed to "CHANGED", context 3'
    - kw: When
      text: 'the hunk is rendered'
    - kw: Then
      text: 'the header line is "@@ -1,5 +1,5 @@" (old length 5 counts Keep and Delete lines, new length 5 counts Keep and Insert lines)'
    - kw: And
      text: 'the body is the six lines " line1", " line2", "-line3", "+CHANGED", " line4", " line5", each ending in a newline'
code:
  lang: go
  source: |
    oldLen, newLen := 0, 0
    for _, op := range h.Ops {
      if op.Kind != Insert { oldLen++ } // Keep or Delete
      if op.Kind != Delete { newLen++ } // Keep or Insert
    }
    header := "@@ -" + formatRange(h.OldStart, oldLen) +
              " +" + formatRange(h.NewStart, newLen) + " @@\n"
    // then Format(h.Ops) for the body, reusing the space/-/+ prefixes
checkpoint: You can render one hunk in the unified diff format. Commit and stop here.
---

A hunk header states, in one line, exactly what the hunk spans: `@@ -oldStart,oldLen +newStart,newLen @@`. The old length counts every line present in the old file - the **Keeps and Deletes** - and the new length counts every line present in the new file - the **Keeps and Inserts**. The starts are the 1-based line numbers where the hunk begins on each side, which the grouping already recorded. Feed each start and length through `formatRange` and you have the header.

The body is exactly the prefixed rendering you built at the end of chapter one: a space for kept lines, a minus for deleted, a plus for inserted, in edit-script order (deletes before their paired inserts). So a hunk is its header plus `Format(ops)` for its operations. Notice the old and new lengths differ from the number of body lines whenever a line changes - here five old and five new lines are shown across six body lines, because the changed line appears once as `-` and once as `+`. Next you wrap one or more hunks with the file header to produce a complete unified diff.
