---
project: build-a-shell
lesson: 4
title: The exit status
overview: Every command a shell runs reports a number when it finishes - zero for success, non-zero for failure. Today you capture that number and remember it, which later powers `$?`, `&&`, and `||`.
goal: After a command finishes, extract its exit code and store it as the shell's last status.
spec:
  scenario: Capturing a command's exit code
  status: failing
  lines:
    - kw: Given
      text: the shell has just run the program "/usr/bin/false" (which exits 1)
    - kw: When
      text: the shell records the result
    - kw: Then
      text: the last status is 1
    - kw: And
      text: after running "/usr/bin/true" (which exits 0) the last status is 0
code:
  lang: c
  source: |
    waitpid(pid, &status, 0);
    if (WIFEXITED(status))
        last_status = WEXITSTATUS(status);   // 0..255
    // keep last_status on the shell for later ($?, && , ||)
checkpoint: Your shell knows whether the last command succeeded or failed. Commit and stop here.
---

When a program finishes, it hands the operating system a small integer - its
**exit status**. By convention `0` means success and anything else means some kind
of failure (`1`, `2`, `127`, ...). The `wait` you already do returns this status
packed together with other information about how the child died, so you have to
unpack the plain exit code out of it.

Store that code on the shell as the **last status**. On its own it does nothing
visible today, but it is the value behind three things you will build soon: the
`$?` variable that prints it, and the `&&` and `||` operators that decide whether
to run the next command based on whether the previous one succeeded. Getting the
capture right now means all three come almost for free later.
