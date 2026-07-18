---
project: build-an-agent-harness
lesson: 19
title: Assembling text from deltas
overview: A streamed reply arrives as many small events instead of one object. Today you fold an ordered sequence of them into the exact same Response shape a non-streamed call would have produced.
goal: Fold an ordered sequence of parsed SSE events into a Response, concatenating its text deltas and reading its final stop_reason and usage back out.
spec:
  scenario: Folding a full stream into one assembled response
  status: failing
  lines:
    - kw: Given
      text: 'the parsed SSE events for one streamed reply, in order - a message_start carrying usage input_tokens 15; a content_block_start for an empty text block at index 0; three content_block_delta text_delta fragments at index 0, in order - "It''s 72", "°F and partly cloudy", " in Paris."; a content_block_stop at index 0; a message_delta setting stop_reason "end_turn" and usage output_tokens 12; then a message_stop'
    - kw: When
      text: the events are folded, in order, into a Response
    - kw: Then
      text: 'its stop_reason is "end_turn"'
    - kw: And
      text: 'concatenating the text of every text content block gives "It''s 72°F and partly cloudy in Paris." - the exact text lesson 5''s non-streamed response carried'
    - kw: And
      text: 'its usage reports 15 input tokens, read from the message_start event, and 12 output tokens, read from the message_delta event - two different event types each contributing one number'
code:
  lang: go
  source: |
    // fold events in order: a content_block_delta text_delta APPENDS to
    // that block's Text; a message_delta OVERWRITES StopReason and
    // Usage.OutputTokens
    for _, ev := range events {
        // dispatch on the parsed event's "type" field
    }
checkpoint: A streamed reply now folds into the identical Response your non-streamed lessons already built - text assembled, stop reason and usage both read back correctly. Commit and stop for today.
---

A stream never hands you the finished answer directly - it hands you fragments, and assembling is folding every one of them, in order, into the shape lesson 5 already knows how to read. A `text_delta` is the easy part: append its text onto whichever content block its `index` points to. The `message_delta` event is the one worth noticing, because it is the *only* place the final `stop_reason` and the completed `output_tokens` count show up; nothing earlier in the stream carries either.

That split matters because it means the assembled response is built from more than one event type, each contributing a piece nothing else in the stream repeats: `message_start` for the opening `input_tokens`, the `content_block_delta` events for the text itself, and `message_delta` for how it all ended. Miss folding any one of them and the assembled response is silently incomplete, even though every individual event you read was parsed correctly.
