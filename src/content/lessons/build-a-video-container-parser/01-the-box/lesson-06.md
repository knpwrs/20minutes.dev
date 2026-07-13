---
project: build-a-video-container-parser
lesson: 6
title: The ftyp brand box
overview: The very first box in a real MP4 is ftyp, which declares the file's brand - what flavour of the format it is and what it is compatible with. Today you parse its payload, giving you the first box whose contents you can actually read and print.
goal: Parse an ftyp payload into a major brand, a minor version, and a list of compatible brands.
spec:
  scenario: An ftyp box decodes to its brand fields
  status: failing
  lines:
    - kw: Given
      text: 'an ftyp box of size 28 whose payload is "isom", then 0x00 0x00 0x02 0x00, then "isom" "iso2" "mp41"'
    - kw: When
      text: 'the ftyp payload is parsed'
    - kw: Then
      text: 'MajorBrand is "isom" and MinorVersion is 512'
    - kw: And
      text: 'CompatibleBrands is exactly ["isom", "iso2", "mp41"]'
code:
  lang: go
  source: |
    type FileType struct {
      MajorBrand       string
      MinorVersion     uint32
      CompatibleBrands []string
    }
    // payload = major(4) + minor(4) + N * brand(4) until payload ends
    func parseFtyp(payload []byte) FileType { /* fill in */ }
checkpoint: You can parse the ftyp brand box. Commit and stop here.
---

`ftyp` is the file-type box and it comes first. Its payload is a **major brand**
(a fourcc naming the primary spec the file claims, like `isom` or `mp42`), a
**minor version** (a 32-bit number - here `0x00000200` = `512`), and then a list of
**compatible brands**, each a fourcc, filling the rest of the payload. A player
reads these to decide whether it can handle the file at all.

The compatible-brands list has no count field: you read 4-byte brands until you run
out of payload, so knowing the payload length exactly (from the box size minus the
header) is what tells you when to stop. That payload-length arithmetic is the first
thing you formalise in the next chapter, where boxes start nesting inside each
other.
