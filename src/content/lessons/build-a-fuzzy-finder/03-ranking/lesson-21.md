---
project: build-a-fuzzy-finder
lesson: 21
title: The filter, ranked
overview: The filter mode from chapter one still prints in input order. Today you upgrade it to the full pipeline - parse the query, rank every candidate, and print the best matches highlighted - closing the ranking chapter with a real, ordered filter.
goal: Make filter mode rank its output by score and highlight each printed match.
spec:
  scenario: Ranked, highlighted filter output
  status: failing
  lines:
    - kw: Given
      text: 'the input lines "src/main.go", "README.md", "go.mod", "src/app.go" and the query "go"'
    - kw: When
      text: the tool runs in filter mode
    - kw: Then
      text: 'it prints three highlighted lines in score order: "src/app.[g][o]" (score 45, length 10), then "src/main.[g][o]" (score 45, length 11, after the shorter tie), then "[g][o].mod" (score 40)'
code:
  lang: go
  source: |
    // filter mode = parse -> rank -> sort -> highlight -> print.
    results := rank(query, candidates)   // parses terms, scores, sorts
    for _, r := range results {
      fmt.Println(highlight(r.Candidate, r.Positions))
    }
checkpoint: The non-interactive filter now returns ranked, highlighted matches. Commit and stop here.
---

Chapter one's filter printed matches in input order because that was all it could do. Now the finder has a whole pipeline - parse the query into terms, score every candidate's best alignment, sort with tie-breaking, recover positions - so filter mode becomes its real self: the **ranked, highlighted** output that fzf's `-f` flag produces. The two `go` matches at the same score order by length, and the weaker `go.mod` follows.

This is the tool a script or a pipe would actually use, and it exercises every piece of the back three chapters at once. It is also the natural checkpoint before going interactive: everything an interactive finder does per keystroke is exactly this pipeline, run again on a new query. The next chapter takes this batch pipeline and wraps it in state - a query you can edit, a selection you can move, a frame you can draw.
