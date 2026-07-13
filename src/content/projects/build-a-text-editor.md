---
title: 'Build a Text Editor'
order: 17
lessons: 40
size: 'Medium'
tech: ['Piece tables', 'Text buffers', 'Undo/redo']
estMin: 20
desc: 'Build a terminal text editor on a piece table: cursor, viewport, search, and undo/redo.'
blurb: 'Start with an empty piece-table buffer that returns its text and end with a runnable editor that opens a file, moves and edits by keystroke, searches, saves, and undoes - all built on a real buffer technique, not an array of strings. Every lesson is one concrete spec with exact buffer, cursor, and frame values: split a piece on insert, join two lines on backspace, keep the cursor visible as you scroll, wrap a search past the last match, and undo a whole typed word in one step.'
overview: |
  Over 40 lessons you build a working terminal text editor from scratch, on a real buffer technique rather than an array of strings. The core is a piece table: an immutable original buffer, an append-only add buffer, and a list of pieces that point into them, so every insert is a piece split and every delete is a piece trim - edits stay exact and cheap, and the same structure gives you undo for free. On top of the buffer you build a cursor model (row and column, clamped movement, word motions, and jumps to the document ends), editing operations expressed as buffer edits (insert a character, split a line on Enter, join lines on backspace and delete), a scrolling viewport that renders the visible screen as a frame string with tab expansion and a mapped on-screen cursor, file load and save with a dirty flag and a status line, incremental search that finds the next and previous match, wraps around, and replaces a match, and undo/redo built on the piece-table history with consecutive typing coalesced into a single step.

  The editor state and its operations are modeled as a pure, testable core: the screen is a rendered frame string for a given size and the input is a fed keystroke sequence, so the whole editor is exercised deterministically without a real terminal. The capstone replays a full keystroke script - open a file, move around, edit, search, save - and asserts the exact final buffer and a rendered frame. The finalize pass then wraps this core in a real raw-mode terminal loop that reads keys and draws the screen, reusing the model unchanged and failing gracefully when it is not run on a terminal.

  This is a teaching-grade editor built around the genuine piece-table design that editors like VS Code use: correct, cursor-accurate, and genuinely usable on a real file, but deliberately stopping short of what a production editor layers on top - syntax highlighting, multiple buffers and windows, Unicode grapheme handling, selections and clipboard, and configurable keybindings. What you finish with is the honest core all of those are built around.
parts:
  - name: 'The piece-table buffer'
    count: 8
  - name: 'The cursor'
    count: 6
  - name: 'Editing at the cursor'
    count: 5
  - name: 'The viewport'
    count: 5
  - name: 'Files, status, and search'
    count: 8
  - name: 'Undo, redo, and the editor'
    count: 8
caveats:
  note: 'A real, usable terminal text editor built entirely on the piece-table model the lessons construct - it opens a file (or an empty buffer), takes keystrokes through a raw-mode loop, moves and edits with a clamped cursor, scrolls a tab-aware viewport, searches with wrap-around, saves with a dirty-flag guard, and undoes and redoes with coalesced typing, failing gracefully when it is not run on a terminal; a few edges are deliberately left thin - replace is not yet undoable, there is no live resize repaint, and word-wise and go-to-line motions are built into the model but not bound to keys.'
  future:
    - 'Make replace undoable by having it record an undo snapshot like every other edit, then bind a find-and-replace prompt to a key'
    - 'Repaint on terminal resize (handle SIGWINCH) so the frame reflows immediately instead of on the next keystroke'
    - 'Bind the word-wise and go-to-line motions the model already has to Ctrl-arrow and a go-to-line prompt'
    - 'Make saving atomic (write to a temp file then rename) and add a Save As prompt for a buffer with no file name yet'
    - 'Reassemble UTF-8 runes in the key decoder and the buffer so non-ASCII text edits and renders correctly'
    - 'Add syntax highlighting and multiple buffers or windows, the next layers a production editor builds on this core'
resources:
  - title: 'Build Your Own Text Editor (kilo walkthrough)'
    author: 'Paige Ruten / Salvatore Sanfilippo'
    url: 'https://viewsourcecode.org/snaptoken/kilo/'
    note: 'A step-by-step booklet that builds antirez''s kilo editor in C - raw mode, the refresh loop, and keypress handling. The clearest guide to the terminal layer this project defers to its finalize pass.'
  - title: 'kilo'
    author: 'Salvatore Sanfilippo (antirez)'
    url: 'https://github.com/antirez/kilo'
    note: 'A complete text editor in about 1000 lines of C, no dependencies. The reference for how small a genuinely usable editor can be.'
  - title: 'The Craft of Text Editing (Emacs internals)'
    author: 'Craig A. Finseth'
    url: 'https://www.finseth.com/craft/'
    note: 'The book on editor internals: buffer representations (gap buffers, linked lines, piece tables), the redisplay problem, and command dispatch - the theory behind every chapter here.'
  - title: 'Text Buffer Reimplementation (the piece tree)'
    author: 'Peng Lyu (VS Code team)'
    url: 'https://code.visualstudio.com/blogs/2018/03/23/text-buffer-reimplementation'
    note: 'How VS Code replaced its line-array buffer with a piece table (a balanced piece tree) for speed and memory - the modern production case for the structure this project builds.'
  - title: 'Data Structures for Text Sequences'
    author: 'Charles Crowley'
    url: 'https://www.cs.unm.edu/~crowley/papers/sds.pdf'
    note: 'The survey that compares the array, gap buffer, linked list, piece table, and rope for an editor buffer - why the piece table is a strong default and where each alternative wins.'
  - title: 'The Piece Table'
    author: 'Darren Burns'
    url: 'https://darrenburns.net/posts/piece-table/'
    note: 'A short, well-illustrated walkthrough of the piece-table structure - original and add buffers and the piece list - and how insert and delete split pieces, exactly the model chapter one builds.'
---
