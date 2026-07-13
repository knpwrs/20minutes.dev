---
project: build-a-video-container-parser
lesson: 10
title: Guarding malformed sizes
overview: A real parser has to survive a corrupt or truncated file without crashing or spinning forever. Today you guard the box walk against sizes that are too small or too large, returning a clear error instead of looping.
goal: Make the box walk return an error on a size smaller than the header or larger than the remaining bytes.
spec:
  scenario: Bad box sizes produce an error, never a hang
  status: failing
  lines:
    - kw: Given
      text: 'an 8-byte buffer whose box declares size field 3 (smaller than the 8-byte header)'
    - kw: When
      text: 'the buffer is walked'
    - kw: Then
      text: 'the walk returns an error and does not loop forever'
    - kw: And
      text: 'a box declaring size 1024 inside an 8-byte buffer also returns an error (size exceeds the remaining bytes)'
code:
  lang: go
  source: |
    func parseBoxes(b []byte) ([]Box, error) {
      pos := 0
      for pos < len(b) {
        box := parseHeaderAt(b, pos, len(b))
        // reject a size that cannot advance past the header,
        // or that runs past the end of the buffer
        if int(box.Size) < box.HeaderSize || pos+int(box.Size) > len(b) {
          // return an error here
        }
        pos += int(box.Size)
      }
      return boxes, nil
    }
checkpoint: Your walk rejects malformed sizes. Commit and stop here.
---

The box walk advances by each box's declared size, so a malformed size is
dangerous. A size **smaller than the header** (say 3, when the header alone is 8)
would move the cursor backward or not at all - an infinite loop. A size **larger
than the bytes that remain** would read past the buffer into nothing. Both are
signs of a truncated or corrupt file, and both must become a clean error rather
than a crash or a hang.

The two guards are: reject `size < headerSize` (the box cannot even contain its own
header), and reject `offset + size > len(buffer)` (the box claims more bytes than
exist). With those in place the parser makes forward progress on every well-formed
box and refuses every ill-formed one. This is the robustness the finalized
inspector relies on to reject a non-MP4 file gracefully.
