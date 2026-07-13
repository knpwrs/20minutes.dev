---
project: build-a-bloom-filter
lesson: 3
title: The FNV-1a 64-bit hash
overview: A sketch maps each item to positions in its array, and that map is a hash function. We pin an exact, portable hash - FNV-1a over 64 bits - so every index, counter, and register in this project is reproducible in any language.
goal: Implement the FNV-1a 64-bit hash and reproduce an exact value for a known input.
spec:
  scenario: FNV-1a 64-bit produces a known value
  status: failing
  lines:
    - kw: Given
      text: 'the FNV-1a 64-bit constants - offset basis 14695981039346656037 and prime 1099511628211 - and the rule that for each byte, hash = (hash XOR byte) times prime, all modulo 2 to the 64'
    - kw: When
      text: 'Hash1 is computed over the bytes of the string "cat"'
    - kw: Then
      text: 'it returns 17718013163177550631'
    - kw: And
      text: 'Hash1("the") returns 6266135566914540924'
code:
  lang: go
  source: |
    const offset uint64 = 14695981039346656037
    const prime uint64 = 1099511628211
    func Hash1(data []byte) uint64 {
      h := offset
      for _, b := range data { h ^= uint64(b); h *= prime } // uint64 wraps mod 2^64
      return h
    }
checkpoint: You can compute a deterministic 64-bit hash of any input. Commit and stop here.
---

If a data structure asks the language runtime for a hash (the default map hash), its indices differ between languages and even between program runs, and none of this project's exact bit positions would be reproducible. So we specify the hash ourselves. **FNV-1a** is a good choice: a handful of lines, no tables, and a byte-at-a-time loop that is identical in every language.

The rule is tiny. Start from a fixed **offset basis**, and for each input byte, XOR it into the running hash and then multiply by a fixed **prime**, letting the value wrap around modulo two to the sixty-fourth (unsigned 64-bit overflow). That wrap is the whole hash - there is nothing else to it. Every index this project pins traces back to this function, so confirm the exact value for `"cat"` before moving on.
