---
project: build-a-shell
lesson: 15
title: Variable assignment
overview: You can read variables; now you set them. Today you recognize a `NAME=value` word at the start of a line as an assignment that updates the shell's variable table and runs no command.
goal: Treat a leading `NAME=value` word as an assignment into the shell's variable table; a line of only assignments runs nothing.
spec:
  scenario: Assigning a shell variable
  status: failing
  lines:
    - kw: Given
      text: 'the line: X=5'
    - kw: When
      text: the shell processes it
    - kw: Then
      text: 'no command runs, and the shell variable X is now "5"'
    - kw: And
      text: 'a later line: echo $X  expands to ["echo", "5"]'
code:
  lang: c
  source: |
    // a word matching NAME=... where NAME is a valid identifier is an assignment
    char *eq = strchr(word, '=');
    if (eq && is_name(word, eq)) {
        *eq = '\0';
        var_set(vars, word, eq + 1);   // NAME -> value
    }
checkpoint: '`X=5` sets a variable that `$X` reads back. Commit and stop here.'
---

A word of the form `NAME=value` at the **start** of a line is not a command - it
is an **assignment**. It stores `value` under `NAME` in the shell's variable
table, the same table your expansion reads from, and then there is nothing to run:
`X=5` on its own produces no process and no output. The next time you write `$X`,
expansion finds `5`.

The recognition rule is precise: the word must begin with a valid **name**
(a letter or underscore, then letters, digits, or underscores) immediately
followed by an `=`. That is why `X=5` is an assignment but `echo=hi` as a
command's argument, or `2big=1`, is not treated as one. For today, handle the
common case of assignments that stand alone on the line; the fancier form where an
assignment prefixes a command (`X=5 somecmd`) sets a variable only for that one
command, and can wait.
