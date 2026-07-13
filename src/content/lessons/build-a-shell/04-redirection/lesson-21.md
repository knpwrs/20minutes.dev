---
project: build-a-shell
lesson: 21
title: Output redirection
overview: Today the shell learns to send a command's output to a file instead of the screen. You give a command a place to record its redirections, then wire the output to a file in the child before exec.
goal: Parse `> file` out of a command and redirect the command's standard output to that file.
spec:
  scenario: Redirecting standard output to a file
  status: failing
  lines:
    - kw: Given
      text: 'the line: echo hi > out.txt'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'out.txt contains "hi\n" and nothing is printed to the shell''s own output'
    - kw: And
      text: 'the program still receives argv ["echo", "hi"] - the "> out.txt" is not passed as arguments'
code:
  lang: c
  source: |
    // a command is now argv PLUS a list of redirections
    struct Cmd { char **argv; Redir *redirs; };
    // in the child, before exec: point fd 1 at the file
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    dup2(fd, 1);            // stdout now writes to the file
    close(fd);
checkpoint: Your shell redirects output to a file with `>`. Commit and stop here.
---

Redirection changes **where a command's file descriptors point**. Standard output
is file descriptor `1`; normally it is connected to your terminal, but `echo hi >
out.txt` reroutes it to a file. The key mechanism is `dup2`, which makes one
descriptor a copy of another: open the file, then `dup2` it onto descriptor `1`,
and every write the program makes to "standard output" lands in the file instead.
You do this in the **child**, after fork and before exec, so the shell's own
output is untouched.

To make room for this, a command grows from a bare argument list into a small
record: the `argv` plus a **list of redirections**. Parsing now has a second job -
pull the `>` and its target out of the word stream so they never reach the
program as arguments, and record them as redirections to apply. That
`{argv, redirs}` shape is what the next several lessons build on, so introduce it now
even though today adds just one redirection kind.
