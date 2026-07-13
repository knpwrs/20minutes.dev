---
project: build-git
lesson: 17
title: 'Persisting the index'
overview: 'The index has to survive between commands, so Git writes it to a file. Real Git uses a packed binary format; we use a simple line-based one that is easy to read and round-trips cleanly. Today you save and load the index.'
goal: 'Write the index to disk and read it back into an identical index.'
spec:
  scenario: The index round-trips through a file
  status: failing
  lines:
    - kw: Given
      text: 'an index holding hello.txt (100644, ce013625030ba8dba906f756967f9e9ca394464a) and README.md (100644, 0805455a24b6c68fbc38d0fa5d121f735984285d)'
    - kw: When
      text: 'the index is written to .mygit/index as one line per entry, mode space id space path, sorted by path, then loaded back'
    - kw: Then
      text: 'the file lines are 100644 0805455a24b6c68fbc38d0fa5d121f735984285d README.md then 100644 ce013625030ba8dba906f756967f9e9ca394464a hello.txt'
    - kw: And
      text: 'the loaded index has the same two entries as the original'
code:
  lang: go
  source: |
    // one line per entry: "<mode> <id> <path>\n", sorted by path
    for _, p := range ix.Paths() {
      e := ix.entries[p]
      fmt.Fprintf(w, "%s %s %s\n", e.Mode, e.Id, p)
    }
    // load: split each line into mode, id, path and Set it
checkpoint: 'The index survives across commands. Commit and stop here.'
---

A staging area is only useful if it persists: you run `add` today, `commit`
tomorrow, and the index must still be there. Git serializes it to `.mygit/index`.
Real Git uses a compact binary format with cached stat data for speed; that
format is documented but fiddly, and it is not what this project is about, so we
use a plain **line-based** format instead: one line per entry with the mode, id,
and path, sorted by path.

This is the one place we knowingly diverge from real Git's bytes. It is a safe
divergence: the index is a private staging structure, never hashed into an object,
so `write-tree` and every id downstream still match Git exactly. What must
round-trip is the **information** (each path's mode and id), not the exact file
layout. Save it, load it, and confirm you get the same entries back.
