---
title: 'Build a Compression Tool'
order: 23
lessons: 33
size: 'Small'
tech: ['Huffman coding', 'LZ77', 'Entropy coding']
estMin: 20
desc: 'Build a real general-purpose compressor from first principles, organised around one invariant: decompress(compress(x)) must equal x, byte for byte. Start with an MSB-first bit writer and reader that pack codes across byte boundaries, add run-length encoding, canonical Huffman coding, and an LZ77/LZSS sliding-window matcher, then combine the last two into a DEFLATE-lite pipeline with a self-describing container. End with a Compress and Decompress library that round-trips real multi-line text byte-identically, falls back to storing incompressible input without expanding it, and reports the compression ratio.'
blurb: 'A compressor is only correct if it is exactly reversible, so every lesson pins concrete bytes, tokens, or codes and proves the round trip. Pack bits high-first with a padded final byte, split a run at its maximum encodable length, build a Huffman tree with a deterministic tie-break and derive canonical codes from lengths alone, copy an overlapping LZ77 back-reference byte by byte, and combine Huffman with LZ77 into one container that stores its own method, original length, and code tables.'
overview: |
  Over 33 lessons you build a working general-purpose compression library from scratch, built around a single promise: decompress(compress(x)) returns exactly x, for every input. That round-trip invariant keeps the whole thing exactly testable - real packed bytes, real token streams, real Huffman codes - and language-neutral, because the codec you write is defined by the bytes it emits, not by any library call.

  You start with the substrate everything else needs: an MSB-first bit writer and reader that pack variable-width codes across byte boundaries and pad the final byte. On top of that you build three separable codecs - run-length encoding that never expands pathologically, canonical Huffman coding that stores only code lengths and rebuilds the codes, and an LZ77/LZSS sliding-window matcher that emits offset-length back-references - then combine Huffman and LZ77 into a DEFLATE-lite pipeline. A self-describing container records the method, the original length, and the code tables, and the top-level Compress chooses the smaller of the compressed and stored forms so incompressible input never grows. The capstone compresses and decompresses a real multi-line paragraph, asserts the output is byte-identical, and reports the compression ratio.

  This is a teaching-grade compressor built around the classic Huffman, LZ77, and DEFLATE ideas: it is exactly reversible, self-describing, and honest about incompressible data. It deliberately stops short of production DEFLATE - no extra-bit length and distance code families, a small bounded match window rather than 32 KB, and a plain code-length table instead of the run-length-encoded code-length alphabet real DEFLATE packs - which is exactly the honest core that zlib, gzip, and zstd extend with larger windows, entropy-coded code lengths, and format framing.
parts:
  - name: 'Bit I/O: the substrate'
    count: 6
  - name: 'Run-length encoding'
    count: 4
  - name: 'Canonical Huffman coding'
    count: 8
  - name: 'LZ77 and LZSS matching'
    count: 6
  - name: 'DEFLATE-lite: combining codecs'
    count: 6
  - name: 'The capstone compressor'
    count: 3
caveats:
  note: 'The tool works end to end on real files and stdin with honest, non-panicking error handling, but it is a single-block, small-window, unchecksummed DEFLATE-lite - a correct teaching-scale codec, not a production-ready compressor.'
  future:
    - 'Add a checksum (CRC32 or Adler32 style) over the original data so a structurally valid but corrupted archive is caught instead of silently decoding wrong'
    - 'Run-length-pack the code-length table (DEFLATE''s 16/17/18 repeat codes) instead of one fixed-width entry per symbol, to cut the per-block header overhead that makes small inputs fall back to stored'
    - 'Widen the match window from 255 bytes to the real 32 KB and add the extra-bit length and distance code families to close most of the compression-ratio gap with real DEFLATE'
    - 'Support multiple blocks per input so large files get locally adapted Huffman tables instead of one global table for the whole input'
    - 'Add a streaming reader/writer API alongside the whole-slice Compress and Decompress so arbitrarily large input need not fit in memory at once'
    - 'Add adaptive or range/arithmetic coding as an alternative entropy stage for inputs where a static Huffman table leaves bits on the table'
resources:
  - title: 'A Method for the Construction of Minimum-Redundancy Codes'
    author: 'David A. Huffman'
    url: 'https://ieeexplore.ieee.org/document/4051119'
    note: 'The 1952 paper that introduced Huffman coding - the bottom-up merge of the two least frequent symbols that yields an optimal prefix code. The whole Huffman chapter is this one idea, made canonical and serialisable.'
  - title: 'A Universal Algorithm for Sequential Data Compression'
    author: 'Jacob Ziv, Abraham Lempel'
    url: 'https://ieeexplore.ieee.org/document/1055714'
    note: 'The 1977 paper (LZ77) that introduced the sliding-window dictionary: replace a repeated substring with a reference back to its earlier occurrence. The LZSS chapter is the practical literal-versus-match refinement of this.'
  - title: 'DEFLATE Compressed Data Format Specification (RFC 1951)'
    author: 'L. Peter Deutsch'
    url: 'https://www.rfc-editor.org/rfc/rfc1951'
    note: 'The specification that combines LZ77 and Huffman into one format, and the exact source of the canonical-code assignment used here. Read section 3.2 for canonical Huffman and how real DEFLATE packs length and distance codes with extra bits - the parts this project deliberately simplifies.'
  - title: 'Data Compression Explained'
    author: 'Matt Mahoney'
    url: 'https://mattmahoney.net/dc/dce.html'
    note: 'A modern, from-the-ground-up survey of coding and modelling - bit I/O, entropy, Huffman, arithmetic and range coding, LZ variants, and context mixing. The best single free reference for where this project sits in the wider landscape.'
  - title: 'The Data Compression Book'
    author: 'Mark Nelson, Jean-loup Gailly'
    note: 'A hands-on classic that walks through bit I/O, Huffman, adaptive Huffman, arithmetic coding, and LZ77/LZSS with complete C listings - the closest print companion to the arc built here.'
---
