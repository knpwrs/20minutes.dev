---
project: build-a-shell
lesson: 23
title: Input redirection
overview: Redirection works the other way too - `<` feeds a file into a command's standard input. Today you point file descriptor 0 at a file so programs can read from it as if you had typed it.
goal: Implement `< file` so the command reads its standard input from that file.
spec:
  scenario: Redirecting standard input from a file
  status: failing
  lines:
    - kw: Given
      text: 'the file in.txt contains "hello\n"'
    - kw: When
      text: 'the line: cat < in.txt  runs'
    - kw: Then
      text: 'the shell output is "hello\n" (cat read its input from the file)'
    - kw: And
      text: opening a missing input file reports an error and the command does not run
code:
  lang: c
  source: |
    // input redirection points fd 0 at the file, read-only
    int fd = open(target, O_RDONLY);
    if (fd < 0) { perror(target); /* fail: skip exec, status 1 */ }
    dup2(fd, 0);           // stdin now reads from the file
    close(fd);
checkpoint: '`cat < in.txt` reads from a file. Commit and stop here.'
---

Input redirection is the mirror image of output. Standard **input** is file
descriptor `0`; `<` opens a file read-only and `dup2`s it onto descriptor `0`, so
when the program reads "standard input" it reads the file's contents instead of
your keyboard. `cat < in.txt` and `cat in.txt` produce the same output, but by
completely different routes - in the first, `cat` reads stdin and never knows a
file was involved.

There is one asymmetry worth handling: an output file is *created* if missing, but
an **input file that does not exist is an error**. Opening it fails, and the shell
should report that and skip running the command, setting a non-zero status - there
is no sensible input to give the program. That failure path is the one new wrinkle
on top of the `dup2` pattern you already know.
