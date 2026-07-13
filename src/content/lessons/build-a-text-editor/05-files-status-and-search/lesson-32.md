---
project: build-a-text-editor
lesson: 32
title: Replacing the match
overview: Find is most useful paired with replace. Today you swap the current match for new text, turning search into find-and-replace and closing the chapter on a real editing power tool.
goal: Replace the current search match with new text, moving the cursor past the replacement, and do nothing when there is no match.
spec:
  scenario: Replacing the found match
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "foo bar" after FindNext("bar") has set the current match at Row 0, Col 4'
    - kw: When
      text: 'ReplaceMatch("baz") is called'
    - kw: Then
      text: 'Text() is "foo baz", the cursor is at Row 0, Col 7 (just past the replacement), and the buffer is dirty'
    - kw: And
      text: 'with no current match (a fresh editor that has not found anything), ReplaceMatch("x") returns false and changes nothing'
code:
  lang: go
  source: |
    func (e *Editor) ReplaceMatch(repl string) bool {
      if e.matchLen == 0 { return false }        // nothing found to replace
      off := e.Buf.LineStart(e.matchRow) + e.matchCol
      e.Buf.Delete(off, e.matchLen)              // remove the old match
      e.Buf.Insert(off, repl)                    // drop the new text in
      e.Row, e.Col = e.Buf.PositionAt(off + len(repl))
      e.matchLen = 0; e.Dirty = true             // consume the match
      return true
    }
checkpoint: The editor can find and replace a match - chapter five is complete. Commit and stop here.
---

**Replace** is what turns search from navigation into editing. The match you just
found already carries everything a replacement needs - its position and its length -
so replacing it is: delete that span, insert the new text where it stood, and move
the cursor to the end of what you inserted. Because the replacement can be a
different length than the match, letting the cursor land past the inserted text keeps
it sensibly placed whether the word grew or shrank.

Two details make it robust. With **no current match** - nothing has been found yet,
or the match was cleared by an edit - there is nothing to replace, so it returns
`false` and leaves the buffer alone. And replacing **consumes** the match: it is an
edit, so it sets the dirty flag and clears the highlight, exactly the invalidation
rule from last lesson (you cannot re-replace a span you just changed). With find,
find-again in both directions, wrap-around, highlighting, and replace, the editor has
the search toolkit real ones ship. All that is left is the memory that lets you take
any of it back: undo.
