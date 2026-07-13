---
project: build-a-btree-index
lesson: 12
title: Binary search in a leaf
overview: Because a leaf's keys are sorted, a lookup is a binary search - and its result has to serve two callers at once. Today you write that search so it reports both "found at index i" and, on a miss, "this is where the key would go."
goal: Binary-search a leaf's sorted keys, returning an index and whether the key was found.
spec:
  scenario: Found index versus insertion point
  status: failing
  lines:
    - kw: Given
      text: 'a leaf with sorted keys [10, 20, 30]'
    - kw: When
      text: the keys are searched for a target
    - kw: Then
      text: 'searching for 20 returns index 1, found = true'
    - kw: And
      text: 'searching for 25 returns index 2, found = false (the insertion point); searching for 5 returns index 0, found = false; searching for 35 returns index 3, found = false'
code:
  lang: go
  source: |
    // returns (i, found). on a miss, i is the insertion point:
    // the number of keys strictly less than target.
    func searchLeaf(keys []uint64, target uint64) (int, bool) {
      lo, hi := 0, len(keys)
      // narrow [lo,hi); if keys[mid]==target return mid,true
      // end with lo == insertion point
    }
checkpoint: One search answers both "where is it" and "where would it go". Commit and stop here.
---

Sorted keys mean a lookup is a **binary search**, but the interesting part is what
it returns on a **miss**. A point lookup only cares whether the key is present, but
an insert needs to know *where* the key belongs so it can slot the new entry in and
keep the array sorted. One search serves both by returning an index plus a found
flag: on a hit the index is the key's position, on a miss it is the **insertion
point** - the count of keys strictly less than the target.

Pinning the boundaries is the whole game here. A target below every key returns
index 0; a target above every key returns `len(keys)`; a target between two keys
returns the slot it would occupy. Get the insertion point subtly wrong and inserts
land out of order, so the tests nail all four cases - hit, below, between, above -
not just the middle.
