---
project: build-a-merkle-tree
lesson: 17
title: Domain separation stops a forgery
overview: The 0x00 and 0x01 prefixes are what stop an attacker from passing off an internal node as a leaf. Today you pin that second-preimage defense.
goal: Show that a leaf hash and an internal hash over the same bytes differ because of the prefixes.
spec:
  scenario: A node hash cannot be re-presented as a leaf hash
  status: failing
  lines:
    - kw: Given
      text: 'the internal hash HashNode(0x00063049, 0x6bfe63ee), which is 0xebb8e925'
    - kw: When
      text: 'the same 8 bytes (those two child hashes, big-endian, concatenated) are hashed as a leaf with HashLeaf'
    - kw: Then
      text: 'the leaf hash is 0x4016f9da, which differs from 0xebb8e925 - the difference is exactly the 0x00 versus 0x01 prefix'
    - kw: And
      text: 'a forged claim that those 8 bytes are a leaf under root 0xebb8e925 is rejected - VerifyProof(0xebb8e925, the 8 bytes, an empty proof) returns false because HashLeaf gives 0x4016f9da, not 0xebb8e925'
code:
  lang: go
  source: |
    combo := append(be4(0x00063049), be4(0x6bfe63ee)...) // the two child hashes
    asNode := HashNode(0x00063049, 0x6bfe63ee) // hashBytes(0x01 || combo) = 0xebb8e925
    asLeaf := HashLeaf(combo)                  // hashBytes(0x00 || combo) = 0x4016f9da
    // asNode != asLeaf, purely because of the 0x01 vs 0x00 prefix, so:
    VerifyProof(asNode, combo, nil) // false - the node hash is not a valid leaf
checkpoint: Leaf and node hashes live in separate domains, blocking a node-as-leaf forgery. Commit and stop here.
---

Here is the attack the prefixes prevent. Suppose leaves and nodes were hashed the same
way, with no prefix. Then an internal node - the hash of `left || right` - would be
byte-for-byte the hash of a *leaf* whose data happened to be those same 8 bytes. An
attacker could take a real subtree, call its root a "leaf", and forge an inclusion
proof for data that was never actually added. This is a **second-preimage attack** on
the tree's shape.

**Domain separation** closes the door. Because a leaf is `hashBytes(0x00 || data)` and
a node is `hashBytes(0x01 || left || right)`, the same 8 bytes hash to two different
values (`0x4016f9da` as a leaf, `0xebb8e925` as a node). A leaf hash can never equal a
node hash, so no one can smuggle an internal node in as a leaf - hand those 8 bytes to
`VerifyProof` as a claimed leaf under the node's own value and it rejects them, because
they hash to `0x4016f9da`, not `0xebb8e925`. RFC 6962 uses exactly these `0x00` and
`0x01` prefixes for this reason. One byte, one whole class of forgery gone.
