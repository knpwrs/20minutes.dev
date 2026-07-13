---
project: build-a-fuzzy-finder
lesson: 1
title: The candidate stream
overview: 'A fuzzy finder is a filter over a stream of candidate lines - a list goes in, a smaller list comes out. Today you build the smallest possible version - one that reads candidates and prints them all back - so there is a runnable tool from day one that every later lesson thickens.'
goal: Read newline-separated candidates from standard input and print each one back unchanged.
spec:
  scenario: Echoing every candidate line
  status: failing
  lines:
    - kw: Given
      text: 'the three input lines "src/main.go", "README.md", and "go.mod" on standard input'
    - kw: When
      text: the program runs with no query
    - kw: Then
      text: 'it prints the same three lines, in the same order, one per line'
    - kw: And
      text: empty input prints nothing and exits cleanly
code:
  lang: go
  source: |
    // Read stdin line by line and echo. This is the walking skeleton -
    // it does no filtering yet. Every candidate is a "line".
    sc := bufio.NewScanner(os.Stdin)
    for sc.Scan() {
      line := sc.Text()
      fmt.Println(line)
    }
checkpoint: You have a runnable tool that streams candidates through untouched. Commit and stop here.
---

Every fuzzy finder is, at heart, a **filter over a list of candidates**: file paths, command history, lines of a buffer. Before any matching or scoring matters, that pipe has to exist - something you can run, feed a list of lines, and watch come out the other end. Today it passes everything through, so running it is the identity function on your input.

Starting with a runnable **entry point** is deliberate. The finder will grow one capability at a time - a match test, a score, a ranking - and at every step you will be able to run the tool and see the effect on real input. A candidate is just a line of text; keeping that definition dead simple now means nothing downstream has to care where the lines came from.
