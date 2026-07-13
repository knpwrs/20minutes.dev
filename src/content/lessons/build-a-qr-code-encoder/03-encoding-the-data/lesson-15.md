---
project: build-a-qr-code-encoder
lesson: 15
title: Mode indicator and character count
overview: 'Every QR data stream opens with a header saying how it is encoded and how many characters follow. Today you prepend the 4-bit mode indicator and the character count, completing the payload for HELLO WORLD.'
goal: 'Prefix the alphanumeric mode indicator and a 9-bit character count to the packed data.'
spec:
  scenario: 'Header plus packed data forms the payload'
  status: failing
  lines:
    - kw: Given
      text: 'the packed alphanumeric bits for "HELLO WORLD", and the alphanumeric mode indicator 0010 with a 9-bit character count for Version 1'
    - kw: When
      text: 'the mode indicator (0010) and the count (11, as 000001011) are written before the packed data'
    - kw: Then
      text: 'the full payload is 74 bits long (4 + 9 + 61)'
    - kw: And
      text: 'it begins 00100000010110110000101101111000... , the mode nibble 0010 followed by the count 000001011 followed by the first pair'
code:
  lang: go
  source: |
    // Alphanumeric mode = 0010. Version 1 uses a 9-bit count.
    w.writeBits(0b0010, 4)          // mode indicator
    w.writeBits(len(text), 9)       // character count
    encodeAlnum(w, text)            // then the packed pairs
checkpoint: 'The full data payload for a string is assembled. Commit and stop here.'
---

A decoder reading a bitstream needs to know two things before anything else: which **mode** the data uses and **how many characters** it contains. So every segment opens with a 4-bit **mode indicator** - `0010` for alphanumeric, `0001` for numeric, `0100` for byte - followed by a **character count** whose bit width depends on the mode and the symbol version. For Version 1 alphanumeric, the count is 9 bits.

`"HELLO WORLD"` has 11 characters, so the count field is `11` in 9 bits: `000001011`. Prepend the mode `0010` and this count to the 61 packed bits and you have a complete 74-bit payload beginning `0010 000001011 01100001011 ...`. That is the entire message content; what remains is not about the text at all but about filling the symbol to its fixed capacity, which the next two lessons handle with a terminator and padding.
