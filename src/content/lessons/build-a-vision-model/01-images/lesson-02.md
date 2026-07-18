---
project: build-a-vision-model
lesson: 2
title: Reading and writing PGM
overview: An image you cannot look at is hard to debug. Today you give your image a file format - the simplest one that exists - so you can open your output in any image viewer for the rest of the project.
goal: Write an image to a PGM file and read it back into an identical image.
spec:
  scenario: A PGM round trip
  status: failing
  lines:
    - kw: Given
      text: 'the 5 by 5 image from lesson 1, whose pixels are 0 through 24'
    - kw: When
      text: it is written to a file and read back
    - kw: Then
      text: 'the file begins with an 11-byte header - the text P5, a newline, the text 5 5, a newline, the text 255, and a newline'
    - kw: And
      text: 'the 25 pixel bytes follow immediately, with no separators'
    - kw: And
      text: 'the file is 36 bytes long'
    - kw: And
      text: 'the image read back is identical to the one written - same width, same height, same 25 pixels'
code:
  lang: go
  source: |
    // header is text, pixels are raw bytes - PGM is a text header glued to a blob
    fmt.Fprintf(w, "P5\n%d %d\n255\n", img.Width, img.Height)
    w.Write(img.Pixels)
reading: The PGM format specification (Netpbm)
checkpoint: You can write an image and open it in any image viewer, and reading it back gives you exactly what you wrote. Commit and stop for today.
---

**PGM** is the least ceremonious image format in existence, which is exactly why
it is useful here. A text header says what kind of file it is (`P5` for
grayscale binary), how big it is, and what the maximum pixel value is. Then the
pixel bytes, raw, in the same reading order you already store them in. There is
no compression, no colour table, no chunk structure - the pixel bytes on disk
are byte-for-byte the pixel bytes in memory. Compare that to PNG or JPEG, which
are entire projects in their own right.

The payoff is being able to *see* what you have built. Every blur, edge map and
feature map from here on can be dumped to a `.pgm` and opened in a viewer, which
turns "my Sobel output looks wrong" from a debugging nightmare into a glance.
The round trip is worth pinning down today: if writing and reading disagree,
every image you inspect from now on lies to you.
