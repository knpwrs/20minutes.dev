---
project: build-an-lsm-storage-engine
lesson: 39
title: Atomic batch writes
overview: Sometimes several keys must land together or not at all. Today you add a batch write that records all its keys as one unit in the WAL, so recovery applies the whole batch or none of it.
goal: Write a batch of key-values as a single atomic unit in the WAL, applied all-or-nothing on replay.
spec:
  scenario: A batch commits atomically across a crash
  status: failing
  lines:
    - kw: Given
      text: 'a batch of Put("apple","red"), Put("banana","yellow"), Put("cherry","dark") written as one WriteBatch'
    - kw: When
      text: the batch is committed (one fsync) and then the store is reopened after an unclean shutdown
    - kw: Then
      text: 'all three keys are present - Get returns "red","yellow","dark" respectively'
    - kw: And
      text: 'a batch whose final record was torn by a crash applies none of its keys - replay treats the incomplete batch as not committed'
code:
  lang: go
  source: |
    // Reuse the record framing you already have: encode the whole batch (its N
    // ops) as the value of ONE ordinary WAL record with a dedicated Kind (e.g.
    // batchKind), committed with a single fsync. The existing crc + length check
    // then makes a torn batch at the tail simply disappear on replay - all or
    // nothing - with no new marker byte that could collide with a record's CRC.
    // On replay, when you see a batch record, decode and apply all its ops together.
    func (d *DB) WriteBatch(b *Batch) error
checkpoint: Batches commit atomically and survive - or fully abort on - a crash. Commit and stop here.
---

A single `Put` is atomic because it is one fsynced record, but applications often
need **several** writes to land together - transfer a balance, update two indexes.
A **batch** groups records so recovery treats them as a unit: frame the batch (a
count or an end marker), write its records, and commit with **one** fsync. All the
records are durable together at that instant.

The all-or-nothing property lives in **replay**: buffer a batch's records and apply
them only once the whole batch is seen intact. If a crash tore the batch's tail,
replay sees an incomplete batch and drops it entirely - none of its keys appear -
so the store never reflects a half-applied batch. This is the strongest durability
guarantee the engine offers, and it is the exact scenario the capstone puts to the
test next.
