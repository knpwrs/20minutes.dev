---
project: build-a-text-editor
lesson: 15
title: Typing a character
overview: Now the editor earns its name - you type. Today you insert a character at the cursor and advance the cursor past it, the operation behind every keystroke that adds text.
goal: Insert a character at the cursor's offset and move the cursor one column to the right.
spec:
  scenario: Inserting a character at the cursor
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "ac" with the cursor at Row 0, Col 1'
    - kw: When
      text: "InsertChar('b') is called"
    - kw: Then
      text: 'Text() is "abc" and the cursor is at Row 0, Col 2'
    - kw: And
      text: "starting from an empty buffer at (0,0), InsertChar('h') then InsertChar('i') gives Text() \"hi\" with the cursor at Col 2"
code:
  lang: go
  source: |
    func (e *Editor) InsertChar(c byte) {
      e.Buf.Insert(e.Offset(), string(c)) // insert at the cursor
      e.Col++                             // step past what you typed
    }
checkpoint: You can type characters into the buffer. Commit and stop here.
---

This is the operation the whole editor exists for: put a character where the cursor
is and move the cursor past it. It is built entirely from pieces you already have -
`Offset()` turns the cursor's `(row, col)` into the buffer position, `Buf.Insert`
splits a piece to drop the character in, and advancing `Col` by one leaves the
cursor sitting just after what you typed, ready for the next keystroke.

That the cursor **advances** is what makes typing feel right - characters flow left
to right as you enter them, each new one appearing at the cursor and pushing it
along. Because the buffer's insert is exact and the offset translation is exact,
typing `h` then `i` into an empty buffer yields precisely `"hi"` with the cursor at
column `2`. Every key you press for the rest of the project routes through some
variation of this: locate the offset, change the buffer, move the cursor.
