---
project: build-a-protobuf-decoder
lesson: 23
title: Last-one-wins and accumulate
overview: 'When a field number repeats, the merge rule depends on whether the schema calls it scalar or repeated: a scalar keeps the last value, a repeated field keeps them all. Today you resolve both from the same duplicate bytes.'
goal: Resolve a duplicated scalar to its last value while a repeated field accumulates.
spec:
  scenario: Duplicates merge by the field's cardinality
  status: failing
  lines:
    - kw: Given
      text: 'a descriptor with field 2 "age" a scalar int32 and field 6 "tags" a repeated int32'
    - kw: And
      text: 'the message bytes 0x10, 0x1E, 0x10, 0x28, 0x30, 0x01, 0x30, 0x02 (age 30 then age 40, tags 1 then tags 2)'
    - kw: When
      text: 'the message is decoded'
    - kw: Then
      text: 'age is 40, the last occurrence winning'
    - kw: And
      text: 'tags is the list 1, 2, both occurrences kept in order'
code:
  lang: go
  source: |
    // scalar field: overwrite each time, so the last value remains
    // repeated field: append each value, so all are kept
    // (the descriptor's repeated flag decides which)
checkpoint: Scalars take the last value and repeated fields accumulate. Commit and stop here.
---

The same field number can appear more than once even for a non-repeated field - a
message concatenated from two partial messages is a valid way to build one, and
protobuf embraces it. The merge rule is governed by the field's cardinality in the
schema. For a **scalar** field, **last one wins**: later occurrences overwrite
earlier ones, so `age` written as 30 then 40 decodes to 40. For a **repeated**
field, every occurrence is **accumulated**, so `tags` written as 1 then 2 decodes to
the list `[1, 2]`.

This single rule is why message concatenation works as a merge: appending the bytes
of message B after message A gives a message where B's scalars override A's and B's
repeated elements extend A's. It falls out naturally from the grouped field list -
walk the occurrences in order, overwrite for scalars, append for repeated - and it
is the last piece of decode semantics before you close the loop by encoding a
message back.
