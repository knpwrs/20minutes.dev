---
project: build-a-merkle-tree
lesson: 4
title: Hashing a pair of hashes
overview: To combine two hashes into their parent you hash the pair, with an internal-node prefix 0x01 so a parent can never be mistaken for a leaf. Today you serialize a hash to bytes and build HashNode.
goal: Combine a left and right hash into a parent hash using the 0x01 internal prefix.
spec:
  scenario: An internal node hashes two child hashes with the 0x01 prefix
  status: failing
  lines:
    - kw: Given
      text: 'HashNode prepends 0x01, then appends the left and right hashes each as 4 big-endian bytes, then runs hashBytes on the 9 bytes'
    - kw: When
      text: 'HashNode is called on HashLeaf("alice") which is 0x00063049 and HashLeaf("bob") which is 0x6bfe63ee'
    - kw: Then
      text: 'it returns 0xebb8e925'
    - kw: And
      text: 'HashNode of 0x96a8ad3c (leaf "carol") and 0x68cf0725 (leaf "dave") returns 0x1cde9a86'
code:
  lang: go
  source: |
    const nodePrefix = 0x01
    func be4(h Hash) []byte {              // 4 bytes, big-endian
      return []byte{byte(h >> 24), byte(h >> 16), byte(h >> 8), byte(h)}
    }
    func HashNode(l, r Hash) Hash {
      buf := append([]byte{nodePrefix}, be4(l)...)
      buf = append(buf, be4(r)...)
      return hashBytes(buf)
    }
checkpoint: Two child hashes combine into a parent hash carrying the 0x01 marker. Commit and stop here.
---

An internal node is the hash of its two children. To hash two 32-bit hashes together
you first turn each into bytes - four bytes each, **big-endian**, so the byte order
is fixed and identical in every language - then hash the `0x01` marker followed by
the left bytes and the right bytes. That is nine bytes in, one hash out.

Two things matter here. First, the `0x01` prefix is the other half of the **domain
separation** you started with leaves: a leaf hashes `0x00` plus data, a node hashes
`0x01` plus two hashes, so the two can never collide by construction (you will pin
that defense directly in the proofs chapter). Second, order is significant - `HashNode(l, r)`
is not the same as `HashNode(r, l)`, which is why proofs later have to remember
whether a sibling was on the left or the right.
