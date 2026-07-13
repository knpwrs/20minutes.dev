---
project: build-a-shell
lesson: 8
title: pwd
overview: The shell always has a current working directory, and `pwd` prints it. It is a small builtin, but you need it today so you can see the effect of `cd` tomorrow.
goal: Implement the `pwd` builtin so it prints the shell's current working directory.
spec:
  scenario: Printing the working directory
  status: failing
  lines:
    - kw: Given
      text: the shell's current working directory is "/tmp"
    - kw: When
      text: 'the command "pwd" runs'
    - kw: Then
      text: 'it prints "/tmp" followed by a newline'
    - kw: And
      text: the last status is 0
code:
  lang: c
  source: |
    if (strcmp(words[0], "pwd") == 0) {
        char buf[PATH_MAX];
        getcwd(buf, sizeof buf);
        printf("%s\n", buf);
        last_status = 0;
        return;                 // handled as a builtin
    }
reading: 'POSIX shell utilities: pwd.'
checkpoint: Your shell can report where it is. Commit and stop here.
---

Every process has a **current working directory** - the folder that relative
paths are resolved against - and the shell is no exception. `pwd` ("print working
directory") simply asks the operating system for that path and echoes it. It is
about as small as a builtin gets.

Two reasons it comes now. First, it must be a builtin for the same reason `cd`
will be: it reports the *shell's* directory, and a child process has its own copy.
Second, it is your window onto tomorrow's work - once `cd` can change the
directory, `pwd` is how you will confirm it actually moved. Build the observer
before the thing it observes.
