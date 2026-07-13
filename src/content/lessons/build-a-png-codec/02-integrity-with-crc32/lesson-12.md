---
project: build-a-png-codec
lesson: 12
title: 'Verifying every chunk'
overview: With per-chunk validation in hand, you can vet a whole file. Today you extend the chunk walk to check every CRC and fail fast on the first corrupt chunk, so nothing downstream ever sees bad data.
goal: Walk a PNG and confirm every chunk's CRC, returning an error that names the first chunk whose CRC does not match.
spec:
  scenario: Validating a full file
  status: failing
  lines:
    - kw: Given
      text: 'a PNG whose IHDR, IDAT, and IEND chunks all carry correct CRCs'
    - kw: When
      text: the file is verified
    - kw: Then
      text: it reports all chunks valid
    - kw: And
      text: 'if one byte inside the IDAT data is flipped, verification fails with an error naming the IDAT chunk'
code:
  lang: go
  source: |
    func Verify(b []byte) error {
      chunks, err := Chunks(b)
      if err != nil { return err }
      for _, c := range chunks {
        if !c.Valid() { return fmt.Errorf("bad CRC in %s chunk", c.Type) }
      }
      return nil
    }
checkpoint: The decoder verifies an entire PNG and pinpoints the first corrupt chunk. Commit and stop here.
---

This closes the integrity chapter with a single guarantee: run `Verify` and either every chunk is sound or you learn exactly which one is not. It reuses the chunk walk from chapter one and the per-chunk `Valid` check, and the naming matters - "bad CRC in IDAT chunk" tells a caller precisely where the damage is, which is far more useful than a bare failure. A corrupt byte in the compressed image data is caught here, before the inflater ever tries to make sense of it.

You now have a container you can fully trust: recognized by signature, split into chunks, and every chunk proven intact. That trust is the foundation the hard part stands on. The next chapter opens the `IDAT` payload and begins the real work - turning that compressed zlib stream back into raw bytes.
