---
project: build-a-btree-index
lesson: 42
title: Committing a write
overview: A commit has a strict order - get the data pages onto disk first, then publish the new root - or a crash could point the meta at pages that were never written. Today you implement that ordered commit, fsyncing the data, then writing the new meta to the older slot and fsyncing.
goal: Commit a copy-on-write write by fsyncing the new data pages, then writing the new meta (sequence + 1) to the older slot and fsyncing.
spec:
  scenario: Ordered commit to the older slot
  status: failing
  lines:
    - kw: Given
      text: 'a tree whose current committed meta is in slot 0 at sequence 3 (root RA), with slot 1 older at sequence 2'
    - kw: When
      text: 'a copy-on-write write produces new root RB and commits'
    - kw: Then
      text: 'the new meta is written to the OLDER slot (slot 1) with sequence 4 and root RB, and slot 0 is left untouched still holding sequence 3 and root RA'
    - kw: And
      text: 'the commit order is data pages fsynced first, then the meta slot written and fsynced - so the meta never names a page that is not yet durable'
code:
  lang: go
  source: |
    func (t *Tree) commit(newRoot PageID) {
      // 1. t.pager.Sync()                 // all new data pages hit disk
      // 2. seq := t.seq + 1
      // 3. write meta{root:newRoot, seq, checksum} to the OLDER slot
      // 4. t.pager.Sync()                 // the publish is now durable
      // slot choice: older = the slot NOT holding the current commit
    }
checkpoint: A write is published by an ordered, fsynced flip to the older meta slot. Commit and stop here.
---

The commit's power is entirely in its **order**. First every new data page is
fsynced, so the whole copy-on-write tree is physically on disk. Only then is the new
**meta** written - to the **older** slot, so the current commit in the other slot
stays intact as a fallback - and fsynced. Because the meta is published last, it can
never reference a page that has not already reached disk; the pointer flip is the
final, single act that makes the new tree official.

Writing to the older slot is what keeps the previous commit recoverable right up
until the new one is durable. If the machine dies after step 1 but before step 4,
the older slot was never finished and the newer slot (the previous commit) is still
there, untouched - so open finds the old tree. If it dies after step 4, the new
slot is complete and wins. There is no in-between where a half-published root is
believed, which is the whole guarantee. The next lesson makes open pick correctly.
