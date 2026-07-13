---
project: build-a-qr-code-encoder
lesson: 38
title: 'Capstone: HELLO WORLD'
overview: 'The finale runs the whole pipeline - encode, error-correct, lay out, mask, and format - and asserts the finished 21x21 grid matches the known-good reference module for module, a symbol a real scanner reads as HELLO WORLD.'
goal: 'Encode HELLO WORLD end to end and assert the final grid equals the reference symbol.'
spec:
  scenario: 'The finished symbol matches the reference'
  status: failing
  lines:
    - kw: Given
      text: 'a fresh encoder and the input "HELLO WORLD" at error-correction level Q'
    - kw: When
      text: 'encode runs the full pipeline: data codewords, Reed-Solomon, layout, mask selection (mask 6), and format information'
    - kw: Then
      text: 'the resulting 21x21 grid equals the reference symbol in the background below, module for module (all 441 modules), with (0,0) dark, the top-left finder''s first row a solid run of 7 dark modules, and the dark module (13,8) dark'
    - kw: And
      text: 'a QR scanner decoding the rendered symbol reads back exactly the string "HELLO WORLD"'
code:
  lang: go
  source: |
    grid := Encode("HELLO WORLD", "Q")
    // grid == reference (see background), and rendering it to an
    // image and scanning it returns "HELLO WORLD".
    fmt.Print(grid.Render(4)) // ASCII, 4-module quiet zone
checkpoint: 'You have built a working QR code encoder. The project is complete - commit and stop here.'
---

This is the promise the whole project was built to keep. `Encode("HELLO WORLD", "Q")` runs every stage you built: the string becomes data codewords (modes, packing, padding), Reed-Solomon over GF(256) adds the recovery codewords, the codewords are laid into the grid along the zigzag around the function patterns, all eight masks are scored and mask 6 wins, and the level-Q, mask-6 format information is written beside the finders. The output is the exact reference symbol below - and a real scanner pointed at it reads back `HELLO WORLD`.

```
#######....#..#######
#.....#.##..#.#.....#
#.###.#..#.##.#.###.#
#.###.#.#####.#.###.#
#.###.#.##.#..#.###.#
#.....#..#..#.#.....#
#######.#.#.#.#######
........##.##........
.#.####.##..###.##.#.
#.####.#....####.###.
..#.#.##...#..##.....
#.##.#...#.##...##...
##.########.###.#####
........#...#..#.#...
#######..##..##..####
#.....#.#.#..#..#.###
#.###.#.##.#..#...###
#.###.#.#.###...#.#..
#.###.#..#....#....##
#.....#.###..###..##.
#######..#.#.......#.
```

Every `#` and `.` above is a decision your code now makes for itself: the finders and timing from the layout chapter, the format bits along row and column 8, and the masked data everywhere else. From finite-field addition being XOR all the way to a scannable symbol, you have built the honest core of every QR generator - the field arithmetic, Reed-Solomon error correction, and layout that the larger versions extend with more blocks, bigger grids, and alignment patterns. That is a real QR encoder, and it is yours.
