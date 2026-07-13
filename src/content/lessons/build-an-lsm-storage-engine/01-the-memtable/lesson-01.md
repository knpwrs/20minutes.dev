---
project: build-an-lsm-storage-engine
lesson: 1
title: An empty store that answers "not found"
overview: Every storage engine starts as a thing you can open and ask questions of. Today you build the smallest possible key-value store - one that holds nothing yet - so the public API exists from day one and every later lesson thickens it.
goal: Create an empty in-memory store whose Get reports that any key is missing.
spec:
  scenario: Getting a key from an empty store
  status: failing
  lines:
    - kw: Given
      text: a brand-new, empty store
    - kw: When
      text: 'Get is called with the key "apple"'
    - kw: Then
      text: it reports that no value was found (a not-found result, not an empty value)
code:
  lang: go
  source: |
    // the whole engine will grow inside this type
    type Memtable struct { /* storage comes next lesson */ }
    func New() *Memtable { return &Memtable{} }
    // return a value AND a found flag - "missing" must be
    // distinguishable from "present but empty"
    func (m *Memtable) Get(key string) ([]byte, bool) {
      return nil, false
    }
checkpoint: You have an importable store with a Get that cleanly signals "missing". Commit and stop here.
---

An LSM engine is, from the outside, a **key-value store**: you put keys in and
get them back. Before any of the log-structured machinery matters, the shape of
that surface has to exist - something you can construct and query. Today it holds
nothing, so every lookup misses.

The one decision that pays off for the rest of the project is making **missing**
its own answer. A key that was never written is different from a key whose value
is empty, and later a *deleted* key will be different again. Returning a value
plus a **found flag** keeps those cases separate from the very first line of
code, so nothing downstream has to guess what an empty result means.
