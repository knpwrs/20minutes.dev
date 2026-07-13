---
project: build-a-dns-resolver
lesson: 7
title: Encoding a QNAME
overview: A full domain name is a sequence of labels ending in a zero byte - the root label. Today you encode a whole name by splitting it on dots, encoding each label, and terminating with that zero.
goal: Encode a dotted name into labels terminated by the zero root label.
spec:
  scenario: A dotted name encodes to labels plus a zero terminator
  status: failing
  lines:
    - kw: Given
      text: 'the name "www.example.com"'
    - kw: When
      text: 'it is encoded as a QNAME'
    - kw: Then
      text: 'the result is the 17 bytes 03 77 77 77 07 65 78 61 6d 70 6c 65 03 63 6f 6d 00'
    - kw: And
      text: 'the two-label name "example.com" encodes to 07 65 78 61 6d 70 6c 65 03 63 6f 6d 00, ending in the zero root label'
code:
  lang: go
  source: |
    func encodeName(name string) []byte {
      var out []byte
      for _, label := range strings.Split(name, ".") {
        out = append(out, encodeLabel(label)...)
      }
      return append(out, 0x00) // the zero-length root label ends every name
    }
checkpoint: You can encode a whole domain name as a QNAME. Commit and stop here.
---

A complete name in the question section is called a **QNAME**, and it is just the
labels from lesson 6 laid end to end, followed by a single **zero byte**. That
trailing zero is the **root label** - a label of length zero - and it marks the
end of the name the same way every name in the DNS tree ultimately traces up to
the unnamed root. So `www.example.com` is three labels (`www`, `example`, `com`)
then `00`, seventeen bytes in all.

Splitting the string on dots and encoding each piece is the whole job; the zero
terminator is what a parser watches for to know the name is done. Notice the
two-label case `example.com` ends the same way - labels, then `00`. Every name you
ever encode, from a single label to a long fully-qualified name, finishes with
that zero root label.
