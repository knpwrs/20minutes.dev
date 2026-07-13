---
project: build-an-lsm-storage-engine
lesson: 21
title: The merge iterator
overview: 'Point lookups walk the stack, but range scans need every source read together in one sorted stream. Today you build the merge iterator: it takes several sorted cursors and yields their keys in one global order.'
goal: Merge several sorted iterators into a single iterator that yields all keys in ascending order.
spec:
  scenario: Merging sorted cursors into one stream
  status: failing
  lines:
    - kw: Given
      text: 'iterator A over keys "apple","cherry" and iterator B over keys "banana","date"'
    - kw: When
      text: they are merged into one iterator and walked to the end
    - kw: Then
      text: 'it yields "apple","banana","cherry","date" in ascending key order'
    - kw: And
      text: 'the merged iterator is itself a valid Iterator (Valid/Key/Value/Next), so merges can nest'
code:
  lang: go
  source: |
    // at each step, pick the source whose current Key() is smallest,
    // emit it, advance THAT source. A small heap works, but a linear
    // scan over a handful of sources is fine and clearer.
    func Merge(iters ...Iterator) Iterator { /* ... */ }
    // assume distinct keys for now; duplicates come next lesson
checkpoint: Several sorted iterators combine into one correctly ordered stream. Commit and stop here.
---

A range scan over the whole store must read the memtable and every SSTable *at the
same time*, interleaving their entries into one sorted sequence. The **merge
iterator** does exactly that: hold a cursor on each source, and at every step emit
the smallest current key, advancing only the source it came from. The result is
all the inputs' keys in global sorted order.

Because the merge iterator implements the same `Iterator` interface it consumes, it
**composes** - a merge can take other merges as inputs, which is how compaction
later merges tables in a tree. Today assumes the sources hold **distinct** keys, so
there is one obvious smallest each step. The interesting case - the *same* key
appearing in two sources, where only the newer should survive - is the next lesson,
and it is the crux of the whole LSM read model.
