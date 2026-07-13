---
project: build-an-lsm-storage-engine
lesson: 5
title: Tracking the memtable's size
overview: A memtable cannot grow forever - eventually it must flush to disk. Today you track its approximate size in bytes so a later lesson can decide "this is full, time to flush".
goal: Maintain a running byte-size total for the memtable that reflects the current live entries.
spec:
  scenario: Measuring the memtable's size in bytes
  status: failing
  lines:
    - kw: Given
      text: an empty memtable whose size is 0
    - kw: When
      text: 'Put("apple", "red") is called (key 5 bytes + value 3 bytes)'
    - kw: Then
      text: the reported size is 8
    - kw: And
      text: 'after Put("apple", "crimson") overwrites it, the size is 12 (5 + 7), not 20 - the old value is not counted twice'
code:
  lang: go
  source: |
    // size = sum over live entries of len(key)+len(value)
    // on overwrite, subtract the old value's length before adding
    // the new one so the total tracks what is actually stored
    func (m *Memtable) Size() int { return m.size }
checkpoint: The memtable reports how many bytes it holds, correct across overwrites. Commit and stop here.
---

The memtable lives in RAM, so it has a **budget**. When it fills past a
threshold, the engine freezes it and writes it out as an SSTable - the event that
makes an LSM engine an *on-disk* store. To make that decision, the memtable has
to know roughly how big it is.

Today's total is deliberately simple: the sum of `len(key) + len(value)` over the
live entries. The subtle part is **overwrites** - putting a new value for an
existing key must adjust the total by the *difference*, not just add the new
length, or a hot key rewritten many times would inflate the size far beyond what
it actually occupies. Get this right and the flush trigger you wire up later fires
at the right moment.
