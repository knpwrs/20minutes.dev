---
project: build-a-shell
lesson: 11
title: type
overview: How does the shell decide what a name means - a builtin, or a program on disk? The `type` builtin answers that question out loud, and building it ties together the builtin table and PATH search you already have.
goal: Implement `type <name>` to report whether a name is a shell builtin or an executable found on PATH.
spec:
  scenario: Classifying a command name
  status: failing
  lines:
    - kw: Given
      text: 'the builtin table contains "cd" and /bin/ls exists on PATH'
    - kw: When
      text: 'the command "type cd" runs'
    - kw: Then
      text: 'it prints "cd is a shell builtin"'
    - kw: And
      text: 'running "type ls" prints "ls is /bin/ls"'
code:
  lang: c
  source: |
    if (is_builtin(name))
        printf("%s is a shell builtin\n", name);
    else if ((p = path_lookup(name)))     // reuse lesson 6's PATH search
        printf("%s is %s\n", name, p);
    else
        printf("%s: not found\n", name);   // status 1
checkpoint: '`type` explains how your shell resolves any name. Chapter two is done. Commit and stop here.'
---

`type` is the shell explaining its own decision procedure. Given a name, it
reports how the shell *would* run it: as a **builtin** if the name is in the
builtin table, otherwise as the **executable** it finds by searching `PATH`, and
if neither, it reports "not found." It is the tool you reach for when `ls` behaves
unexpectedly and you want to know *which* `ls` you are actually running.

Notice you are not writing new machinery today - you are **composing** two pieces
you already have: the builtin lookup from lesson 7 and the `PATH` search from lesson 6.
The order matters and mirrors how the shell itself dispatches: builtins are
checked first, so a builtin always shadows a program of the same name. Building
`type` is a good gut-check that both halves of command resolution are solid before
you move on to parsing.
