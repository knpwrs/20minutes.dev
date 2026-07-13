---
project: build-a-wav-pcm-toolkit
lesson: 17
title: Building the whole file
overview: Time to assemble a complete, valid WAV. Today you wrap the fmt payload and data bytes in the data chunk and RIFF header, computing every size field, and honour the padding byte for odd data.
goal: Assemble a full WAV file from a Format and data bytes, with correct sizes and padding.
spec:
  scenario: A complete WAV file is assembled with correct sizes
  status: failing
  lines:
    - kw: Given
      text: 'mono 8000 Hz 16-bit and the 8 data bytes 00 00 FF 7F 00 80 FF FF'
    - kw: When
      text: 'the file is built'
    - kw: Then
      text: 'the first 44 bytes are the reference header (RIFF size 44, data size 8) and bytes 44..51 are the data'
    - kw: And
      text: 'building from 3 odd-length data bytes appends one 0x00 padding byte (file even-length) while the data size field stays 3'
code:
  lang: go
  source: |
    func buildFile(f Format, data []byte) []byte {
      riffSize := 4 + (8 + 16) + (8 + len(data))   // "WAVE" + fmt chunk + data chunk
      if len(data)%2 != 0 { riffSize++ }           // padding byte counts toward RIFF size
      // "RIFF" | u32 riffSize | "WAVE"
      // "fmt " | u32 16 | buildFmt(...)
      // "data" | u32 len(data) | data | (pad byte if odd)
    }
checkpoint: You can build a complete, valid WAV file. Commit and stop here.
---

Assembly is bookkeeping, and the bookkeeping is the size fields. The **data chunk**
is `"data"`, a little-endian size equal to the number of data bytes, then the bytes.
The **RIFF size** at offset 4 covers everything after those first eight bytes:
`"WAVE"` (4) plus the whole `fmt ` chunk (8 + 16) plus the whole `data` chunk (8 +
data length). For our reference file that is `4 + 24 + 16 = 44`, and the data size
is `8` - reproducing the exact header you parsed back in chapter one, byte for byte.

The one subtlety is the **padding byte** from lesson 7, now on the writing side. If
the data length is **odd**, append a single `0x00` after it so the file stays
word-aligned, and count that pad byte in the RIFF size - but **not** in the data
chunk's own size field, which always reports the true, odd payload length. So 3 data
bytes produce a file with a trailing pad (even total length) whose `data` size still
reads `3`. Get the sizes right and any WAV reader on earth will open your file.
