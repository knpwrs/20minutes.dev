---
project: build-a-jpeg-codec
lesson: 5
title: The APP0 / JFIF header
overview: The first real segment in a typical JPEG is APP0, carrying the JFIF header that identifies the file and its pixel density. Today you parse it, reading your first structured segment payload.
goal: Parse an APP0 segment payload into its JFIF identifier, version, density units, and X and Y density.
spec:
  scenario: Parsing the JFIF APP0 payload
  status: failing
  lines:
    - kw: Given
      text: 'an APP0 payload beginning with the bytes 0x4A,0x46,0x49,0x46,0x00 then 0x01,0x02 then 0x01 then 0x00,0x48 then 0x00,0x48'
    - kw: When
      text: the APP0 payload is parsed
    - kw: Then
      text: 'the identifier is "JFIF", the version is 1.2, the density units code is 1, and the X and Y density are both 72'
    - kw: And
      text: 'a payload whose first five bytes are not "JFIF\0" is reported as not a JFIF header'
code:
  lang: go
  source: |
    // APP0 (0xE0) JFIF payload layout:
    //   5 bytes  "JFIF\0"
    //   1 byte   version major     1 byte version minor
    //   1 byte   density units (0=none, 1=dpi, 2=dpcm)
    //   2 bytes  X density (BE)    2 bytes Y density (BE)
    //   ...thumbnail fields follow
    type JFIF struct{ VerMajor, VerMinor, Units byte; Xd, Yd int }
checkpoint: You can read the JFIF header from an APP0 segment. Commit and stop here.
---

A JFIF file puts its identity in the very first application segment, **APP0** (marker code `0xE0`). Its payload starts with the five bytes `4A 46 49 46 00`, which is the ASCII string `JFIF` followed by a `0x00` terminator. After that come a **version** (a major and a minor byte, here `01 02` meaning version 1.2), a **density units** byte (`0` = no units, `1` = dots per inch, `2` = dots per centimetre), and the **X and Y density** as two big-endian 16-bit values (`00 48` = 72 each). Thumbnail dimensions follow but you can ignore them.

This is your first structured payload, and the pattern - read fixed fields in order, big-endian for multi-byte integers - is the same one every later table and header uses. The identifier check matters: an application segment that does not begin with `JFIF\0` might be `Exif` or something else entirely, and a decoder should recognize that rather than misread another vendor's bytes as a JFIF header.
