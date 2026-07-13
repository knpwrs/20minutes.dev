---
project: build-a-compression-tool
lesson: 12
title: Building the tree, deterministically
overview: The Huffman tree turns frequencies into code lengths by repeatedly merging the two least frequent nodes. Today you build it with a deterministic tie-break so the same input always yields the same code lengths - essential for a reproducible codec.
goal: Build a Huffman tree from frequencies and read off each symbol's code length as its depth.
spec:
  scenario: Frequencies determine code lengths
  status: failing
  lines:
    - kw: Given
      text: 'the frequencies A:5, B:2, R:2, C:1, D:1'
    - kw: When
      text: 'the Huffman tree is built and each symbol''s depth is taken as its code length'
    - kw: Then
      text: 'A has length 1 and B, C, D, R each have length 3'
    - kw: And
      text: 'the lengths satisfy the Kraft equality: 1/2 + 4 x 1/8 = 1'
code:
  lang: go
  source: |
    // min-heap of nodes; each node has freq and a sequence number seq
    // leaves seq'd 0,1,2,... in ascending BYTE order; internal nodes seq'd next
    // pop order: smaller freq first; tie -> smaller seq
    // merge the two smallest into a parent (freq = sum); first pop = left, second = right
    // repeat until one node remains; a symbol's code length is its depth
checkpoint: Frequencies produce a fixed set of code lengths. Commit and stop here.
---

Huffman's algorithm is bottom-up and greedy. Put every symbol in a priority queue
keyed by frequency, then repeatedly remove the **two least frequent** nodes and
join them under a new parent whose frequency is their sum. Rare symbols get buried
deep, frequent ones stay shallow, and a symbol's **depth** in the finished tree is
its **code length**. That is the entire optimality argument in one loop.

The catch is ties. When two nodes have equal frequency the queue must break the
tie the **same way every time**, or two runs on the same data produce different
trees and the codec stops being reproducible. Fix an order: give each node a
sequence number - leaves numbered in ascending byte value, internal nodes numbered
as they are created - and on a frequency tie prefer the smaller sequence number.
For `ABRACADABRA` this yields lengths `A:1` and `B, C, D, R: 3`. A good sanity
check is the **Kraft equality**: for an optimal full tree the code lengths satisfy
the sum of `1/2^length` equal to `1`, here `1/2 + 4 x 1/8 = 1`. Note that only the
lengths matter from here on - the tree's exact shape is scaffolding you can throw
away.
