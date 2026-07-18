---
project: build-an-agent-harness
lesson: 18
title: 'Streaming: server-sent events'
overview: The API can stream a reply as a sequence of Server-Sent Events instead of one JSON blob. Today you parse the raw byte format into an ordered list of frames, each carrying an event type and one line of JSON.
goal: Parse a raw SSE byte stream into an ordered list of events, each holding its event type and its JSON data line.
spec:
  scenario: Splitting a raw SSE byte stream into frames
  status: failing
  lines:
    - kw: Given
      text: 'a raw SSE byte stream holding three frames back to back - each written as an "event:" line, then a "data:" line, then a blank line: first "event: content_block_delta" with data {"delta":{"text":"It''s 72","type":"text_delta"},"index":0,"type":"content_block_delta"}; second "event: content_block_delta" with data {"delta":{"text":"°F and partly cloudy","type":"text_delta"},"index":0,"type":"content_block_delta"}; third "event: content_block_stop" with data {"index":0,"type":"content_block_stop"}'
    - kw: When
      text: the raw stream is parsed
    - kw: Then
      text: 'there are exactly 3 events, in order'
    - kw: And
      text: 'the first event''s type is "content_block_delta" and its data is exactly {"delta":{"text":"It''s 72","type":"text_delta"},"index":0,"type":"content_block_delta"}'
    - kw: And
      text: 'the third event''s type is "content_block_stop" and its data is exactly {"index":0,"type":"content_block_stop"}'
code:
  lang: go
  source: |
    // SSEEvent is one frame: its event type and raw JSON data line
    type SSEEvent struct {
        Event string
        Data  string
    }
    // split raw bytes on blank lines into frames, then each frame into its
    // "event: " line and its "data: " line
checkpoint: You can turn a raw SSE byte stream into an ordered list of typed frames - the foundation every later streaming lesson folds into a response. Commit and stop for today.
---

Every reply you have parsed so far arrived as one complete JSON object. The real API can instead **stream** a reply as it is generated, and the wire format for that is Server-Sent Events: a sequence of small frames, each one an `event:` line naming what kind of frame it is, a `data:` line holding one line of JSON, and a blank line marking where the frame ends. Nothing about a message, a transcript, or a response changes - this is a new way of *delivering* the same information, piece by piece.

Parsing today is pure splitting, nothing more: cut the raw bytes on blank lines to get each frame, then read that frame's `event:` and `data:` lines back out. The payoff is not in today's lesson - it is that a real stream can carry dozens of these frames in a row, and every one of the next three lessons only works because you can already turn any number of them into an ordered list you can iterate over one at a time.
