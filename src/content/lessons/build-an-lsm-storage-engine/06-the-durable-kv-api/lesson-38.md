---
project: build-an-lsm-storage-engine
lesson: 38
title: Ignoring a torn SSTable
overview: Even with atomic rename, a crash can leave a leftover partial file. Today you make Open skip any SSTable whose footer is missing or short - a torn file - and recover the committed data from the WAL instead.
goal: Make Open skip an SSTable with an invalid or truncated footer and still recover committed data.
spec:
  scenario: A torn SSTable is skipped, data recovered from the WAL
  status: failing
  lines:
    - kw: Given
      text: 'a directory containing a valid SSTable, a truncated "000002.sst" whose footer is cut off, and a WAL holding Put("banana","yellow")'
    - kw: When
      text: the store is opened on that directory
    - kw: Then
      text: 'the torn "000002.sst" is skipped (not loaded) and Open succeeds without error'
    - kw: And
      text: 'Get("banana") returns "yellow" from the WAL, so no committed write is lost despite the torn file'
code:
  lang: go
  source: |
    // when loading each .sst: read the fixed-size footer; if the file
    // is too short to hold it, or the index offset it names is out of
    // range, treat the file as torn -> skip it, don't fail Open.
    // committed writes are still in the WAL, which replay recovers.
checkpoint: Open tolerates a torn SSTable and recovers via the WAL. Commit and stop here.
---

Atomic rename makes a torn file *rare*, but a defensive `Open` still refuses to
trust a malformed one. The footer is the validity check: it sits at a fixed offset
from the end and names where the index begins. If the file is too short to even
contain a footer, or the offset it points to is nonsensical, the file was **torn**
by a crash and must be **skipped**, not loaded - and skipping must not fail the
whole open.

This is safe precisely because of the durability invariant from lesson 18: an
SSTable is only made authoritative (and the WAL only reset) *after* it is fully
written and fsynced. So any torn table's writes are still sitting in the WAL, and
replay recovers them. A crash mid-flush therefore costs nothing committed - the
half-table is discarded and the log fills the gap. This is the last guard before
the capstone proves the whole crash story end to end.
