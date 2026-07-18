---
project: build-an-agent-harness
lesson: 3
title: The request body
overview: A request to the Messages API is JSON containing a model name, a token limit, and the message list. Today you build that shape and pin exactly what it serializes to.
goal: Build a Request type with model, max_tokens, and messages, and confirm it serializes to the exact JSON bytes the real API expects.
spec:
  scenario: Serializing the request body
  status: failing
  lines:
    - kw: Given
      text: 'a request with model "claude-opus-4-8", max_tokens 1024, and one message: a user message with a single text block reading "What''s the weather in Paris?"'
    - kw: When
      text: the request is serialized to JSON
    - kw: Then
      text: 'the bytes are exactly {"model":"claude-opus-4-8","max_tokens":1024,"messages":[{"role":"user","content":[{"type":"text","text":"What''s the weather in Paris?"}]}]}'
    - kw: And
      text: 'the text block carries only its type and its text - the tool_use and tool_result fields lesson 1 front-loaded are absent from the JSON entirely, not present and empty'
code:
  lang: go
  source: |
    // the three fields every call needs. Note the union's unused fields must
    // not reach the wire at all - in Go that means omitempty on the block's
    // optional fields, added back in lesson 1's type
    type Request struct {
        Model     string     `json:"model"`
        MaxTokens int        `json:"max_tokens"`
        Messages  Transcript `json:"messages"`
    }
checkpoint: You can build a request and see exactly the JSON bytes it produces - the same three fields every call to the API needs. Commit and stop for today.
---

Everything you have built so far - messages, blocks, the transcript - exists to become the body of one HTTP request. The **request body** for `POST /v1/messages` is JSON with a small, fixed set of top-level fields, and the three you need today are `model`, which model answers; `max_tokens`, the most it may generate; and `messages`, the transcript itself.

Pin the exact serialized bytes today, not just the field names, because from lesson 4 onward every spec in this project asserts against real recorded response bytes, and the request side deserves the same discipline. A stray extra field or a wrongly-typed number here is invisible until the day you compare your bytes against something that actually matters.

The one thing that will bite you is lesson 1's front-loaded union. A text block has a `type` and a `text`, and that is all that may appear on the wire - the `tool_use` and `tool_result` fields you declared alongside them must vanish entirely for a block that is not using them, rather than turning up as empty strings. That is a real requirement of the format, not a detail of any one language: the API reads a block's `type` and expects the fields belonging to that type, nothing else. How you achieve it is your language's business - Go wants an `omitempty` on each optional field, while a language building a dictionary by hand simply never adds the keys - but the bytes are the bytes, and this is the lesson where that first becomes visible.
