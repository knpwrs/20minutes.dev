---
project: build-a-shell
lesson: 28
title: Pipelines of any length
overview: Two commands was the special case; today you generalize to a pipeline of any length, threading a fresh pipe between each pair of neighbors in a loop.
goal: Run a pipeline of N commands by connecting each command's output to the next command's input.
spec:
  scenario: A three-stage pipeline
  status: failing
  lines:
    - kw: Given
      text: 'the line: echo hi | cat | cat'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'the output is "hi\n" (it flowed through both cats)'
    - kw: And
      text: all three commands run and the shell waits for every one
code:
  lang: c
  source: |
    int prev = 0;                         // read end feeding this command
    for (i = 0; i < n; i++) {
        int fd[2]; if (i < n-1) pipe(fd); // no pipe after the last command
        if (fork()==0) {
            if (i > 0)   dup2(prev, 0);   // input from previous pipe
            if (i < n-1) dup2(fd[1], 1);  // output to next pipe
            /* close everything, then exec */
        }
        if (i > 0) close(prev);
        if (i < n-1) { close(fd[1]); prev = fd[0]; }
    }
checkpoint: Pipelines of any length work. Commit and stop here.
---

A long pipeline is just the two-command case repeated. Walk the commands left to
right, keeping one descriptor - the **read end of the previous pipe** - as the
input for the current command. For every command except the last, make a new pipe;
the command reads from the previous read end and writes to the new write end. The
last command has no pipe after it, so it writes to wherever the pipeline's output
goes.

The descriptor bookkeeping is the same discipline as yesterday, scaled up: after
forking each stage, the **parent** closes the ends it no longer needs and carries
the new read end forward as `prev` for the next iteration. Get that loop right and
`a | b | c | d` works for any number of stages - which is how real command lines
like `cat log | grep ERROR | sort | uniq -c` come together.
