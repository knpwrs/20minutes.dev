---
project: build-a-shell
lesson: 6
title: Finding commands on PATH
overview: Nobody types `/bin/ls` - they type `ls`. Today you teach your shell to find a bare command name by searching the directories in the PATH environment variable, the last piece that makes it feel like a real shell.
goal: Resolve a bare command name to a full executable path by searching PATH; use a name containing a slash as-is.
spec:
  scenario: Resolving a command through PATH
  status: failing
  lines:
    - kw: Given
      text: 'the environment variable PATH is "/bin" and /bin/echo exists'
    - kw: When
      text: 'the command name "echo" is resolved'
    - kw: Then
      text: 'it resolves to "/bin/echo"'
    - kw: And
      text: 'a name that contains a "/" (like "./prog") is used unchanged, without searching PATH'
code:
  lang: c
  source: |
    // for each dir in PATH, try dir + "/" + name
    for (char *dir = strtok(path, ":"); dir; dir = strtok(NULL, ":")) {
        snprintf(full, sizeof full, "%s/%s", dir, name);
        if (access(full, X_OK) == 0) return full;   // found & executable
    }
    // if name already contains '/', skip the search and use it directly
checkpoint: You can type `ls` instead of `/bin/ls`. Chapter one is done - your shell runs any program on your PATH. Commit and stop here.
---

The `PATH` environment variable is a colon-separated list of directories like
`/usr/local/bin:/usr/bin:/bin`. When you type `ls`, the shell walks that list in
order, and the **first** directory that contains an executable file named `ls`
wins - that is the full path it hands to `exec`. This is why the order of
directories in `PATH` matters, and why a program in an earlier directory
"shadows" one of the same name later.

There is one exception: if the name already contains a slash - `./prog`,
`bin/tool`, `/usr/bin/env` - the shell treats it as a path directly and does
**not** search `PATH`. That is the rule that lets you run a program in the current
directory with `./prog`. With this in place your shell is genuinely usable: it
prompts, runs any command on your path, and reports status and errors.

(Some languages' process-spawning calls will search `PATH` for you automatically.
Build the resolver yourself anyway - a `resolve(name)` that returns the full path -
so you understand exactly what that convenience is doing, and so your shell owns
the decision rather than delegating it.)
