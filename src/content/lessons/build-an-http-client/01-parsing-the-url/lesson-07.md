---
project: build-an-http-client
lesson: 7
title: Percent-encoding
overview: The inverse of decoding is turning arbitrary bytes into a URL-safe string by escaping everything that is not allowed literally. Today you build the encoder and close the loop on the whole URL parser.
goal: Percent-encode a string, leaving unreserved characters alone and escaping everything else as uppercase %XX.
spec:
  scenario: Encoding a string for a URL
  status: failing
  lines:
    - kw: Given
      text: 'the string "a b/c"'
    - kw: When
      text: it is percent-encoded
    - kw: Then
      text: 'the result is "a%20b%2Fc" (space becomes %20, slash becomes %2F, hex digits uppercase)'
    - kw: And
      text: 'the unreserved characters A-Z a-z 0-9 and - _ . ~ are never escaped - encoding "aZ9-_.~" returns it unchanged'
code:
  lang: go
  source: |
    // unreserved (RFC 3986): letters, digits, and - _ . ~ pass through.
    // every other byte becomes "%" + two UPPERCASE hex digits.
    // (space -> %20 here; the form encoder in ch5 uses "+" instead.)
    func escape(s string) string {
      // for each byte: if unreserved, copy; else emit %XX uppercase
    }
checkpoint: You can round-trip a string through encode and decode, and the URL parser is complete. Commit and stop here.
---

**Percent-encoding** is the inverse of last lesson: given arbitrary text, produce a
string safe to place in a URL by escaping everything that is not allowed. The rule
comes from the URI standard - the **unreserved** characters `A-Z`, `a-z`, `0-9`,
and the four marks `- _ . ~` are always safe and pass through untouched; every
other byte becomes `%` followed by two **uppercase** hex digits. A space becomes
`%20`, a slash `%2F`.

Encode and decode are now inverses: `escape` then `unescape` returns the original.
That round-trip is the whole first chapter closing - you can take a URL string
apart into scheme, host, port, path, query, and fragment, and put text back into a
URL-safe form. One subtlety to file away: form data (chapter five) encodes a space
as `+` rather than `%20`, so the form encoder will be a close cousin of this one,
not the same function.
