---
project: build-a-shell
lesson: 10
title: cd with no argument, and cd -
overview: Bare `cd` takes you home, and `cd -` takes you back where you were. Today you add those two shortcuts, which means tracking the previous directory as the shell moves.
goal: Make `cd` with no argument go to HOME, and `cd -` return to the previous directory (OLDPWD) and print it.
spec:
  scenario: Special cd destinations
  status: failing
  lines:
    - kw: Given
      text: 'HOME is "/home/me" and the current directory is "/tmp"'
    - kw: When
      text: 'a bare "cd" runs'
    - kw: Then
      text: 'the working directory becomes "/home/me"'
    - kw: And
      text: 'running "cd -" afterward returns to "/tmp" and prints "/tmp"'
code:
  lang: c
  source: |
    char *target = words[1];
    if (target == NULL)            target = getenv("HOME");
    else if (strcmp(target,"-")==0) target = oldpwd;   // and print it
    getcwd(oldpwd, sizeof oldpwd);  // remember where we were, before moving
    chdir(target);
checkpoint: '`cd` alone goes home and `cd -` jumps back. Commit and stop here.'
---

Two shortcuts make `cd` pleasant to live in. A **bare `cd`** with no argument
takes you to your **home directory**, read from the `HOME` environment variable -
the everyday "take me home" gesture. And **`cd -`** returns you to wherever you
just were and prints that path, so you can bounce between two directories without
retyping either.

`cd -` only works if the shell **remembers the previous directory**. The trick is
to record your current location into a saved "old directory" (`OLDPWD`) *just
before* every successful move. Then `-` simply means "the saved old directory,"
and moving there naturally saves your current spot as the next `OLDPWD`. One small
piece of bookkeeping unlocks both shortcuts.
