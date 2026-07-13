---
project: build-a-fuzzy-finder
lesson: 31
title: Feeding it a corpus
overview: A real finder reads its candidates from somewhere - a pipe, a file, a command's output. Today you load a corpus of lines into a Finder, connecting the model to real input.
goal: Build a Finder from a reader, treating each line as one candidate, in order.
spec:
  scenario: Loading candidates from a reader
  status: failing
  lines:
    - kw: Given
      text: 'a reader yielding the text "src/main.go\nREADME.md\ngo.mod\n"'
    - kw: When
      text: a Finder is built from it
    - kw: Then
      text: 'its candidates are exactly ["src/main.go", "README.md", "go.mod"] in that order (the trailing newline adds no empty candidate), and a reader with no lines yields a Finder with zero candidates'
code:
  lang: go
  source: |
    // Read the corpus line by line into the candidate slice.
    func NewFinder(r io.Reader) *Finder {
      var cands []string
      sc := bufio.NewScanner(r)
      for sc.Scan() { cands = append(cands, sc.Text()) }
      f := &Finder{Candidates: cands}
      f.SetQuery("")   // start showing everything
      return f
    }
checkpoint: A Finder can be built from any stream of candidate lines. Commit and stop here.
---

The finder model has been fed hand-written string slices; a real one reads its candidates from the outside world - `find` piping paths in, a file of git branches, your shell history. Loading is deliberately dumb: **one line, one candidate**, preserving order. This is the same "a candidate is just a line" definition the very first lesson chose, now hooked up to an actual **reader**.

The edges are small but worth pinning: a trailing newline should **not** produce a phantom empty candidate at the end, and an empty stream should yield a finder with no candidates rather than one bogus blank one. Starting the finder with an empty query means it opens showing the whole corpus, exactly how fzf greets you before you type. With input wired up, the finder is a complete tool in every respect except the live terminal - which the scripted session lets you drive and test deterministically next.
