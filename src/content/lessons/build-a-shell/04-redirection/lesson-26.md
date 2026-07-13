---
project: build-a-shell
lesson: 26
title: Redirecting builtins
overview: Builtins run inside the shell, so redirecting them means temporarily rerouting the shell's own output and putting it back. Today you make redirection work for `pwd` and friends, closing out the redirection chapter.
goal: Make redirection apply to builtins by saving and restoring the shell's own descriptors around the builtin call.
spec:
  scenario: Redirecting a builtin's output
  status: failing
  lines:
    - kw: Given
      text: 'the line: pwd > where.txt'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'where.txt contains the current directory followed by a newline'
    - kw: And
      text: 'a following bare "pwd" prints to the screen again (the shell''s output was restored)'
code:
  lang: c
  source: |
    int saved = dup(1);            // remember the real stdout
    int fd = open("where.txt", O_WRONLY|O_CREAT|O_TRUNC, 0644);
    dup2(fd, 1); close(fd);
    run_builtin(cmd);              // its printf goes to the file
    dup2(saved, 1); close(saved);  // put stdout back
checkpoint: Redirection works for builtins too. Chapter four is done - your shell redirects freely. Commit and stop here.
---

External commands redirect easily because each runs in its own child - you change
the child's descriptors and the shell is unaffected. **Builtins are different**:
they run *in the shell process*, so redirecting `pwd > file` means redirecting the
shell's own standard output, running the builtin, and then carefully **putting it
back** - otherwise every later prompt would write to that file too.

The pattern is save-redirect-restore. Before running the builtin, `dup` the real
standard output to a spare descriptor to remember it; apply the redirections;
run the builtin; then `dup2` the saved descriptor back onto fd `1` and close the
spare. It is the same discipline any code that temporarily borrows a global
resource must follow. With this, redirection is uniform across builtins and
external commands, and the chapter is complete.
