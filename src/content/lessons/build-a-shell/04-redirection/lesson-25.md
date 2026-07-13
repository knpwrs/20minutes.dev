---
project: build-a-shell
lesson: 25
title: Duplicating a descriptor
overview: The classic `2>&1` sends errors to wherever output is going. Today you add fd-to-fd redirection and discover why the order of redirections on the line matters.
goal: Implement `2>&1` so standard error is redirected to the current destination of standard output, applying redirections left to right.
spec:
  scenario: Merging stderr into stdout
  status: failing
  lines:
    - kw: Given
      text: 'the line: sh -c ''echo O; echo E >&2'' > both.txt 2>&1'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'both.txt contains both "O" and "E" (stdout and stderr merged into the file)'
    - kw: And
      text: 'the shell''s output stays empty, because "> both.txt" was applied before "2>&1"'
code:
  lang: c
  source: |
    // 2>&1 means: make fd 2 a copy of whatever fd 1 currently is
    dup2(1, 2);            // NOT open a file - duplicate an existing fd
    // apply redirections in the order they appear so '> file' happens first
checkpoint: '`2>&1` merges error into output. Commit and stop here.'
---

`2>&1` is redirection between two descriptors: the `&1` means "descriptor 1," so
`2>&1` says **make standard error go wherever standard output currently goes**.
Instead of opening a file, you `dup2` one existing descriptor onto another. It is
how you capture a command's complete output - results and errors interleaved - in
one place.

The subtlety that trips everyone is **order**. Redirections apply left to right,
and `2>&1` copies fd 1 *as it is at that moment*. So `> file 2>&1` first sends
stdout to the file, then points stderr at the same file - both captured. Reverse
it to `2>&1 > file` and stderr is copied to the terminal (where stdout still is)
*before* stdout moves to the file, so errors go to the screen and only normal
output reaches the file. Same two operators, opposite result - which is why you
must apply them in the exact order they were written.
