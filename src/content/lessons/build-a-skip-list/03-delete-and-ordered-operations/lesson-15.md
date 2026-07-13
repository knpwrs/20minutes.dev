---
project: build-a-skip-list
lesson: 15
title: Deleting what is not there
overview: A robust delete has to do nothing gracefully - removing a key that is absent, or deleting from an empty list, must leave everything untouched and report that nothing happened. Today you pin those no-op cases and have Delete report whether it removed anything.
goal: Make Delete a no-op that returns false when the key is absent or the list is empty.
spec:
  scenario: Deleting an absent key changes nothing and reports false
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9 (Len 8)'
    - kw: When
      text: 'Delete(6) is called - 6 is not present'
    - kw: Then
      text: 'Delete returns false, Len is still 8, and the ordered keys are unchanged'
    - kw: And
      text: 'Delete(9) on a brand-new empty list returns false and leaves it empty (Len 0, Level 1)'
code:
  lang: go
  source: |
    // The descent already lands on the successor of `key`. If it is not an
    // exact match, remove nothing and report false; otherwise unlink, trim,
    // and report true.
    x = x.forward[0]
    if x == nil || x.key != key {
      return false
    }
    // ... unlink, lower level, s.length--, return true
checkpoint: Delete is a safe no-op for absent keys and empty lists. Commit and stop here.
---

Every mutating operation needs a graceful "nothing to do" path, and delete is the
clearest case. After the descent, the node just ahead on level 0 is the only
candidate; if it does not exist (empty list, or you walked off the end) or its key is
not an exact match, there is simply nothing to remove. Delete should touch no
pointers, change no length, and return **false** so the caller knows the key was
absent - versus **true** when it really unlinked a node.

This makes `Delete` total: it is safe to call with any key at any time, including on
an empty list, and its boolean result doubles as a membership answer. Pinning the
no-op cases now, before they can hide bugs, follows the same instinct as testing the
boundaries of every other operation: the interesting behavior is often at the edges,
where the list is empty or the key falls between existing ones. With insert and
delete both complete and total, the rest of the chapter adds the ordered queries a
sorted collection is expected to answer.
