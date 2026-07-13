---
project: build-a-json-parser
lesson: 5
title: The literal keywords and an illegal token
overview: JSON has exactly three bare words - true, false, and null. Today you scan them as keyword tokens, and introduce the Illegal token the scanner uses to flag anything it cannot make sense of, like a misspelled keyword.
goal: Scan the three literal keywords, and report an unrecognized bare word as an Illegal token.
spec:
  scenario: Keyword recognition and its failure
  status: failing
  lines:
    - kw: Given
      text: 'a bare word run of lowercase letters'
    - kw: When
      text: it is scanned
    - kw: Then
      text: '"true" is a True token, "false" a False token, and "null" a Null token, each followed by EOF'
    - kw: And
      text: '"nul" scans to a single Illegal token at Offset 0, and "truex" also scans to one Illegal token'
code:
  lang: go
  source: |
    // add True, False, Null, Illegal to the Kind set; give Token a Msg field
    // read a run of ascii letters, then decide:
    //   switch word {
    //   case "true": ... case "false": ... case "null": ...
    //   default: Illegal token with Msg like "invalid literal " + word
    //   }
    // Illegal carries the same Offset/Line/Col as any token
checkpoint: The scanner recognizes the three keywords and flags unknown words as Illegal. Commit and stop here.
---

Beyond punctuation, JSON allows exactly three **literal keywords**: `true`,
`false`, and `null`. The scanner reads a run of letters and checks it against those
three names. A match becomes the matching keyword token; anything else - a typo like
`nul`, or extra letters like `truex` - is not a valid JSON token at all.

That failure case needs a home, so today also introduces the **Illegal token**. It
is how the scanner reports "I found bytes I cannot turn into a valid token" without
crashing: it produces an Illegal token carrying a message and the same position
fields as any other token, and stops there. Later the parser will turn an Illegal
token into a positioned error for the caller. For now, just make sure a good keyword
scans to its keyword and a bad one scans to a single Illegal at the right offset.
