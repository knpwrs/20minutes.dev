---
project: build-a-btree-index
lesson: 43
title: Opening at the newest valid commit
overview: With two meta slots, opening means choosing the right one - the newest commit that is actually complete. Today you make Open read both slots and pick the one with the highest sequence number and a valid checksum, ignoring a torn slot.
goal: Open by reading both meta slots and selecting the root from the slot with the highest sequence number whose checksum validates.
spec:
  scenario: Choosing the winning meta slot
  status: failing
  lines:
    - kw: Given
      text: 'slot 0 with sequence 4 (valid checksum, root RB) and slot 1 with sequence 3 (valid checksum, root RA)'
    - kw: When
      text: the file is opened
    - kw: Then
      text: 'Open picks slot 0 - the highest sequence with a valid checksum - so the tree opens at root RB'
    - kw: And
      text: 'if slot 0''s checksum is invalid (a torn write), Open falls back to slot 1 (sequence 3, root RA); if neither slot validates, Open returns an error'
code:
  lang: go
  source: |
    func Open(path string) (*Tree, error) {
      m0, ok0 := readSlot(0)   // (meta, checksum-valid?)
      m1, ok1 := readSlot(1)
      // choose the valid slot with the higher seq; if only one is valid,
      // use it; if neither validates, return an error.
    }
checkpoint: Open always resumes at the newest fully written commit. Commit and stop here.
---

Open's rule is a two-part filter over the slots: **valid**, then **newest**. A slot
counts as valid only if its **magic matches and** its checksum matches - both, not
just the checksum. That "magic too" is not a nitpick: an all-zero (never-written)
slot XOR-folds to a checksum of 0 that trivially matches its own zero checksum
field, so on checksum alone a blank slot would masquerade as a legitimate
sequence-0 commit pointing at root 0. Requiring the magic rejects it. A torn slot
from an interrupted commit is likewise ignored outright. Among the valid slots, the
one with the **highest sequence number**
is the most recent complete commit, and its root is the tree to resume from. If both
slots are valid, the higher sequence wins; if one is torn, the other is used; if
neither validates, the file is unusable and open says so rather than guessing.

This is the exact complement of the ordered commit. Because a commit writes the
older slot last and fsyncs it, a crash either leaves that slot torn (checksum fails,
so open takes the previous slot) or complete (checksum passes and it has the higher
sequence, so open takes it). Either way open lands on a fully written tree, never a
half-published one. The mechanism is complete - the next lesson deliberately crashes
it to prove the two outcomes are the only two.
