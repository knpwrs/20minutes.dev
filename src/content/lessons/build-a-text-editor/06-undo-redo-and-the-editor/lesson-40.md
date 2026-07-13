---
project: build-a-text-editor
lesson: 40
title: 'Capstone: a full editing session'
overview: The final lesson drives the whole editor from one scripted session - load a file, search, edit, undo and redo, save, and render - and pins the exact final buffer and frame. Every piece the project built runs at once.
goal: Replay a complete keystroke session and confirm the exact saved text and rendered frame.
spec:
  scenario: A full open-edit-search-save session
  status: failing
  lines:
    - kw: Given
      text: 'an editor that loads "hello world" from a reader (cursor at Row 0, Col 0)'
    - kw: When
      text: 'FindNext("world") moves to the match, the characters of "brave " are typed there, then one Undo, then one Redo, then Save to a writer'
    - kw: Then
      text: 'the cursor after FindNext is at Row 0, Col 6; after typing it is at Col 12; Undo returns "hello world" (cursor Col 6); Redo restores "hello brave world" (cursor Col 12)'
    - kw: And
      text: 'the writer receives exactly "hello brave world", and Render(2, 30) is "hello brave world\n~"'
code:
  lang: go
  source: |
    e.Load(strings.NewReader("hello world"))
    e.FindNext("world")                 // cursor -> (0, 6)
    for _, c := range "brave " { e.InsertChar(c) } // one coalesced group
    e.Undo()                            // back to "hello world"
    e.Redo()                            // forward to "hello brave world"
    var out strings.Builder; e.Save(&out)
    // assert out.String() and e.Render(2, 30)
checkpoint: Your editor loads, searches, edits, undoes, saves, and renders - exactly as designed. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a real text editor, driven
end to end the way you would actually use one. You **load** a file, **search** it to
jump straight to `world`, **type** `brave ` in front of it, change your mind and
**undo** the whole word in one step - because typing coalesced into a single history
entry - then **redo** it, and **save** the result. Every layer is in play at once:
the piece table splitting and trimming under the inserts, the offset translation
placing each edit, search converting a match back into a cursor, coalesced undo
carrying the cursor with it, and the viewport rendering the final frame with a tilde
for the empty line below the text.

From an empty buffer that only knew how to return its own text, you have built the
honest core of a terminal text editor: a piece-table buffer with exact edits, a
clamped and word-aware cursor, line-splitting and line-joining edits, a scrolling
tab-aware viewport, file load and save with a dirty flag and status line,
wrap-around search, and coalesced undo and redo - all as a pure, testable model
driven by keystrokes and rendered to a string. The finalize pass wraps this exact
model in a raw-mode terminal loop so you can open a real file and type into it, but
the editor itself - the part that is genuinely hard to get right - is done, and it is
yours.
