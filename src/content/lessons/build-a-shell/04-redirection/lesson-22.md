---
project: build-a-shell
lesson: 22
title: Append redirection
overview: The `>>` operator adds to a file instead of replacing it. Today's change is one flag different from yesterday, but it teaches the distinction between truncating and appending that every log file depends on.
goal: Implement `>> file` so output is appended to the file rather than overwriting it.
spec:
  scenario: Appending to a file
  status: failing
  lines:
    - kw: Given
      text: 'the file log.txt already contains "a\n"'
    - kw: When
      text: 'the line: echo b >> log.txt  runs'
    - kw: Then
      text: 'log.txt contains "a\nb\n" (the existing content is kept)'
    - kw: And
      text: 'by contrast, echo c > log.txt would replace it with just "c\n"'
code:
  lang: c
  source: |
    // same as '>' but O_APPEND instead of O_TRUNC
    int flags = O_WRONLY | O_CREAT | (append ? O_APPEND : O_TRUNC);
    int fd = open(target, flags, 0644);
    dup2(fd, 1);
checkpoint: '`>>` appends and `>` truncates. Commit and stop here.'
---

`>>` is `>`'s gentler sibling: it points standard output at a file just the same,
but **appends** to whatever is already there instead of wiping the file first. The
entire difference is one flag when you open the file - **truncate** for `>`,
**append** for `>>` - which is why it fits in a single lesson on top of yesterday's
work.

The distinction matters more than it looks. `command > log` starts the log fresh
every run; `command >> log` accumulates history across runs. Getting the open
flags right is the whole job: open with create-and-append for `>>`, and the
operating system positions every write at the current end of the file, even if
another process is appending too. Record `>>` as a second redirection kind
alongside `>` in the list you built yesterday.
