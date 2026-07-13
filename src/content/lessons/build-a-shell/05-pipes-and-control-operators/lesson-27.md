---
project: build-a-shell
lesson: 27
title: A two-command pipe
overview: The pipe is the idea that makes Unix Unix - one program's output becomes another's input. Today you connect two commands with `|` by wiring a pipe between their file descriptors.
goal: Run `a | b` by connecting the first command's standard output to the second command's standard input.
spec:
  scenario: Connecting two commands with a pipe
  status: failing
  lines:
    - kw: Given
      text: 'the line: echo hi | cat'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'the output is "hi\n" (echo''s output flowed through cat)'
    - kw: And
      text: both commands run as separate processes and the shell waits for both
code:
  lang: c
  source: |
    int fd[2]; pipe(fd);           // fd[0]=read end, fd[1]=write end
    if (fork()==0){ dup2(fd[1],1); close(fd[0]); close(fd[1]); exec(a); }
    if (fork()==0){ dup2(fd[0],0); close(fd[0]); close(fd[1]); exec(b); }
    close(fd[0]); close(fd[1]);    // parent closes BOTH ends, then waits
checkpoint: '`echo hi | cat` works - your shell has pipes. Commit and stop here.'
---

A **pipe** is a one-way channel in the kernel with two ends: whatever is written
to the write end can be read from the read end. To run `a | b`, the shell creates
a pipe, then forks two children - the first with its standard output `dup2`'d onto
the pipe's write end, the second with its standard input `dup2`'d onto the read
end. Now `a`'s output flows straight into `b`'s input, no file on disk involved.

The part that bites everyone is **closing descriptors**. Every process that holds
the write end open keeps the pipe from signaling end-of-input, so `b` (and the
shell) would hang forever. The rule: each child closes both original pipe
descriptors after dup-ing the one it needs, and the **parent closes both ends too**
before waiting. A pipe only reports "done" when every write end is closed. A
command connected by pipes is a **pipeline** - introduce that list-of-commands
shape now, because the next lessons grow it.
