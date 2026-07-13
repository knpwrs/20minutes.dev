---
project: build-a-fuzzy-finder
lesson: 3
title: Filter mode
overview: With a match test in hand, the tool can finally do its job. Today you wire matching into the entry point so a query on the command line filters the candidate stream down to the lines that match.
goal: Add a filter mode that, given a query argument, prints only the candidates that match it, preserving input order.
spec:
  scenario: Filtering the stream by a query
  status: failing
  lines:
    - kw: Given
      text: 'the input lines "src/main.go", "README.md", "go.mod", "src/app.go" and the query "go"'
    - kw: When
      text: the program runs in filter mode with that query
    - kw: Then
      text: 'it prints "src/main.go", "go.mod", and "src/app.go" in that (input) order, and omits "README.md"'
    - kw: And
      text: an empty query prints every input line unchanged
code:
  lang: go
  source: |
    // A -f/--filter flag (or the first positional arg) carries the query.
    // Reuse matches() as the gate; print a line only when it passes.
    query := os.Args[...]  // read the query argument
    for sc.Scan() {
      line := sc.Text()
      if matches(query, line) {
        fmt.Println(line)
      }
    }
checkpoint: The tool now filters real input down to fuzzy matches. Commit and stop here.
---

This is the first lesson where the tool earns its name. The skeleton from lesson 1 streamed every line; now a **query** turns it into a filter. Running it with `go` over a file list keeps only the paths where `g`, `o` appear in order and drops the rest. This non-interactive **filter mode** is exactly fzf's `-f` flag, and it stays useful for the whole project: it is how you drive the pipeline from a script or a pipe, without a terminal UI.

Preserving **input order** matters here. You are not ranking yet - that comes later - so the filtered lines should appear in the same relative order they arrived. Keeping filtering and ranking as separate steps is what lets you get a working tool today and layer match quality on top without rewriting this loop.
