---
project: build-an-agent-harness
lesson: 22
title: 'max_tokens: handling a truncated reply'
overview: A reply can stop because it ran out of room to keep generating, not because it was actually finished. Today the loop learns to tell that apart from a real end_turn and never dispatch on it.
goal: Extend the loop so a stop_reason of max_tokens is reported as a distinct truncated result, never treated as a finished end_turn.
spec:
  scenario: A truncated reply is never mistaken for a finished one
  status: failing
  lines:
    - kw: Given
      text: 'a transcript holding one user message asking about the weather in Paris, and a server that replies with a response whose content is a single text block reading "The weather in Paris is 72°F and it looks like it will remain" - cut off mid-sentence - and whose stop_reason is "max_tokens"'
    - kw: When
      text: the loop runs
    - kw: Then
      text: 'the loop stops after exactly 1 turn with reason "truncated" - never "end_turn", even though the reply''s content is otherwise a well-formed response'
    - kw: And
      text: 'the last response''s text is still readable as the cut-off "The weather in Paris is 72°F and it looks like it will remain", but the loop does not continue the conversation as though this were a finished answer'
code:
  lang: go
  source: |
    // classify by stop_reason FIRST - before looking at what content holds
    case StopMaxTokens:
        return LoopResult{
            Transcript: t, Stop: LoopTruncated,
            Turns: turns, LastResp: resp,
        }
checkpoint: A cut-off reply now gets reported for what it is - truncated, not finished - and the loop never mistakes an incomplete answer for a real one. Commit and stop for today.
---

`stop_reason: "max_tokens"` means the model was still generating when it ran out of room, not that it decided it was done. The content that came back can look perfectly ordinary - a text block reading like the start of a real sentence - which is exactly what makes it dangerous to treat like any other reply: nothing about the shape of the response tells you it is incomplete, only the `stop_reason` does.

Handle this by checking `stop_reason` before reacting to anything inside `content`, and return a distinct result - this project calls it `truncated` - rather than folding it into the same branch as `end_turn`. That ordering is not incidental: if a truncated block happened to be a `tool_use` instead of text, its `input` could be an incomplete JSON fragment, unsafe to dispatch. Classifying by `stop_reason` first, before any content-specific handling runs, is what keeps a cut-off `tool_use` from ever being dispatched at all.
