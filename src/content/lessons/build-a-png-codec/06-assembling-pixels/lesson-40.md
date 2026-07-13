---
project: build-a-png-codec
lesson: 40
title: Palette images
overview: Palette images store an index per pixel and look up the real color in a PLTE table. Today you add palette assembly, which means reading the PLTE chunk and indexing it.
goal: Assemble color type 3 (palette) images by looking each pixel's index up in the PLTE chunk.
spec:
  scenario: Resolving palette indices to colors
  status: failing
  lines:
    - kw: Given
      text: 'a PLTE chunk with two entries - index 0 is 10,20,30 and index 1 is 40,50,60 - and unfiltered 8-bit indices 0,1,1,0'
    - kw: When
      text: the pixels are assembled
    - kw: Then
      text: 'the four pixels are 10,20,30,255 then 40,50,60,255 then 40,50,60,255 then 10,20,30,255'
    - kw: And
      text: 'each palette entry is three bytes (red, green, blue), alpha defaults to 255, and an index past the palette end is an error'
code:
  lang: go
  source: |
    // parse PLTE data into [][3]byte entries (3 bytes each).
    // case 3: idx := raw[i]; e := palette[idx]; Set(x,y, e[0],e[1],e[2], 255)
    func parsePLTE(data []byte) [][3]byte { }
checkpoint: You can assemble palette images through a PLTE lookup. Commit and stop here.
---

**Palette** images (color type 3) do not store colors per pixel - they store a small **index** per pixel and keep the actual colors in the **PLTE** chunk, a flat list of RGB triples. Assembly is a lookup: read the index, fetch `palette[index]`, and write its three bytes with opaque alpha. With a two-entry palette and indices `0,1,1,0`, the four pixels alternate between the two palette colors. This indirection is how PNG keeps images with few distinct colors tiny.

Parsing `PLTE` is trivial - three bytes per entry, so its data length divided by three is the entry count - but two guards matter. An index that points **past the end** of the palette is a malformed file and should error rather than read out of bounds, and a type-3 image with **no PLTE chunk** at all is invalid. Palette entries carry only RGB; per-index transparency lives in a separate optional `tRNS` chunk this teaching codec leaves opaque. With palette done, every 8-bit color type is handled - only the bit-depth variations remain.
