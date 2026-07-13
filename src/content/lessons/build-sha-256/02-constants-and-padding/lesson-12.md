---
project: build-sha-256
lesson: 12
title: Splitting into 64-byte blocks
overview: With padding guaranteeing a multiple of 64 bytes, the padded message is cut into the fixed 64-byte blocks the compression function consumes. Today you build that split and index into it.
goal: Cut a padded byte array into consecutive 64-byte blocks.
spec:
  scenario: A padded message divides evenly into 64-byte blocks
  status: failing
  lines:
    - kw: Given
      text: 'the 128-byte padding of a 56-byte message (two blocks worth)'
    - kw: When
      text: 'Blocks(padded) splits it into consecutive 64-byte slices'
    - kw: Then
      text: 'it returns 2 blocks, each exactly 64 bytes long'
    - kw: And
      text: 'the padding of "abc" splits into exactly 1 block, and block[0][3] of that block is 0x80 (the padding marker just after 0x61 0x62 0x63)'
code:
  lang: go
  source: |
    // padded length is always a multiple of 64, so this divides evenly
    func Blocks(padded []byte) [][]byte {
      var out [][]byte
      for i := 0; i < len(padded); i += 64 {
        out = append(out, padded[i:i+64])
      }
      return out
    }
checkpoint: You can split a padded message into 64-byte blocks. Padding and blocking are complete. Commit and stop here.
---

The compression function works one **64-byte block** at a time, so the last step
before hashing is to cut the padded message into those blocks. Because padding
always yields a multiple of 64 bytes, this is a clean walk in 64-byte strides with
no remainder to worry about - a padding of 128 bytes gives 2 blocks, a padding of
64 gives 1.

This closes the input pipeline: raw bytes go in, get padded to a block boundary,
and come out as an ordered list of 64-byte blocks ready to feed the schedule and
compression stages. Pin that `"abc"` yields a single block whose fourth byte
(index 3) is the `0x80` marker sitting right after `a`, `b`, `c` - proof the
padding and the split line up. In chapter 4 you will loop over exactly these
blocks, threading the hash state from one to the next.
