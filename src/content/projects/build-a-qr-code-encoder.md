---
title: 'Build a QR Code Encoder'
order: 39
lessons: 38
size: 'Medium'
tech: ['Reed-Solomon', 'Galois fields', 'Error correction']
estMin: 20
desc: 'Encode a scannable QR code: Reed-Solomon error correction over GF(256), masking, and layout.'
blurb: 'The core is Reed-Solomon error correction over GF(256), and every value is pinned to the known HELLO WORLD worked example: the exp/log tables of the field, the generator polynomial coefficients, the exact 13 data and 13 error-correction codewords, the finder pattern layout, the zigzag data path, the lowest-penalty mask, and the BCH format bits. Each lesson is one concrete spec with exact field elements, codewords, or matrix modules - and the capstone asserts the finished 21x21 grid module for module against the reference.'
overview: |
  Over 38 lessons you build a working QR code encoder from first principles, as a library: give it a string and it returns the boolean module grid - the black-and-white square pattern - that a real scanner reads back. The whole project is anchored to one fully worked example, the string HELLO WORLD as a Version 1, error-correction level Q symbol, so every intermediate value (field element, codeword, matrix module) is a concrete number you assert against.

  You start in the finite field GF(256), the arithmetic that error correction runs on: addition is XOR, multiplication reduces by the polynomial 0x11D, and log and antilog tables make it fast. On that field you build Reed-Solomon error correction - the generator polynomial and polynomial division that produce the recovery codewords. Then you encode text into a bitstream (modes, character counts, padding), split it into data and error-correction codewords, and lay out the 21x21 grid: the three finder patterns, timing lines, the dark module, the zigzag data path, the eight mask patterns scored by four penalty rules, and the BCH-protected format information. The capstone encodes HELLO WORLD end to end and asserts the finished grid equals the known-good reference, module for module - a symbol a real scanner decodes.

  This is an encoder, not a scanner: it turns text into the module grid, and the reference build is deliberately scoped to Version 1 (the smallest 21x21 symbol) across all four error-correction levels, with the full Reed-Solomon and masking pipeline that larger versions reuse. You build both an alphanumeric and a byte-mode encoder; the end-to-end pipeline drives the worked example through alphanumeric mode, and a finishing command-line tool renders any input as ASCII blocks. Reading a QR back from a camera photo is the opposite problem - perspective correction and image processing - and is a separate, much larger project, so it is out of scope here. What you finish with is the honest core of every QR generator: the field arithmetic, error correction, and layout that scale up to the bigger versions by extending the same code.
parts:
  - name: 'GF(256), the field of QR'
    count: 6
  - name: 'Reed-Solomon error correction'
    count: 5
  - name: 'Encoding the data'
    count: 7
  - name: 'Blocks and the codeword sequence'
    count: 4
  - name: 'The module matrix'
    count: 8
  - name: 'Masking, format info, and the capstone'
    count: 8
caveats:
  note: 'A fully working, spec-correct Version 1 (21x21) QR encoder across all four error-correction levels - real GF(256) arithmetic, Reed-Solomon error correction, bitstream encoding with padding, block interleaving, function-pattern layout, eight masks scored by the four penalty rules, and BCH format information - producing a grid a real scanner reads, wrapped in a runnable command-line tool; but it stops at Version 1, drives its end-to-end pipeline through alphanumeric mode (the byte-mode encoder is built but not wired into the full Encode path), and has no decoder.'
  future:
    - 'Wire the already-built byte-mode encoder into the end-to-end pipeline with real mode selection, and add numeric mode (three digits per 10 bits) to round out the common modes'
    - 'Support higher versions (2 through 40): larger grids, longer character-count fields, and the alignment patterns that appear from Version 2 on'
    - 'Connect the splitBlocks and interleave helpers to real multi-block capacity tables (Versions 5-Q and up split data into several blocks) instead of the single-block Version 1 case'
    - 'Add automatic version and mode selection: pick the smallest version and most compact mode that fits the input at the requested error-correction level'
    - 'Write a decoder as a companion project: image binarization, finder-pattern detection, perspective correction, and Reed-Solomon error correction to recover the data (and to round-trip-verify scannability)'
resources:
  - title: 'QR Code Tutorial'
    author: 'Thonky.com'
    url: 'https://www.thonky.com/qr-code-tutorial/'
    note: 'The clearest step-by-step walkthrough of encoding a QR symbol, and the source of this project''s worked example: it encodes HELLO WORLD as a Version 1-Q symbol all the way to the final matrix, with every codeword, error-correction codeword, and module shown. Check your values against it lesson by lesson.'
  - title: 'ISO/IEC 18004:2015 - QR Code bar code symbology specification'
    author: 'ISO/IEC'
    url: 'https://www.iso.org/standard/62021.html'
    note: 'The authoritative standard: the mode indicators, character-count bit lengths, error-correction block structure, the generator polynomials, the mask patterns and penalty rules, and the BCH format/version information. The final word when a tutorial is ambiguous.'
  - title: 'Reed-Solomon codes for coders'
    author: 'Wikiversity'
    url: 'https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders'
    note: 'A from-scratch, code-first derivation of exactly the Reed-Solomon variant QR uses: GF(256) arithmetic with the log/antilog tables, the generator polynomial, and encoding as polynomial remainder. The practical companion to this project''s middle chapters.'
  - title: 'Finite field arithmetic'
    author: 'Wikipedia'
    url: 'https://en.wikipedia.org/wiki/Finite_field_arithmetic'
    note: 'The GF(2^8) primer behind the first chapter: why addition is XOR, how multiplication reduces modulo an irreducible polynomial (QR uses 0x11D), and how the primitive element 2 generates the field through its powers.'
  - title: 'Creating a QR Code step by step'
    author: 'Nayuki'
    url: 'https://www.nayuki.io/page/creating-a-qr-code-step-by-step'
    note: 'An interactive, rigorously correct reference implementation with a live visualizer for every stage - segments, error correction, mask selection, and the final matrix. Excellent for cross-checking the layout and masking chapters.'
---
