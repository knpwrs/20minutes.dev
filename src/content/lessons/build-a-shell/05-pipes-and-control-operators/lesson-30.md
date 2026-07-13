---
project: build-a-shell
lesson: 30
title: Sequencing with semicolons
overview: A semicolon lets you put several commands on one line, run one after another. Today you add the layer above pipelines that splits a line into a sequence and runs each part in turn.
goal: Split a line on `;` into a sequence of pipelines and run them left to right.
spec:
  scenario: Running commands in sequence
  status: failing
  lines:
    - kw: Given
      text: 'the line: echo a ; echo b'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'the output is "a\nb\n" (both ran, in order)'
    - kw: And
      text: 'a failing first command does not stop the second: "false ; echo done" still prints "done"'
code:
  lang: c
  source: |
    // a line is now a list of pipelines joined by connectors
    // split on ';' first, then run each pipeline in order
    for (each segment between ';') {
        run_pipeline(segment);     // status updates, then continue
    }
checkpoint: '`;` runs commands in sequence. Commit and stop here.'
---

Until now a line has been one command or one pipeline. The **semicolon** breaks
that ceiling: `echo a ; echo b` is two pipelines run one after the other, and
`;` simply means "run this, then run the next, no matter what happened." It is the
plainest way to string commands together.

This introduces a new layer in your parser. A line is now a **list of pipelines**
joined by **connectors**, and `;` is the first connector - the next two lessons add
`&&` and `||` as connectors that run the next pipeline *conditionally*. Structure
it as a list you walk left to right, running each pipeline and updating the last
status as you go. Building the list now, with `;` as its only connector, means the
conditional operators slot in as two more cases rather than a rewrite.
