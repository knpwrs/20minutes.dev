---
project: build-a-text-editor
lesson: 18
title: Delete forward
overview: The Delete key removes the character at the cursor rather than behind it - and at the end of a line, it pulls the next line up. Today you add forward deletion, backspace's mirror image.
goal: Delete the character at the cursor; at the end of a line, delete the newline so the next line joins this one.
spec:
  scenario: Forward delete within a line and across a line
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "abc" with the cursor at Row 0, Col 1'
    - kw: When
      text: DeleteForward is called
    - kw: Then
      text: 'Text() is "ac" and the cursor stays at Row 0, Col 1'
    - kw: And
      text: 'over "ab\ncd" at Row 0, Col 2 (end of the first line), DeleteForward gives Text() "abcd" with the cursor unchanged, and at the very end of the buffer it does nothing'
code:
  lang: go
  source: |
    func (e *Editor) DeleteForward() {
      if e.Col < e.Buf.LineLen(e.Row) {
        e.Buf.Delete(e.Offset(), 1)          // the char under the cursor
      } else if e.Row < e.Buf.LineCount()-1 {
        e.Buf.Delete(e.Offset(), 1)          // the newline ahead -> join
      } // at the buffer's end: nothing to delete
    }
checkpoint: Forward delete works within and across lines. Commit and stop here.
---

Forward delete is backspace reflected. Where backspace removes what is behind the
cursor, `DeleteForward` removes what is **at** it - the character the cursor sits on
- and the cursor does not move, because the text to its right simply slides left to
fill the gap. Inside a line that is a one-character delete at `Offset()`.

The line-boundary case flips too: at the **end** of a line the character "at" the
cursor is really the newline that separates this line from the next, so deleting it
joins the following line onto this one, again with the cursor staying put. And at
the very end of the buffer there is nothing ahead to delete, so it is a no-op.
Notice both edits reuse the exact same `Buf.Delete` and line-join behavior from
chapter one - backspace and forward delete differ only in which offset they target
and whether the cursor moves. With these two, plus typing and Enter, the editor can
make any change to the text.
