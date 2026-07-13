---
project: build-a-qr-code-encoder
lesson: 19
title: Version 1 capacity table
overview: 'How many data codewords a symbol holds, and how many error-correction codewords protect them, is fixed by the version and error-correction level. Today you encode that table for Version 1 so the encoder knows its exact budget.'
goal: 'Look up the data and error-correction codeword counts for each Version 1 error-correction level.'
spec:
  scenario: 'Codeword counts per error-correction level'
  status: failing
  lines:
    - kw: Given
      text: 'the Version 1 codeword layout, where every level fits in a single error-correction block'
    - kw: When
      text: 'the counts for levels L, M, Q, and H are looked up'
    - kw: Then
      text: 'level Q reports 13 data codewords and 13 error-correction codewords in 1 block'
    - kw: And
      text: 'L is 19 data / 7 EC, M is 16 data / 10 EC, H is 9 data / 17 EC - every level totals exactly 26 codewords (the fixed Version 1 capacity), the data capacity in bits is dataCodewords times 8 (Q is 104 bits, matching the padding target from lesson 16), and an unsupported request (a version other than 1) is reported rather than returning bogus counts'
code:
  lang: go
  source: |
    // Version 1: one block per level. {data, ec} codewords.
    var v1 = map[string][2]int{
      "L": {19, 7}, "M": {16, 10},
      "Q": {13, 13}, "H": {9, 17},
    }
    // total is always 19+7 == 16+10 == 13+13 == 9+17 == 26
checkpoint: 'The encoder knows its codeword budget for each level. Commit and stop here.'
---

A QR symbol of a given version has a **fixed total number of codewords** - for Version 1 it is always 26 - split between data and error correction according to the **error-correction level**. Higher protection means fewer data codewords: level L keeps 19 for data and spends 7 on recovery, while level H reserves 17 for recovery and leaves only 9 for data. Level Q, the worked example, splits it evenly at 13 and 13.

This table is what earlier lessons quietly assumed: the "13 codewords" capacity you padded to, and the "13 EC codewords" you generated, both come from the Q row here. Larger versions split their codewords across **several blocks**, but Version 1 always uses a **single block**, which keeps the next two lessons simple. Encoding the table now gives the encoder a single source of truth for how much data fits and how much error correction to compute.
