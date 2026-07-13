---
title: 'Build a Shell'
order: 6
lessons: 34
size: 'Small'
tech: ['Processes', 'Pipes', 'File descriptors']
estMin: 20
desc: 'Read a line, run a program, and wire up pipes the way your terminal does.'
blurb: 'Understand what happens between pressing Enter and seeing output. Each lesson starts from a small, concrete goal - parse this line, run that program - and ends with it working, until your shell runs pipelines and background jobs.'
overview: |
  Over the next 34 lessons you build a working Unix shell from scratch - the program
  that sits between you and the operating system, turning a line of text into
  running processes. You start with a read-eval-print loop, then learn to launch
  external programs with fork and exec, add the builtins a shell has to run itself
  (cd, pwd, exit), and grow a word parser that handles quoting, variables, and
  filename globbing.

  From there you wire up the machinery that makes a shell feel like a shell:
  redirection with `>`, `<`, and `2>&1`, multi-stage pipelines with `|`, and the
  control operators `;`, `&&`, `||`, and background `&`. You finish with a real,
  runnable shell you can drive interactively or feed a script. It is a
  teaching-grade shell - clear and correct on the core POSIX behaviors, and
  deliberately stopping short of command substitution, here-documents, arithmetic,
  and interactive job control - and every lesson ends with the shell running.
parts:
  - name: 'The REPL'
    count: 6
  - name: 'Builtins'
    count: 5
  - name: 'Words & expansion'
    count: 9
  - name: 'Redirection'
    count: 6
  - name: 'Pipes & control operators'
    count: 8
caveats:
  note: "It's a genuinely usable POSIX-ish shell for everyday external commands, pipelines, redirection, and scripting, but it stops well short of a full shell: no command substitution, here-docs, arithmetic, subshells, or job control, and builtins can't run inside a pipeline stage."
  future:
    - 'Run builtins inside pipeline stages (the biggest everyday-usability gap)'
    - 'Track quoting suppression so quoted globs and tildes stop expanding'
    - 'Add command substitution $(...) and backticks'
    - 'Add subshells/grouping and real operator precedence beyond strict left-to-right'
    - 'Add interactive job control (jobs/fg/bg/Ctrl-Z) and here-docs (<<)'
    - 'Add arithmetic expansion $((...)) and more special parameters ($$, $#, $@)'
resources:
  - title: 'Advanced Programming in the UNIX Environment'
    author: 'W. Richard Stevens, Stephen A. Rago'
    note: 'The definitive reference for the process, signal, and file-descriptor APIs a shell is built on.'
  - title: 'The Linux Programming Interface'
    author: 'Michael Kerrisk'
    url: 'https://man7.org/tlpi/'
    note: 'A more modern, exhaustive companion covering fork/exec, pipes, and job control in detail.'
  - title: 'POSIX.1-2017 (IEEE Std 1003.1), Shell Command Language'
    url: 'https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html'
    note: 'The standard that defines the shell grammar, quoting, and expansion rules this project targets.'
  - title: 'Operating Systems: Three Easy Pieces'
    author: 'Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau'
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/'
    note: 'Free online text with clear chapters on processes and the fork/exec API that ground what a shell orchestrates.'
---
