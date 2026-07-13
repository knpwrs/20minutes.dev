---
project: build-a-btree-index
lesson: 38
title: A meta checksum
overview: To trust a meta page after a crash, you have to know it was written completely. Today you add a checksum over the meta's contents, so a torn or half-written meta can be detected and rejected rather than trusted.
goal: Compute and store a checksum over the meta contents, and detect when the stored checksum no longer matches.
spec:
  scenario: Detecting a torn meta
  status: failing
  lines:
    - kw: Given
      text: 'a meta with fields (magic, page size, root, free-list head, page count, sequence), checksummed by XOR-folding its 32-bit big-endian words'
    - kw: When
      text: the checksum is stored in the meta and later recomputed on read
    - kw: Then
      text: 'an untouched meta validates - the recomputed checksum equals the stored one'
    - kw: And
      text: 'flipping any single content byte makes the recomputed checksum differ from the stored one, so validation fails and the meta is rejected'
code:
  lang: go
  source: |
    // checksum = XOR of the content words (everything except the checksum
    // field itself). store it in a dedicated field; on read, recompute
    // over the content and compare.
    func metaChecksum(fields ...uint32) uint32 { /* x ^= each */ }
    func validMeta(b []byte) bool { /* recompute == stored */ }
checkpoint: A half-written meta can be detected instead of trusted. Commit and stop here.
---

Crash safety rests on being able to tell a **fully written** commit record from a
**torn** one. A checksum is that test: fold the meta's meaningful bytes into a small
value, store it alongside them, and on read recompute and compare. If a crash
interrupted the write so the fields and the checksum disagree, the meta is rejected -
better to ignore a half-written commit than to act on it.

XOR-folding the 32-bit words is a deliberately simple checksum - enough to catch a
torn or partially flushed page, which is the failure this design guards against. It
is not a cryptographic hash and does not defend against a malicious edit; it defends
against a **crash mid-write**. Pairing this check with the "highest sequence number"
rule a few lessons from now is exactly how open will choose the last *complete*
commit and discard an interrupted one.
