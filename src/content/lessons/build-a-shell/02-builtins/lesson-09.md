---
project: build-a-shell
lesson: 9
title: cd
overview: Changing directory is the builtin that most clearly cannot be a child process. Today you implement `cd`, including the error case where the target does not exist, so a bad path never silently moves you.
goal: Implement `cd <path>` to change the shell's working directory, reporting an error and leaving the directory unchanged when the path is invalid.
spec:
  scenario: Changing the working directory
  status: failing
  lines:
    - kw: Given
      text: 'the shell runs "cd /"'
    - kw: When
      text: 'a following "pwd" runs'
    - kw: Then
      text: 'it prints "/"'
    - kw: And
      text: 'running "cd /no/such/dir" prints an error, sets status 1, and leaves the working directory unchanged'
code:
  lang: c
  source: |
    if (strcmp(words[0], "cd") == 0) {
        if (chdir(words[1]) != 0) {          // ask the OS to move
            fprintf(stderr, "cd: %s: %s\n", words[1], strerror(errno));
            last_status = 1;
        } else last_status = 0;
        return;
    }
checkpoint: '`cd` moves your shell around the filesystem, and a bad path fails loudly. Commit and stop here.'
---

Here is the builtin that makes the "builtins must run in-process" rule concrete.
If `cd` ran in a child, the child would change *its* directory and then exit,
leaving the shell exactly where it started - useless. So `cd` calls the operating
system's change-directory function on the **shell process itself**, and every
later command inherits the new location.

The other half of `cd` is failing well. Ask the OS to move; if it refuses -
because the path does not exist, or is not a directory, or you lack permission -
report a clear error, set the status to `1`, and crucially **do not** pretend you
moved. A shell that silently stays put on a failed `cd` is a shell that loses your
place. Confirm the move with `pwd`, which you built yesterday for exactly this.
