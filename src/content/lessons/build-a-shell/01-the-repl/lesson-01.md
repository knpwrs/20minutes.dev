---
project: build-a-shell
lesson: 1
title: The prompt and the read loop
overview: Every shell is a loop - print a prompt, read a line, act on it, repeat. Today you build that loop and the way it ends, which is the skeleton every later lesson hangs code on.
goal: Print a prompt, read one line of input at a time, and stop cleanly at end of input.
spec:
  scenario: The read loop consumes lines until EOF
  status: failing
  lines:
    - kw: Given
      text: 'input consisting of "one\ntwo\n" followed by end-of-input'
    - kw: When
      text: the shell runs its read loop
    - kw: Then
      text: 'it yields the line "one", then the line "two" (newline stripped)'
    - kw: And
      text: at end-of-input the loop stops and the shell exits with status 0
code:
  lang: c
  source: |
    // print a prompt, read a line, repeat until EOF
    for (;;) {
        printf("$ ");
        if (!read_line(&line)) break;   // EOF -> stop
        // (nothing to do with the line yet)
    }
checkpoint: You have a running shell that prompts and reads lines until you press Ctrl-D. Commit and stop here.
---

A shell is a **read-eval-print loop**: it prints a **prompt**, reads a line you
type, does what the line says, and loops back for the next one. Today only the
"read" and "loop" halves exist - there is nothing to evaluate yet - but this loop
is the spine of the whole project, so it is worth getting the shape right.

The one subtlety is how the loop **ends**. When input runs out - the user presses
`Ctrl-D` at the terminal, or a script file reaches its last line - the read
returns an end-of-input signal rather than a line. That is your cue to leave the
loop and exit `0`. Strip the trailing newline from each line as you read it; every
later lesson assumes the line it receives has no `\n` on the end.
