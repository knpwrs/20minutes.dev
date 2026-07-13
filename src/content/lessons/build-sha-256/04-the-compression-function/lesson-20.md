---
project: build-sha-256
lesson: 20
title: Threading the hash across blocks
overview: A long message is many blocks, and each one is compressed in turn with the hash state carried forward from the last. Today you build that loop and pin the state after a two-block message - the Merkle-Damgard chaining that makes SHA-256 work on any length.
goal: Compress a sequence of blocks, threading the hash state from each block into the next.
spec:
  scenario: Two blocks compressed in sequence
  status: failing
  lines:
    - kw: Given
      text: 'the initial hash values and the two 64-byte blocks from padding the 56-byte message "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"'
    - kw: When
      text: 'the blocks are compressed in order, the hash returned by block 1 becoming the input hash for block 2'
    - kw: Then
      text: 'the final hash state is H[0]=0x248d6a61, H[1]=0xd20638b8, H[2]=0xe5c02693, H[3]=0x0c3e6039'
    - kw: And
      text: 'H[4]=0xa33ce459, H[5]=0x64ff2167, H[6]=0xf6ecedd4, H[7]=0x19db06c1'
code:
  lang: go
  source: |
    func CompressBlocks(blocks [][]byte) [8]uint32 {
      h := InitialHash()
      for _, block := range blocks {
        h = Compress(h, block)   // each block updates the running state
      }
      return h
    }
checkpoint: You can hash a multi-block message's blocks into a final state. The compression pipeline is complete. Commit and stop here.
---

A message longer than 55 bytes spans several blocks, and SHA-256 handles them by
**chaining**: start from the initial hash values, compress the first block to get
an intermediate state, feed *that* as the input hash to the second block, and so on
- the running hash threads through every block in order. This is the
**Merkle-Damgard** construction, and it is why one fixed-size compression function
can hash a message of any length.

Pin it with the classic two-block vector, the 56-byte message that (from lesson 11)
padded into exactly two blocks. Compress both in sequence and the final state is
`0x248d6a61 0xd20638b8 0xe5c02693 0x0c3e6039 0xa33ce459 0x64ff2167 0xf6ecedd4
0x19db06c1`. If block 2 were fed the initial hash instead of block 1's output - a
common chaining bug - this would come out wrong, so matching it proves the state
really threads through. All that is left is to wire padding and blocking in front
of this loop and serialize the eight words into a digest.
