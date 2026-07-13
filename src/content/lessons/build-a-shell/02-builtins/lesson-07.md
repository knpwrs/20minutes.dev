---
project: build-a-shell
lesson: 7
title: The builtin table and exit
overview: Some commands have to run inside the shell itself, not in a child process. Today you add the dispatch that recognizes those builtins before forking, and implement the first one - exit.
goal: Check whether the first word names a builtin and, if so, run it in the shell; make `exit` end the shell with a given status.
spec:
  scenario: Dispatching a builtin instead of forking
  status: failing
  lines:
    - kw: Given
      text: 'the line "exit 3"'
    - kw: When
      text: the shell processes it
    - kw: Then
      text: the shell itself terminates with status 3
    - kw: And
      text: 'a bare "exit" terminates the shell with status 0'
code:
  lang: c
  source: |
    // look up argv[0] BEFORE forking
    if (strcmp(words[0], "exit") == 0) {
        int code = (n > 1) ? atoi(words[1]) : 0;
        exit(code);
    }
    // ...otherwise fall through to fork/exec as before
checkpoint: Your shell has a builtin dispatch and a working `exit` command. Commit and stop here.
---

Most commands run in a child process, but a few **cannot**: they need to change
the shell's own state. `exit` is the clearest example - a child process exiting
would not end your shell, so `exit` has to run in the shell process itself. These
in-process commands are called **builtins**, and the shell checks for them
*before* it forks.

Set up that check as a small dispatch keyed on the first word - today it has one
entry, `exit`, but you will add `cd`, `pwd`, and `type` over the next few lessons, so
give it room to grow (a table or a switch, not a one-off `if` you will regret).
`exit` reads an optional status argument (`exit 3` leaves with 3) and defaults to
`0`. Everything the dispatch does not recognize falls through to the fork/exec
path you already built.
