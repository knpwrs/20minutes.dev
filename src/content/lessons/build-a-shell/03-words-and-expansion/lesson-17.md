---
project: build-a-shell
lesson: 17
title: export and the child environment
overview: A shell variable stays inside the shell unless you export it. Today you draw that line - marking variables for export and building each child's environment from only the exported ones.
goal: Implement `export NAME=value` so exported variables appear in a child's environment, while unexported shell variables do not.
spec:
  scenario: Exporting a variable to children
  status: failing
  lines:
    - kw: Given
      text: 'the shell runs "export FOO=bar" and then "X=5"'
    - kw: When
      text: 'a child process (such as "env") inspects its environment'
    - kw: Then
      text: 'the child sees FOO=bar'
    - kw: And
      text: 'the child does not see X (it was never exported)'
code:
  lang: c
  source: |
    // export marks a name; keep an "exported" flag per variable
    if (strcmp(words[0], "export") == 0) { mark_exported(words[1]); ... }
    // when launching a child, build envp from exported vars only:
    char **envp = build_env(vars, /*exported only*/ 1);
    execve(path, words, envp);
checkpoint: '`export` decides which variables children inherit. Commit and stop here.'
---

There are two kinds of variable in a shell. A plain **shell variable** - anything
you set with `X=5` - lives only inside the shell; child processes never see it. An
**environment variable** is one you have marked for **export**, and every child
you launch gets a copy. `export FOO=bar` both sets `FOO` and flags it as exported,
so `FOO` now crosses the boundary into any program you run.

To honor that boundary, the child's environment can no longer be "whatever the
shell inherited." When you fork and exec, **build** the child's environment from
just the exported variables and pass it explicitly. Variables the shell started
with are already exported (they came in through the environment), and anything you
mark with `export` joins them. Everything else stays private. This is the
mechanism behind `export PATH=...` making a new directory visible to the programs
you run.
