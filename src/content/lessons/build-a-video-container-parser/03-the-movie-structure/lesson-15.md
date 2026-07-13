---
project: build-a-video-container-parser
lesson: 15
title: The track header id and flags
overview: Each track has a tkhd box giving its id and whether it is enabled. Today you read the track id and decode the enabled flag from the FullBox flags, your first look at a per-track box.
goal: Parse a tkhd box to its track id and enabled flag.
spec:
  scenario: A tkhd yields a track id and an enabled flag
  status: failing
  lines:
    - kw: Given
      text: 'a version-0 tkhd whose flags are 0x000003, with track_id 0x00 0x00 0x00 0x01 at payload offset 12'
    - kw: When
      text: 'the tkhd is parsed'
    - kw: Then
      text: 'the track id is 1 and Enabled is true (flags bit 0 is set)'
    - kw: And
      text: 'a tkhd whose flags are 0x000000 parses to Enabled false'
code:
  lang: go
  source: |
    // version 0: after the 4-byte prefix come
    // creation(4) modification(4) track_id(4) ...
    func parseTkhd(payload []byte) (trackID uint32, enabled bool) {
      _, flags := parseFullBox(payload)
      enabled = flags&0x000001 != 0 // bit 0 = track_enabled
      // track_id is the uint32 at offset 12
    }
checkpoint: You can parse a tkhd id and enabled flag. Commit and stop here.
---

`tkhd`, the track header, identifies one track. Its **track_id** is a small unique
number the sample tables and references use to point at this track. Like `mvhd` it
is a FullBox, and in version 0 the track_id sits at payload offset 12, after
creation and modification times.

The FullBox **flags** carry meaning here rather than being decoration: bit 0 is
`track_enabled`. A track with that bit clear is present in the file but should not
be played, so a faithful parser surfaces it. Reading `flags & 1` tells you whether
the track is on. Next you decode the track's display size, which is stored in an
unusual fixed-point form.
