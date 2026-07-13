---
project: build-a-qr-code-encoder
lesson: 20
title: The full codeword sequence
overview: 'Data codewords and their error-correction codewords finally come together into the single sequence the symbol will carry. Today you join the two halves you built in separate chapters for the HELLO WORLD block.'
goal: 'Produce the full codeword sequence: data codewords followed by error-correction codewords.'
spec:
  scenario: 'Data and error correction form one sequence'
  status: failing
  lines:
    - kw: Given
      text: 'the 13 HELLO WORLD data codewords and the level-Q count of 13 error-correction codewords'
    - kw: When
      text: 'rsEncode computes the EC codewords and they are appended after the data'
    - kw: Then
      text: 'the sequence is 26 codewords long: the 13 data codewords then [168, 72, 22, 82, 217, 54, 156, 0, 46, 15, 180, 122, 16]'
    - kw: And
      text: 'the full sequence is [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 168, 72, 22, 82, 217, 54, 156, 0, 46, 15, 180, 122, 16]'
code:
  lang: go
  source: |
    // Join the two halves the earlier chapters produced.
    data := dataCodewords(text, "Q")   // chapter 3
    ec := rsEncode(data, 13)           // chapter 2
    seq := append(append([]byte(nil), data...), ec...)
checkpoint: 'The complete codeword sequence for a symbol is assembled. Commit and stop here.'
---

This is where the two big halves of the project meet. Chapter 3 turned text into **data codewords**; chapter 2 turned data codewords into **error-correction codewords**. The symbol carries both, in a defined order: for a single-block symbol like Version 1, it is simply all the data codewords followed by all the error-correction codewords.

Joining HELLO WORLD's 13 data codewords with its 13 error-correction codewords gives a 26-codeword sequence - exactly the Version 1 capacity from the table. This sequence is what gets laid into the grid as bits, so getting its order right is what makes the finished symbol scannable. For Version 1 the order is trivial because there is one block, but the next two lessons build the general splitting and interleaving so the same code would place multi-block symbols correctly too.
