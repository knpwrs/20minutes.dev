---
project: build-an-agent-harness
lesson: 20
title: Streaming tool arguments as partial JSON
overview: A tool_use block's arguments stream in as raw JSON fragments that can split mid-token, not at tidy boundaries. Today you buffer them per block and parse only once the block is complete.
goal: Buffer a tool_use block's input_json_delta fragments per content-block index and parse the concatenated result exactly once, at that block's content_block_stop.
spec:
  scenario: Assembling tool arguments split mid-token
  status: failing
  lines:
    - kw: Given
      text: 'a tool_use block at content index 1, id "toolu_01STREAMEXAMPLE00000001" and name "get_weather", whose argument bytes arrive as three input_json_delta fragments, in order - fragment one: {"loca ; fragment two: tion": "Par ; fragment three: is"} - the second fragment splits both the key name and the opening of the string value mid-token'
    - kw: When
      text: each fragment is fed to the assembler as it arrives
    - kw: Then
      text: parsing any single one of the three fragments on its own as JSON fails - none of them is valid JSON by itself
    - kw: And
      text: 'once this block''s content_block_stop arrives, concatenating all three buffered fragments and parsing that ONE string gives the input {"location": "Paris"}'
code:
  lang: go
  source: |
    // one buffer per content-block index; each input_json_delta appends
    // its partial_json onto that index's buffer
    buffers := map[int]string{}

    // parse a block's buffered string into JSON exactly once - at ITS
    // content_block_stop, never on an individual delta
checkpoint: Tool arguments now assemble correctly even when the JSON is cut apart mid-token, because nothing gets parsed before its block is actually complete. Commit and stop for today.
---

Text deltas are forgiving - any prefix of a sentence is still readable text. A `tool_use` block's arguments are not: they stream in as `input_json_delta` fragments carrying raw JSON text, and the API splits that text wherever the token boundary happens to fall, including in the middle of a key name or partway through opening a string's quote. `{"loca`, on its own, is not JSON. Neither is `tion": "Par`. Only the full concatenation, `{"location": "Paris"}`, parses.

That rules out parsing on every delta as they arrive - it would throw on the very first fragment of nearly every real tool call. The fix is to keep a separate buffer per content-block `index`, since a reply can stream a text block and a `tool_use` block's arguments at once, append each fragment's raw text onto its own block's buffer, and only hand the accumulated string to a JSON parser once that block's `content_block_stop` event says it is finished. Get this ordering right and streamed tool calls parse exactly as reliably as the non-streamed ones from chapter 2.
