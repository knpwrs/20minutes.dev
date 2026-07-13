---
project: build-git
lesson: 12
title: 'The directory-sort rule'
overview: 'Git''s tree sort has a famous quirk: a directory sorts as if its name ended in a slash. It only bites when a file and a directory share a prefix, but when it does, getting it wrong changes the hash. Today you pin this edge.'
goal: 'Sort tree entries so a directory is ordered as if its name had a trailing slash.'
spec:
  scenario: A file and a directory sharing a prefix sort correctly
  status: failing
  lines:
    - kw: Given
      text: 'a file entry sub.txt at 587be6b4c3f93f93c489c0111bba5596147a26cb (mode 100644) and a directory entry sub of mode 40000 pointing at b9270df7070cc6a5e7dbdec610a7ce4f54c47b20'
    - kw: When
      text: 'the tree is written, comparing each name as the directory name plus a trailing slash'
    - kw: Then
      text: 'sub.txt is ordered before sub, because a dot (0x2E) sorts before a slash (0x2F)'
    - kw: And
      text: 'the resulting tree id is 58095b0de035986fc345932393c9e2bcbdd4db3f'
code:
  lang: go
  source: |
    // a directory's sort key is its name with a trailing slash appended
    func sortKey(e Entry) string {
      if e.Mode == "40000" {
        return e.Name + "/"
      }
      return e.Name
    }
    // sort by sortKey(a) < sortKey(b); the stored name itself is unchanged
checkpoint: 'Your tree sort matches Git even for files and directories sharing a prefix. Commit and stop here.'
---

Here is the rule real Git uses and most reimplementations get wrong at first:
when comparing two entry names, a **directory is treated as though its name ended
in a slash**. So the file `sub.txt` and the directory `sub` are compared as
`sub.txt` against `sub/`. Byte by byte they agree on `s`, `u`, `b`, then differ:
`.` is 0x2E and `/` is 0x2F, so `sub.txt` sorts **before** `sub`. A naive sort by
the bare name would put `sub` first (a shorter string that is a prefix) and
produce a different, wrong hash.

Only the sort **key** gets the trailing slash; the name stored in the entry is
unchanged. This is a refinement of the sort from the earlier tree lesson, and it
leaves every all-files or non-colliding tree exactly as it was, so your previous
tree ids still hold. It is the kind of boundary that a mid-range test never
reaches: you need a file and a directory sharing a prefix to see it at all.
