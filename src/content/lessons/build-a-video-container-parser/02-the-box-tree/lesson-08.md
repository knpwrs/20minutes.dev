---
project: build-a-video-container-parser
lesson: 8
title: Walking sibling boxes
overview: A file, and every container inside it, is a run of boxes laid one after another. Today you walk a byte range and collect every box in it, advancing past each one by its own size.
goal: Parse a byte range into a flat list of the boxes it contains.
spec:
  scenario: Adjacent boxes are collected into a list
  status: failing
  lines:
    - kw: Given
      text: 'a 24-byte buffer holding an ftyp box of size 16 followed by a free box of size 8'
    - kw: When
      text: 'the buffer is walked into a list of boxes'
    - kw: Then
      text: 'there are 2 boxes: "ftyp" at offset 0 and "free" at offset 16'
    - kw: And
      text: 'each reported box carries its own Size (16 and 8)'
code:
  lang: go
  source: |
    // step through the range, parsing a header then skipping its whole size
    func parseBoxes(b []byte) []Box {
      var boxes []Box
      pos := 0
      for pos < len(b) {
        box := parseHeaderAt(b, pos, len(b))
        boxes = append(boxes, box)
        pos += int(box.Size) // advance past the entire box
      }
      return boxes
    }
checkpoint: You can walk a run of sibling boxes. Commit and stop here.
---

Boxes at one level sit **adjacent**: parse a header, then jump forward by that
box's full `Size` to land exactly on the next box's first byte. Repeat until you
run out of bytes. The key move is advancing by the whole box size, not just the
header - the payload in between is skipped over wholesale at this level.

Here the `ftyp` box is 16 bytes, so after reading it you jump to offset 16 and find
the `free` box (a padding box you can ignore) of size 8, ending at 24. This same
loop parses the top level of a file and, once boxes nest, the children inside any
container. Tomorrow you turn that observation into recursion.
