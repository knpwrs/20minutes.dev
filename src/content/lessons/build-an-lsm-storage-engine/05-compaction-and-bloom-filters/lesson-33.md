---
project: build-an-lsm-storage-engine
lesson: 33
title: Skipping tables with the filter
overview: Now the bloom filter earns its space. Today you consult each SSTable's filter before searching it, so a point lookup skips every table that definitely lacks the key - without changing a single answer.
goal: Attach the bloom filter to each SSTable and use it to skip tables on a point lookup, keeping results identical.
spec:
  scenario: A lookup skips tables that cannot hold the key
  status: failing
  lines:
    - kw: Given
      text: 'a store whose SSTable A holds "apple" (its filter excludes "banana") and SSTable B holds "banana"'
    - kw: When
      text: 'Get("banana") is called'
    - kw: Then
      text: 'A''s bloom filter returns false for "banana" so A''s data is never searched, and the value is read from B'
    - kw: And
      text: 'Get returns the same values it did before the filter existed - every present key is still found'
code:
  lang: go
  source: |
    // First wire the filter (from lesson 32) onto the table: give SSTable a `bloom`
    // field and build it in OpenSSTable from the keys already in the index - no
    // file-format change. Then consult it on lookup, newest table first:
    func (d *DB) Get(key string) ([]byte, bool) {
      // memtable first, then for each SSTable:
      //   if !sst.bloom.MayContain(key) { continue }  // provably absent -> skip
      //   else search it as before
    }
checkpoint: Point lookups skip tables the filter rules out, with identical results. Commit and stop here.
---

The bloom filter turns "search every table" into "search only the tables that
might have it." Before probing an SSTable's index, ask its filter `MayContain` - if
it says no, that table **provably** lacks the key, so skip it entirely. Because the
filter has no false negatives, skipping is always safe: you can never skip a table
that actually holds the key.

Correctness is unchanged - every present key is still found, every value is the
same as before - which is the tell of a good optimization: it only removes wasted
work. This completes the storage engine's internals. The engine now writes
durably, reads across memory and many files with recency and deletes honored,
compacts itself, and skips irrelevant files on lookup. The final chapter wraps all
of it in the clean, crash-safe public API a user actually touches.
