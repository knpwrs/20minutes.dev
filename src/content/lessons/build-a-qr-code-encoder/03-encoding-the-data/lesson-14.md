---
project: build-a-qr-code-encoder
lesson: 14
title: Packing alphanumeric pairs
overview: 'Alphanumeric mode owes its density to a clever packing: two characters share 11 bits, and a lone trailing character takes 6. Today you write that packing over the field of character values.'
goal: 'Encode alphanumeric text as 11 bits per pair and 6 bits for an odd trailing character.'
spec:
  scenario: 'Pairs pack into 11 bits, a lone character into 6'
  status: failing
  lines:
    - kw: Given
      text: 'the alphanumeric values from the previous lesson'
    - kw: When
      text: 'the pair "HE" is packed (H=17, E=14) as 17*45 + 14 = 779'
    - kw: Then
      text: 'it is written as 11 bits: 01100001011'
    - kw: And
      text: 'encoding all of "HELLO WORLD" yields 61 bits, ending in the 6 bits 001101 - the lone trailing ''D'' (value 13) written in 6 bits because it has no partner'
code:
  lang: go
  source: |
    // Take characters two at a time: first*45 + second -> 11 bits.
    // A leftover single character -> 6 bits.
    for i := 0; i+1 < len(s); i += 2 {
      w.writeBits(val(s[i])*45+val(s[i+1]), 11)
    }
    if len(s)%2 == 1 {
      w.writeBits(val(s[len(s)-1]), 6) // odd tail
    }
checkpoint: 'You can pack alphanumeric text into its bitstream. Commit and stop here.'
---

Two alphanumeric characters together range over `45 * 45 = 2025` combinations, which fits in 11 bits (`2^11 = 2048`). So alphanumeric mode packs characters **in pairs**: the value is `first * 45 + second`, written as 11 bits. `"HE"` becomes `17 * 45 + 14 = 779`, which is `01100001011`. That is why alphanumeric mode is denser than one byte per character.

The one wrinkle is odd length. When the text has an odd number of characters, the final character has no partner, so it is written alone in **6 bits** (enough for a single value up to 44). `"HELLO WORLD"` has 11 characters: five pairs at 11 bits each is 55 bits, plus the lone `D` (value 13) at 6 bits, for 61 bits total, ending in `001101`. Getting that odd-tail case right is the classic off-by-one of alphanumeric encoding; pin it now, because the header you add next has to declare the character count that tells a decoder where the tail is.
