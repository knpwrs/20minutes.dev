---
title: 'Build a MIDI Parser'
order: 30
lessons: 30
size: 'Small'
tech: ['Standard MIDI File', 'Variable-length quantities', 'Running status']
estMin: 20
desc: 'Build a real Standard MIDI File parser from first principles: read the MThd header and MTrk track chunks, decode variable-length delta-times, parse every channel voice message with running status, handle meta events and system-exclusive data, then assemble tracks of timed events into a song model - absolute ticks, a tempo map, note-on paired with note-off into notes, and ticks converted to seconds. It ends in a library that turns raw SMF bytes into a song of tracks, tempo, time signature, and notes, plus a midinfo-style inspector. This is a parser, not a player: there is no audio synthesis or real-time playback.'
blurb: 'Turn a byte-exact .mid file into a structured song you can assert against. Every lesson is one concrete spec with exact bytes and values: a variable-length quantity 0x81 0x00 decodes to 128, a note-on with velocity 0 is really a note-off, a bare data byte reuses the previous status (running status), set-tempo bytes 0x07 0xA1 0x20 mean 500000 microseconds per quarter note and 120 BPM, and 96 ticks at that tempo and division is exactly half a second. No audio - the deliverable is the parse tree, not sound.'
overview: |
  Over 30 lessons you build a working Standard MIDI File parser from scratch: a library that reads raw SMF bytes and returns a structured song of tracks and timed events. You start at the container - the MThd header chunk (format, track count, and the division field) and the MTrk track chunks framed by a 4-byte length - then decode the variable-length quantities that encode every delta-time, the classic tricky bit of the format.

  From there you parse the event stream: the status byte whose high nibble is the message and low nibble the channel, note-off and note-on (with velocity-0 note-on treated as note-off), control change, program change, pressure, and 14-bit pitch bend, all with running status where a bare data byte reuses the previous status. You add meta events (set-tempo, time signature, key signature, track name, end-of-track) and system-exclusive data, then assemble tracks into a timed song: absolute ticks accumulated from deltas, a tempo map, note-on paired with its matching note-off into notes, and ticks converted to seconds and beats. The capstone parses an embedded format-1 file and reports its tracks, tempo in BPM, time signature, and note list with tick and second timings.

  This is a parser and inspector, not a player: it turns bytes into a song model exactly, but it does no audio synthesis and no real-time playback - there is no sound at any point. It is a teaching-grade library built around the Standard MIDI File 1.0 specification, honest about where it stops: it reads the common format 0 and 1 files, treats the parsed structure as the product, and leaves synthesis, SMPTE-timed playback, and the long tail of rare meta and manufacturer SysEx messages as extensions. The finished repo also ships a small midinfo-style inspector that dumps the header, per-track events, tempo and time signature, and a note summary of any file.
parts:
  - name: 'The SMF container'
    count: 6
  - name: 'Delta-times and channel voice events'
    count: 11
  - name: 'Meta events and system exclusive'
    count: 6
  - name: 'Assembling the timed song'
    count: 7
caveats:
  note: 'The parser and midinfo inspector handle the full chunk/event/meta grammar and fail gracefully on corrupt input, but SMPTE-division timing and true multi-tempo-change second math are not implemented.'
  future:
    - 'Integrate seconds across tempo-map segments instead of assuming the current tempo held since tick 0'
    - 'Convert SMPTE division (frames per second, ticks per frame) to seconds, not just the metrical PPQN mode'
    - 'Give the fixed-length meta decoders (set-tempo, time and key signature) their own specific truncation errors instead of a generic malformed-input message'
    - 'Add a machine-readable inspector output mode (CSV like the real midicsv, or JSON)'
    - 'Handle overlapping same-pitch notes with no intervening note-off instead of silently orphaning the first note-on'
    - 'Explicitly out of scope, not merely unfinished: real playback - audio synthesis, MIDI-out device support, and real-time scheduling'
resources:
  - title: 'Standard MIDI Files 1.0 (RP-001)'
    author: 'MIDI Manufacturers Association'
    url: 'https://midi.org/standard-midi-files-specification'
    note: 'The authoritative container specification: the MThd and MTrk chunk layout, the variable-length quantity encoding of delta-times, running status, and the full meta-event catalogue. Keep it open beside every lesson.'
  - title: 'Summary of MIDI 1.0 Messages'
    author: 'The MIDI Association'
    url: 'https://midi.org/summary-of-midi-1-0-messages'
    note: 'The status-byte and data-byte tables for every channel voice message - note-on/off, control change, program change, pressure, and pitch bend - and the system messages. The reference for how many data bytes each status takes.'
  - title: 'Standard MIDI File Format'
    author: 'David Back (somascape)'
    url: 'http://www.somascape.org/midi/tech/mfile.html'
    note: 'A readable, exact walkthrough of the file format with worked byte examples of chunks, variable-length quantities, running status, and meta events - the practical companion to the official spec.'
  - title: 'Standard MIDI-File Format Spec 1.0 (annotated)'
    author: 'mirrored at McGill MUMT 306'
    url: 'http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html'
    note: 'A clean HTML mirror of the original specification text, convenient for looking up a meta-event type byte or the division-field encoding without a PDF.'
  - title: 'midicsv and csvmidi'
    author: 'John Walker (Fourmilab)'
    url: 'https://www.fourmilab.ch/webtools/midicsv/'
    note: 'A tool that losslessly converts a Standard MIDI File to and from a readable CSV of its events - the inspiration for the inspector this project finishes with, and a handy oracle for checking your own parse.'
---
