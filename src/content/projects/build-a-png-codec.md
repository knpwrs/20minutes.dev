---
title: 'Build a PNG Encoder and Decoder'
order: 20
lessons: 52
size: 'Large'
tech: ['DEFLATE', 'Huffman coding', 'PNG filters']
estMin: 20
desc: 'Build a real PNG codec from the bytes up: parse the signature and chunk stream, validate every chunk with a table-driven CRC32, inflate the zlib/DEFLATE stream by hand (stored, fixed-Huffman, and dynamic-Huffman blocks with canonical Huffman decoding and LZ77 back-references), reverse the five scanline filters, assemble pixels across every color type and bit depth, and then run the pipeline backward to write valid PNG files other decoders can read.'
blurb: 'Start by recognizing eight magic bytes and end with a codec that decodes a real PNG to RGBA pixels and encodes pixels back into a valid PNG. Along the way you build DEFLATE inflate from scratch - a LSB-first bit reader, canonical Huffman tables, the length and distance alphabets, and an overlapping LZ77 copy - then the Paeth predictor and the rest of the filter set, and finally a basic compressor that produces files any PNG viewer will open.'
overview: |
  Over 52 lessons you build a working PNG codec from first principles, decoder first and then encoder. You begin with the container: the eight-byte signature, the length/type/data/CRC chunk structure, and the roles of IHDR, IDAT, PLTE, and IEND. You implement CRC32 from the reversed polynomial as a lookup table and validate every chunk. Then comes the centerpiece, a from-scratch DEFLATE inflate: the zlib wrapper and its Adler-32 trailer, a LSB-first bit reader, stored blocks, canonical Huffman code construction and decoding, the literal/length and distance alphabets with their extra-bit tables, LZ77 back-references into a 32K window including the tricky overlap case, and the dynamic code-length tables. You reverse the five PNG filters (None, Sub, Up, Average, and the Paeth predictor) and assemble raw bytes into RGBA pixels across grayscale, truecolor, palette, and alpha color types at bit depths 1 through 16.

  With a complete decoder in hand you reverse the whole pipeline: serialize pixels to filtered scanlines, DEFLATE-compress them, wrap them in zlib with a correct Adler-32, and write signature plus IHDR, IDAT, and IEND chunks each carrying a correct CRC32, producing a valid PNG that other decoders and your own can read. The capstone decodes a real embedded PNG to pixels and proves your encoder round-trips it.

  This is a teaching-grade codec built around the real PNG and DEFLATE specifications. The decoder is genuinely complete for the standard non-interlaced color types and bit depths; the encoder is deliberately basic, using stored and fixed-Huffman blocks with simple filtering rather than an optimizing compressor, so its files are valid but larger than a production encoder would produce. What you finish with is the honest core that libraries like libpng and zlib extend with interlacing, ancillary chunks, and optimal compression.
parts:
  - name: 'The PNG container'
    count: 7
  - name: 'Integrity with CRC32'
    count: 5
  - name: 'The zlib wrapper and DEFLATE bitstream'
    count: 6
  - name: 'Huffman and LZ77: the inflate core'
    count: 12
  - name: 'Unfiltering scanlines'
    count: 6
  - name: 'Assembling pixels'
    count: 6
  - name: 'The encoder: reverse the pipeline'
    count: 8
  - name: 'Capstone'
    count: 2
caveats:
  note: 'A genuinely complete, robust decoder for standard non-interlaced PNGs across every color type and bit depth (a full from-scratch DEFLATE inflater, all five filters, and pixel assembly), paired with a deliberately minimal encoder that writes valid 8-bit truecolor-with-alpha files other decoders can read but does no LZ77 match-finding, and neither side handles interlacing or ancillary chunks like transparency, gamma, or text.'
  future:
    - 'Add LZ77 match-finding to the encoder so output is not several times larger than necessary'
    - 'Add per-scanline filter selection (Sub, Up, Average, Paeth) to the encoder instead of a single fixed filter'
    - 'Support tRNS transparency on both decode and encode so palette and grayscale images can carry alpha'
    - 'Support Adam7 interlacing, at least on the decode side, to read progressively-stored PNGs'
    - 'Let the encoder emit grayscale, palette, and lower-bit-depth output rather than always 8-bit RGBA'
    - 'Interpret ancillary chunks (gAMA, sRGB, tEXt) instead of skipping them'
resources:
  - title: 'PNG (Portable Network Graphics) Specification, Third Edition'
    author: 'W3C / ISO-IEC 15948'
    url: 'https://www.w3.org/TR/png-3/'
    note: 'The authoritative PNG specification: the signature, chunk layout, IHDR fields, filter algorithms with the exact Paeth predictor, and the color-type and bit-depth matrix. The primary reference for the whole project.'
  - title: 'RFC 1951 - DEFLATE Compressed Data Format Specification'
    author: 'L. Peter Deutsch'
    url: 'https://www.rfc-editor.org/rfc/rfc1951'
    note: 'The DEFLATE spec: block types, the canonical Huffman construction algorithm, the literal/length and distance code tables, and the dynamic code-length encoding. Chapters three and four build directly from this.'
  - title: 'RFC 1950 - ZLIB Compressed Data Format Specification'
    author: 'L. Peter Deutsch, Jean-Loup Gailly'
    url: 'https://www.rfc-editor.org/rfc/rfc1950'
    note: 'The zlib wrapper around DEFLATE: the CMF/FLG header bytes, the FCHECK constraint, and the Adler-32 trailer that PNG uses to frame its compressed image data.'
  - title: 'puff.c - A simple inflate implementation'
    author: 'Mark Adler'
    url: 'https://github.com/madler/zlib/blob/master/contrib/puff/puff.c'
    note: 'A small, heavily commented reference inflate by the author of zlib. The clearest single file to read alongside chapter four when your Huffman decoding or LZ77 copy misbehaves.'
  - title: 'The PNG File Format (write-up)'
    author: 'ImageMagick / Understanding formats'
    url: 'https://en.wikipedia.org/wiki/PNG'
    note: 'A readable overview of the PNG container and how the pieces fit together - a gentler orientation to the chunk stream and filtering before diving into the formal specs.'
  - title: 'An Explanation of the DEFLATE Algorithm'
    author: 'Antaeus Feldspar'
    url: 'https://www.zlib.net/feldspar.html'
    note: 'A plain-language walkthrough of LZ77 plus Huffman as DEFLATE combines them - good intuition for why the length/distance alphabets and the sliding window look the way they do.'
---
