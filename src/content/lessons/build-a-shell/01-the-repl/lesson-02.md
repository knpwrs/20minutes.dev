---
project: build-a-shell
lesson: 2
title: Split a line into words
overview: A command line is text, but a program needs an argument list. Today you write the tokenizer that turns one line into the array of words every command in the rest of the project is built from.
goal: Split a raw line on whitespace into an ordered list of words.
spec:
  scenario: A line splits into words on whitespace
  status: failing
  lines:
    - kw: Given
      text: 'the line "ls -la /"'
    - kw: When
      text: the line is split into words
    - kw: Then
      text: 'the result is the list ["ls", "-la", "/"]'
    - kw: And
      text: 'the line "a   b" (multiple spaces) splits into exactly ["a", "b"]'
code:
  lang: c
  source: |
    // walk the line, emit a word at each run of non-space
    char *tok = strtok(line, " \t");
    while (tok) {
        words[n++] = tok;
        tok = strtok(NULL, " \t");
    }
checkpoint: Your shell turns any line into a clean list of words. Commit and stop here.
---

The operating system does not run "a line of text" - it runs a program with an
**argument list**, a sequence of separate strings. So the first job after reading a
line is **tokenizing** it: breaking `ls -la /` into the three words `ls`, `-la`,
and `/`. The first word will name the command; the rest are its arguments.

Keep it as simple as the spec allows: a **word** is a run of non-whitespace
characters, and any run of spaces or tabs between words is just a separator - two
spaces do not make an empty word. Quoting, so that `"a b"` can be a single word
with a space in it, is real and important, but it comes later. Today's win is
turning flat text into the exact list shape the next few lessons will hand to the
operating system.
