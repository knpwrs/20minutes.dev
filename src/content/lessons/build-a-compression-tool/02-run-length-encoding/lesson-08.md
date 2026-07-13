---
project: build-a-compression-tool
lesson: 8
title: Decoding packets, and the round trip
overview: A codec is a pair. Today you write the RLE decoder that expands packets back to bytes, teaching it both packet types up front, and confirm the run codec round-trips.
goal: Decode a packet stream back to bytes and show encode then decode is identity.
spec:
  scenario: A run packet expands and the round trip holds
  status: failing
  lines:
    - kw: Given
      text: 'the packet stream 0x85, 0x41'
    - kw: When
      text: 'RLE Decode runs over it'
    - kw: Then
      text: 'the output is the six bytes AAAAAA'
    - kw: And
      text: 'for any input, Decode(Encode(input)) equals input'
code:
  lang: go
  source: |
    func Decode(p []byte) []byte {
      var out []byte
      for i := 0; i < len(p); {
        ctrl := p[i]; i++
        if ctrl&0x80 != 0 { // run: repeat one byte
          n := int(ctrl&0x7F) + 1
          for k := 0; k < n; k++ { out = append(out, p[i]) }
          i++
        } else { // literal: copy the next n bytes (used next lesson)
          n := int(ctrl) + 1
          out = append(out, p[i:i+n]...); i += n
        }
      }
      return out
    }
checkpoint: The run codec round-trips; the decoder already understands both packet kinds. Commit and stop here.
---

Decoding walks the packet stream one packet at a time. Read a **control byte**,
look at its high bit to decide the packet kind, act on it, and move to the next
control byte. For a run, the low seven bits plus one give the count, and the
single value byte that follows is emitted that many times: `0x85, 0x41` expands to
`AAAAAA`.

Teach the decoder **both** packet kinds now, even though the encoder only emits
runs so far. A control byte with its high bit clear is a **literal** packet: the
low seven bits plus one give a count, and that many following bytes are copied
verbatim. Building the full decoder up front means the next lesson only has to add
the encoder's choice between the two - the reader never changes again. With decode
in place you can state the codec's real contract: `Decode(Encode(input))` returns
the original bytes, exactly, for every input.
