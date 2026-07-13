---
title: 'Build a Video Container Parser'
order: 26
lessons: 29
size: 'Small'
tech: ['ISO BMFF', 'Box parsing', 'Container formats']
estMin: 20
desc: 'Walk an MP4 file''s box tree: headers, sample tables, and a track-and-codec summary.'
blurb: 'Parse MP4 the way ffprobe does: no library calls, just bytes. Every lesson is one concrete spec with exact values - a box header of size 24 and type ftyp, a size==1 box reading a 64-bit largesize, a FullBox version byte selecting 32- versus 64-bit mvhd fields, a 16.16 fixed-point width 0x01400000 decoding to 320.0, a duration of 132300 over a timescale of 44100 giving exactly 3.0 seconds, a per-sample stsz table versus one shared size, and a 64-bit co64 chunk offset. It stays fully offline and deterministic, so the parser you write is the same in any language.'
overview: |
  Over 29 lessons you build a working parser for the MP4 / ISO Base Media File Format, walking raw bytes into a structured box tree and a per-track media summary. MP4 is the one container whose layout is cleanly exact-byte parseable - every box is a 4-byte big-endian size followed by a 4-byte type (a fourcc), then a payload - so every lesson has concrete input bytes and an exact expected value, and the parser you write is identical in any language. Other containers (Matroska/EBML, Ogg) are noted but out of scope; the depth is in MP4.

  You start with a single box header and grow outward: the 64-bit largesize and size-to-end-of-file special cases, the ftyp brand box, then the recursive box tree with container-versus-leaf handling, the FullBox version-and-flags prefix, unknown boxes skipped opaquely, and malformed sizes guarded so a bad file errors instead of looping. On that tree you decode the movie header (mvhd), track header (tkhd, with 16.16 fixed-point dimensions), media header (mdhd, with packed language), and handler (hdlr), then every sample table - stsd, stts, stsc, stsz, stco/co64, and stss. The capstone parses an embedded tiny MP4 and prints its brand, box tree, and a per-track summary of type, codec, dimensions, and duration.

  This is a teaching-grade reference parser: it reads the structural boxes exactly and produces a faithful box tree plus a track summary (handler, codec fourcc, dimensions, duration in seconds) and can locate any sample's byte offset and size. It deliberately stops short of decoding elementary streams (no H.264/AAC bitstream decode), fragmented-MP4 (moof/mfra) and edit lists, and the many optional metadata boxes - the same honest core that a real inspector like mp4box or ffprobe extends.
parts:
  - name: 'The box'
    count: 6
  - name: 'The box tree'
    count: 6
  - name: 'The movie structure'
    count: 6
  - name: 'The sample tables'
    count: 7
  - name: 'Putting it together'
    count: 4
caveats:
  note: 'The parser fully and correctly reads a standard (non-fragmented) MP4 box tree, headers, and sample tables and exposes them through both a library API and a small ffprobe-style inspector CLI, but it stops at locating samples rather than decoding them and has no support for streaming or fragmented MP4 files.'
  future:
    - 'Fragmented MP4 support (moof / traf / trun / tfhd / mfra) for DASH, HLS, and CMAF-style segmented files'
    - 'Edit lists (elst) and tkhd matrix / rotation interpretation for correct timing and orientation'
    - 'Richer stsd parsing: all sample entries plus codec-config boxes (avcC, hvcC, esds) for exact codec strings'
    - 'Elementary-stream extraction and decode - use the sample-location math to pull and interpret real frame bytes (H.264 NAL units, AAC frames)'
    - 'Metadata boxes (udta / meta / ilst) for title, artist, and cover-art tags'
    - 'A streaming, large-file reader over io.Reader with seeking instead of loading the whole file into memory'
resources:
  - title: 'ISO/IEC 14496-12: ISO Base Media File Format'
    author: 'ISO/IEC'
    url: 'https://www.iso.org/standard/83102.html'
    note: 'The normative specification for the box structure this project parses - boxes, FullBoxes, the movie and track hierarchy (moov, trak, mdia, minf, stbl), and every sample table. Every field and default here traces back to this document.'
  - title: 'MP4 Registration Authority (MP4RA)'
    url: 'https://mp4ra.org/'
    note: 'The official registry of fourcc codes: box types, brands (isom, mp42, iso2), handler types (vide, soun), and codec sample-entry formats (avc1, mp4a). The lookup table for the four-character codes you will read out of the bytes.'
  - title: 'QuickTime File Format Specification'
    author: 'Apple Inc.'
    url: 'https://developer.apple.com/documentation/quicktime-file-format'
    note: 'MP4 descends from the QuickTime file format, and Apple documents the atom (box) layouts in fuller prose than the ISO text - especially the sample tables (stsd, stts, stsc, stsz, stco) and the 16.16 fixed-point and matrix fields.'
  - title: 'Let''s build an MP4 parser'
    author: 'various'
    url: 'https://www.w3.org/TR/mse-byte-stream-format-isobmff/'
    note: 'The W3C ISO BMFF byte-stream format note distills the exact box tree a media engine needs (ftyp, moov/trak/mdia/minf/stbl, moof for fragments) into a readable, practical walkthrough of the box structure.'
  - title: 'MP4 file format explained (box/atom structure)'
    author: 'MDN Web Docs / community writeups'
    url: 'https://en.wikipedia.org/wiki/ISO_base_media_file_format'
    note: 'A readable, diagram-first overview of the size+type box header, the container-versus-leaf split, and how the movie hierarchy nests - a friendly orientation before the ISO spec.'
---
