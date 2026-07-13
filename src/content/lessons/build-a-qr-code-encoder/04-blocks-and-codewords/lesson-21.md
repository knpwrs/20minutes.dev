---
project: build-a-qr-code-encoder
lesson: 21
title: Splitting into blocks
overview: 'Larger symbols divide their data codewords into several blocks, each protected by its own error correction. Today you write the general split so the encoder is ready for multi-block versions, with Version 1 as the single-block case.'
goal: 'Partition a codeword sequence into blocks of the given per-block sizes.'
spec:
  scenario: 'Codewords partition into blocks'
  status: failing
  lines:
    - kw: Given
      text: 'a general splitter that takes a codeword list and the data size of each block'
    - kw: When
      text: 'splitBlocks([1, 2, 3, 4, 5, 6], [3, 3]) is called'
    - kw: Then
      text: 'it returns two blocks [[1, 2, 3], [4, 5, 6]]'
    - kw: And
      text: 'the Version 1 case splitBlocks(helloData, [13]) returns a single block equal to the whole data - the general code handling the simple case correctly'
code:
  lang: go
  source: |
    // Consume `size` codewords per block in order.
    func splitBlocks(data []byte, sizes []int) [][]byte {
      out := make([][]byte, 0, len(sizes))
      i := 0
      for _, n := range sizes {
        out = append(out, data[i:i+n])
        i += n
      }
      return out
    }
checkpoint: 'You can split data codewords into blocks. Commit and stop here.'
---

Version 1 fits in one block, but larger symbols would overwhelm a single Reed-Solomon block's recovery limit, so the standard **splits the data into several blocks** and computes error correction for each independently. That way damage concentrated in one region only stresses one block's recovery budget. The number of blocks and their sizes come from a per-version table; here you build the mechanism that a table would drive.

The split itself is straightforward: walk the data and hand out `size` codewords per block in order. `splitBlocks([1,2,3,4,5,6], [3,3])` gives `[[1,2,3],[4,5,6]]`. Following the guidance to build the **general shape even when only the simple case is used**, you write it to handle any list of sizes, and Version 1's `[13]` falls out as a single block containing all the data. The next lesson interleaves multiple blocks; for one block it will be a passthrough, but the code will be correct for the day you add larger versions.
