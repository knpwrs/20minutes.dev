---
project: build-a-shell
lesson: 3
title: Run an external command
overview: This is the lesson your shell stops being a parser and starts being a shell - it launches a real program. You spawn a child process, run the named executable in it, and wait for it to finish.
goal: Given a word list, run the named program in a child process and wait for it to complete.
spec:
  scenario: Running an external program
  status: failing
  lines:
    - kw: Given
      text: 'the word list ["/bin/echo", "hi"]'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'a child process runs /bin/echo and "hi" appears on standard output'
    - kw: And
      text: the shell waits for the child to finish before prompting again
code:
  lang: c
  source: |
    pid_t pid = fork();
    if (pid == 0) {              // child
        execv(words[0], words);  // replace this process with the program
        perror(words[0]);        // only reached if exec fails
        _exit(127);
    }
    waitpid(pid, &status, 0);    // parent waits
checkpoint: Your shell runs real programs - `/bin/echo hi`, `/bin/ls`, anything you name by full path. Commit and stop here.
---

To run a program, a Unix shell does something that looks strange the first time:
it **clones itself**. The `fork` call makes a copy of the shell process; the copy
(the **child**) then **execs** - it throws away the shell's code and replaces
itself with the program you asked for, keeping the same open files. The original
(the **parent**) stays behind and **waits** for the child to finish. This
fork-then-exec dance is the single most important mechanic in the whole project.

Notice that `exec` only returns if it *failed* - on success there is no shell code
left in the child to return to. So the line right after `exec` is your
error-and-give-up path. For today, name programs by their full path
(`/bin/echo`); teaching the shell to find `echo` on its own comes in a few lessons.
