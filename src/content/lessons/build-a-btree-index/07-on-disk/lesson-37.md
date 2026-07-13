---
project: build-a-btree-index
lesson: 37
title: Persistence across a restart
overview: Now prove it end to end - write a batch of keys, close the file, open it again from a fresh handle, and confirm every key is still there in order. This is the payoff of moving the tree to disk.
goal: Show that keys written and Closed are all present and ordered after reopening the file from scratch.
spec:
  scenario: The index survives a clean restart
  status: failing
  lines:
    - kw: Given
      text: 'a new tree file into which keys 1 through 20 are inserted (with values), then Closed'
    - kw: When
      text: 'the file is reopened with Open and queried'
    - kw: Then
      text: 'Get returns the right value for all 20 keys, and Scan(1, 21) returns them in ascending order'
    - kw: And
      text: 'the reopened tree accepts a further Put(21, ...) and a Delete(1), and after another Close and Open those changes have also persisted'
code:
  lang: go
  source: |
    // t, _ := Open(path); for i := 1..20 { t.Put(i, i*10) }; t.Close()
    // t2, _ := Open(path); assert t2.Get(i) for all i; assert Scan sorted
    // t2.Put(21, 210); t2.Delete(1); t2.Close()
    // t3, _ := Open(path); assert 21 present, 1 gone, still ordered
checkpoint: The index is genuinely persistent - it reopens with every committed key intact. Commit and stop here.
---

This lesson makes the on-disk story concrete: a full lifecycle of open, mutate,
close, and reopen, with the assertion that nothing was lost. Because every node was
already a page on disk and the meta names the root, reopening is just reading page 0
and resuming - the tree that comes back is byte-for-byte the tree that was closed.

Doing it **twice** - reopen, mutate more, close, reopen again - proves persistence is
not a one-shot trick but a stable property across sessions. This is real durability
under a **clean** shutdown, and for many uses it is enough. But it hides a sharp
edge: every write so far overwrites pages **in place**, so a crash in the middle of a
structural change can leave the file with a half-updated tree - a parent pointing at
a child that was never finished. Closing the gap between "survives a restart" and
"survives a crash" is the whole point of the final chapter.
