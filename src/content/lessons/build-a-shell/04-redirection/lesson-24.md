---
project: build-a-shell
lesson: 24
title: Redirecting standard error
overview: Errors travel on their own channel - file descriptor 2 - so you can capture them separately from normal output. Today you add `2>` to send a command's error stream to a file.
goal: Implement `2> file` so the command's standard error is written to that file, leaving standard output alone.
spec:
  scenario: Redirecting standard error
  status: failing
  lines:
    - kw: Given
      text: 'the line: sh -c ''echo E >&2'' 2> err.txt'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'err.txt contains "E\n"'
    - kw: And
      text: the shell's standard output stays empty (only fd 2 was redirected)
code:
  lang: c
  source: |
    // 2> targets fd 2 specifically, not fd 1
    int fd = open(target, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    dup2(fd, 2);           // stderr -> file; stdout untouched
    close(fd);
checkpoint: '`2>` captures error output separately. Commit and stop here.'
---

Programs actually have **two** output channels: standard output (fd `1`) for
normal results, and **standard error** (fd `2`) for diagnostics and error
messages. Keeping them separate is what lets you pipe a command's real output
somewhere while still seeing its errors on screen - or, with `2>`, capture just
the errors into a file. `2>` is `>` aimed at descriptor `2` instead of `1`.

Your redirection record already carries a target and a mode; the new piece is
*which descriptor* a redirection applies to. Generalize it to name the fd - `1`
for `>`, `2` for `2>` - and the apply step becomes "open the target, `dup2` it
onto that fd." With the descriptor number explicit, tomorrow's trick of pointing
one descriptor at another falls out naturally.
