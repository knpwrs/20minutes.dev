---
project: build-a-shell
lesson: 5
title: Empty input and command not found
overview: A shell has to handle the lines that are not real commands - a blank line, and a name that is not a program. Today you make both cases behave the way every real shell does instead of crashing.
goal: Do nothing on an empty line, and report a clear error with status 127 when the program does not exist.
spec:
  scenario: Blank lines and missing programs
  status: failing
  lines:
    - kw: Given
      text: an empty line (or a line of only spaces)
    - kw: When
      text: the shell processes it
    - kw: Then
      text: nothing runs and the last status is unchanged
    - kw: And
      text: 'the command "nosuchcmd" prints "nosuchcmd: command not found" to standard error and sets the last status to 127'
code:
  lang: c
  source: |
    if (n == 0) continue;              // no words -> next prompt
    // in the child, if exec fails because the file is missing:
    fprintf(stderr, "%s: command not found\n", words[0]);
    _exit(127);
checkpoint: Your shell shrugs off blank lines and reports unknown commands instead of dying. Commit and stop here.
---

Two everyday inputs are not valid commands, and a shell must not fall over on
either. The first is the **empty line**: you press Enter with nothing typed, or a
line is all whitespace. Tokenizing it yields zero words, so there is simply
nothing to run - loop back to the prompt and leave the last status untouched.

The second is a **name that is not a program**. When `exec` cannot find or run the
file, it fails, and the child - the only place that knows exec failed - prints
`command not found` and exits with the special status **127**. That number is a
convention every shell shares, so tools and scripts can recognize "no such
command" specifically. Reporting it correctly is what makes your shell feel solid
rather than brittle.
