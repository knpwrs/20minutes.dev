---
project: build-git
lesson: 13
title: 'Pretty-printing a tree'
overview: 'To end the chapter with something you can read, we format a tree the way git cat-file -p does: mode, type, id, and name, one entry per line. This also surfaces where Git pads the mode for display.'
goal: 'Format a tree''s entries as human-readable lines matching git cat-file -p.'
spec:
  scenario: A tree prints one readable line per entry
  status: failing
  lines:
    - kw: Given
      text: 'the root tree b7c8f173c30a232f001cc4d77c259e4c99afbbd8'
    - kw: When
      text: 'PrintTree(id) formats each entry as the mode padded to 6 digits, a space, the type, a space, the id, a tab, then the name'
    - kw: Then
      text: 'the first line is 100644 space blob space 0805455a24b6c68fbc38d0fa5d121f735984285d, a tab, then README.md'
    - kw: And
      text: 'the src line shows the padded mode 040000 and type tree (040000 tree b9270df7070cc6a5e7dbdec610a7ce4f54c47b20, tab, src), the type being tree when the mode is 40000 and blob otherwise'
code:
  lang: go
  source: |
    // mode padded left with zeros to width 6; type from mode
    typ := "blob"
    if e.Mode == "40000" { typ = "tree" }
    line := fmt.Sprintf("%06s %s %s\t%s", e.Mode, typ, e.Id, e.Name)
checkpoint: 'You can pretty-print a tree exactly like git cat-file -p. Commit and stop here. Compare your output to git cat-file -p on the same id.'
---

Now the trees are readable. For display, Git pads the mode to **six digits**, so
the directory mode we store as `40000` prints as `040000`, while `100644` is
already six digits and is unchanged. Note the split: the mode on disk (inside the
hashed tree body) has no leading zero, but the mode Git *shows* you does. Mixing
these up is a classic source of confusion, and pinning both keeps them straight.

The **type** is derived, not stored: an entry with mode `40000` points at a tree,
anything else at a blob. Lay it out as mode, type, id, a tab, then the name, and
you have reproduced `git cat-file -p` for trees. Run that command against your
root tree id and the output matches line for line, entries in the same sorted
order. That is the whole chapter proven at once: your trees are real Git trees.
