---
project: build-a-shell
lesson: 16
title: The $? special parameter
overview: The exit status you have been storing since lesson 4 becomes visible today through `$?`, the special parameter every script uses to check whether the last command worked.
goal: Expand `$?` to the last command's exit status as a string.
spec:
  scenario: Expanding the last exit status
  status: failing
  lines:
    - kw: Given
      text: the shell has just run "/usr/bin/false" (last status 1)
    - kw: When
      text: 'the line: echo $?  is expanded'
    - kw: Then
      text: 'the words are ["echo", "1"]'
    - kw: And
      text: 'after a successful command, echo $?  expands to ["echo", "0"]'
code:
  lang: c
  source: |
    // special-case '?' right after '$', before the normal name scan
    if (c == '$' && peek() == '?') {
        next_char();                       // consume '?'
        append_str(itoa(last_status));     // e.g. "1"
    }
checkpoint: '`echo $?` reports whether the last command succeeded. Commit and stop here.'
---

`$?` is a **special parameter**: instead of naming a variable you set, it expands
to the **exit status of the most recent command** - the number you have been
capturing since lesson 4. It is the backbone of shell scripting, the thing you check
to decide "did that work?" So right after `git commit`, `echo $?` printing `0`
tells you it succeeded; `1` or higher tells you it did not.

Handle `?` as a special case in the same expansion pass you built for `$NAME`:
when the character after `$` is `?`, emit the last status formatted as a string
rather than scanning for a variable name (`?` is not a valid name character, so it
needs its own branch). Shells have a handful of these special parameters - `$$`
for the shell's process id, `$0` for its name, `$#` for the argument count - but
`$?` is the one you will reach for constantly, and it is all today's spec needs.
