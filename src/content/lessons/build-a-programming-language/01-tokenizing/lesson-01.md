---
project: build-a-programming-language
lesson: 1
title: A REPL that echoes
overview: Every interpreter needs a way to feed it source and see a result. Today you build the read-eval-print loop that will be your window into the language for the entire project - for now it just echoes, but it is the runnable program everything else plugs into.
goal: Build a prompt loop that reads a line of input and prints it straight back.
spec:
  scenario: The REPL echoes a line of input
  status: failing
  lines:
    - kw: Given
      text: 'the program is running and shows a prompt'
    - kw: When
      text: 'the user types the line hello world and presses enter'
    - kw: Then
      text: 'the program prints hello world'
    - kw: And
      text: 'it shows the prompt again, ready for the next line'
code:
  lang: go
  source: |
    // read lines until end-of-input, echo each one
    for {
      fmt.Print(">> ")
      line, ok := readLine()
      if !ok { break }   // Ctrl-D / EOF ends the loop
      fmt.Println(line)
    }
checkpoint: You have a running program with a prompt that reads and prints lines. Commit and stop for today.
---

An interpreter is a pipeline - source text goes in one end, tokens become a
tree, the tree becomes a value that comes out the other end. You will build that
pipeline one stage at a time, but you need a way to *drive* it from day one. That
driver is a **REPL**: read a line, evaluate it, print the result, loop.

Right now there is nothing to evaluate, so the "eval" step is just an echo. That
is fine - the point today is a real, runnable program with a prompt you can type
into. Every lesson from here thickens the middle of this loop, and you will run
this same program to watch the language come alive.
