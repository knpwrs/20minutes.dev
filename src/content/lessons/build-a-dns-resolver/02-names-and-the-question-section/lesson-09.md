---
project: build-a-dns-resolver
lesson: 9
title: Decoding a QNAME
overview: To read any response you must turn wire-format labels back into a dotted name. Today you decode a QNAME by walking its length-prefixed labels until the zero terminator, and report how many bytes you consumed.
goal: Decode a length-prefixed name back to a dotted string and its byte length.
spec:
  scenario: Length-prefixed labels decode to a dotted name
  status: failing
  lines:
    - kw: Given
      text: 'the 17 bytes 03 77 77 77 07 65 78 61 6d 70 6c 65 03 63 6f 6d 00'
    - kw: When
      text: 'the name is decoded starting at offset 0'
    - kw: Then
      text: 'the name is "www.example.com" and 17 bytes were consumed'
    - kw: And
      text: 'the bytes 07 65 78 61 6d 70 6c 65 03 63 6f 6d 00 decode to "example.com" with 13 bytes consumed'
code:
  lang: go
  source: |
    func decodeName(b []byte, off int) (string, int) {
      var labels []string
      i := off
      for b[i] != 0 { // stop at the zero root label
        n := int(b[i]); i++
        labels = append(labels, string(b[i:i+n]))
        i += n
      }
      return strings.Join(labels, "."), (i + 1) - off // +1 for the terminator
    }
checkpoint: You can decode a QNAME and report its byte length. Commit and stop here.
---

Decoding reverses the encoder: read a **length byte**, take that many characters as
a label, and repeat until you hit the **zero terminator**. Joining the labels with
dots rebuilds `www.example.com`. The one subtlety is that callers need to know
**how many bytes the name occupied**, because in a real message the type and class
fields (and the next record) come right after it - so return the consumed length
alongside the string.

Count carefully: the seventeen bytes of `www.example.com` include the final `00`,
so the consumed length is `17`, and `example.com` consumes `13`. This
consumed-length discipline is what lets a parser advance cleanly from one field to
the next, and you will lean on it constantly once records start stacking up.
Today's decoder assumes every name is spelled out in full; chapter three adds the
compression pointers that let a name borrow bytes from earlier in the message.
