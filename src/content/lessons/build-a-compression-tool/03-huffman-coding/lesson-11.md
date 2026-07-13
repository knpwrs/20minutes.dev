---
project: build-a-compression-tool
lesson: 11
title: Counting symbol frequencies
overview: Huffman coding spends short codes on common symbols and long codes on rare ones, so everything starts with knowing how common each symbol is. Today you count byte frequencies - the input to the whole Huffman machine.
goal: Count how many times each byte value appears in the input.
spec:
  scenario: Frequencies of a short string
  status: failing
  lines:
    - kw: Given
      text: 'the eleven-byte input ABRACADABRA'
    - kw: When
      text: 'frequencies are counted'
    - kw: Then
      text: 'A appears 5 times, B 2, R 2, C 1, and D 1'
    - kw: And
      text: 'the counts sum to 11, the length of the input'
    - kw: And
      text: 'an empty input yields an empty table, and only bytes that actually appear get an entry (no zero-count entries)'
code:
  lang: go
  source: |
    func frequencies(data []byte) map[byte]int {
      f := make(map[byte]int)
      for _, b := range data {
        f[b]++
      }
      return f
    }
checkpoint: You can turn an input into a table of per-byte frequencies. Commit and stop here.
---

**Huffman coding** is built on one observation: if some symbols appear far more
often than others, you can save space by giving the frequent ones short codes and
letting the rare ones be long. To do that you first need the raw material - a
**frequency table** counting how many times each byte value occurs.

Counting is trivial, but it is the honest foundation of everything in this
chapter. For `ABRACADABRA` the table is `A:5, B:2, R:2, C:1, D:1`, and those
counts must sum to the input length, `11` - a cheap invariant worth asserting. In
the next lessons these frequencies drive the shape of a binary tree, and the
depth of each symbol in that tree becomes the length of its code. Only symbols
that actually appear get an entry; a symbol with frequency zero needs no code at
all.
