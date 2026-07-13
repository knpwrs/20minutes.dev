---
project: build-a-btree-index
lesson: 44
title: Crashing before and after the flip
overview: Now prove the two outcomes are the only two. Today you simulate a crash by dropping the handle with no clean close - once before the meta is fsynced and once after - and show the tree opens at the old root in the first case and the new root in the second, never anything in between.
goal: Simulate a crash before and after the meta publish and confirm Open yields the old committed root before, the new root after, and never a torn state.
spec:
  scenario: The commit is all-or-nothing
  status: failing
  lines:
    - kw: Given
      text: 'a tree file committed with keys 1 through 5, then a copy-on-write write staging keys 6 through 10 (new data pages fsynced) that is interrupted with NO clean close'
    - kw: When
      text: 'the write is dropped BEFORE the meta slot is fsynced, and the file is reopened'
    - kw: Then
      text: 'Open resumes at the OLD root: keys 1 through 5 are all present, keys 6 through 10 are absent, and the tree invariants hold with no half-written split visible'
    - kw: And
      text: 'when the same write instead completes the meta fsync (the publish) and only then is dropped, reopening resumes at the NEW root with keys 1 through 10 all present'
code:
  lang: go
  source: |
    // crash = build the new root + fsync data pages, then RETURN without
    // writing/fsyncing the meta slot and without Close (drop the handle).
    // reopen -> Open picks the last valid slot = the OLD commit.
    // the staged pages 6..10 are unreferenced garbage; nothing points at them.
    // second run: also write+fsync the meta slot, THEN drop -> NEW commit wins.
checkpoint: A crash before the flip keeps the old tree; after the flip, the new tree - never a mix. Commit and stop here.
---

This is the property the whole chapter was built for, tested the way a real crash
behaves: stage the write, then **walk away** - no `Close`, no cleanup, just drop the
handle. Because copy-on-write never overwrote a live page, the staged pages for keys
6 through 10 are pure garbage that nothing references, and the meta still points at
the old root. So reopening lands on the previous commit with keys 1 through 5 intact
and not a trace of the interrupted write - no torn page, no parent pointing at a
half-built child, no partial split.

Run it again but let the **meta fsync** complete before dropping the handle, and now
the newer slot is valid with the higher sequence, so open resumes at the new root
with all ten keys. Those are the **only two outcomes**: the commit either happened in
full or did not happen at all, pivoting on that one fsynced pointer flip. The
capstone next puts the whole index - inserts, deletes, ranges, and this crash story -
on trial at once.
