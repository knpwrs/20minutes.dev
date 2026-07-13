---
project: build-a-text-editor
lesson: 13
title: Moving by words
overview: Hopping a word at a time is what makes navigation fast. Today you add word-wise motion that skips to the start of the next word and back to the start of the previous one.
goal: Move the cursor to the next word's start and the previous word's start along a line.
spec:
  scenario: Word-wise horizontal motion
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "foo bar baz" with the cursor at Col 0'
    - kw: When
      text: MoveWordRight and MoveWordLeft are called
    - kw: Then
      text: 'MoveWordRight gives Col 4 (start of "bar"), then Col 8 (start of "baz"), then Col 11 (the line end, no next word)'
    - kw: And
      text: 'from Col 8, MoveWordLeft gives Col 4, then Col 0, and stays at Col 0'
code:
  lang: go
  source: |
    // a "word char" is a letter or digit; anything else separates words.
    // MoveWordRight: skip the current run of word chars, then skip the
    // separators, landing on the next word's first char (or the line end).
    // MoveWordLeft is the mirror: skip separators left, then skip word chars.
    func isWord(c byte) bool { /* letter or digit */ }
checkpoint: The cursor can jump word by word along a line. Commit and stop here.
---

Word motion turns navigation from a crawl into a hop. The rule is defined by what
counts as a **word character** - here a letter or digit - with everything else
(spaces, punctuation) acting as a separator. `MoveWordRight` skips the rest of the
word you are in, then skips the separators after it, and lands on the first
character of the next word. `MoveWordLeft` does the reverse: skip separators to the
left, then skip the word behind them, stopping at that word's start.

The edges are where this earns its test. Moving right off the last word has no next
word to find, so it clamps at the **line end** rather than running past it; moving
left from the first word stops at column `0`. Keeping the motion within a single
line for now keeps the rule crisp - one line, one scan, clear word boundaries - and
matches how `MoveLeft` and `MoveRight` stayed on their line too. The behavior is
the familiar Ctrl-arrow jump, built from one clear definition of where a word
begins.
