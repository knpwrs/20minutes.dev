---
project: build-a-shell
lesson: 29
title: The pipeline's exit status
overview: A pipeline reports one status, and it is the last command's. Today you pin that rule down, because the operators you build next depend on knowing whether a whole pipeline succeeded.
goal: Set the shell's last status from the exit status of the final command in a pipeline.
spec:
  scenario: A pipeline's status is its last command's
  status: failing
  lines:
    - kw: Given
      text: 'the line: true | false'
    - kw: When
      text: the shell runs it and records the status
    - kw: Then
      text: 'the last status is 1 (from "false", the final command)'
    - kw: And
      text: 'running "false | true" gives a last status of 0 (from "true")'
code:
  lang: c
  source: |
    // wait for all children, but keep only the LAST one's status
    for (i = 0; i < n; i++) {
        int st; waitpid(pids[i], &st, 0);
        if (i == n - 1) last_status = WEXITSTATUS(st);
    }
checkpoint: A pipeline's status reflects its final command. Commit and stop here.
---

When a pipeline finishes, which of its commands decides the overall exit status?
By the standard rule, it is the **last** one. `sort` at the end of `cat | grep |
sort` determines whether the pipeline "succeeded," regardless of how the earlier
stages fared. So you must wait for **all** the children - leaving any unwaited
would create zombies - but record only the final command's status as the shell's
last status.

This is a small change, but it is a prerequisite for the next three lessons.
`&&` and `||` decide what to run based on whether the previous thing succeeded,
and "the previous thing" is usually a whole pipeline. If the pipeline's status
were wrong, every conditional operator built on top of it would misfire. (Real
shells offer a `pipefail` option to instead fail if *any* stage fails; the
last-command rule is the default, and the one you implement.)
