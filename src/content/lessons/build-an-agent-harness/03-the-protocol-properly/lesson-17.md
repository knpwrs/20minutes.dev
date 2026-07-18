---
project: build-an-agent-harness
lesson: 17
title: Every result in one user message
overview: When a reply carries several tool_use blocks, every one of their results must ride back in a single user message, not split across several. Today you build the correct shape and see exactly what a split one looks like.
goal: Wrap every result from one assistant turn into one single user message, and confirm a split version is a different, malformed shape.
spec:
  scenario: One message for every result from a turn, never split
  status: failing
  lines:
    - kw: Given
      text: 'the two tool_result blocks from lesson 16, in call order - one correlated to "toolu_01PARALLELWEATHER00001" with content "72°F, partly cloudy", the other to "toolu_01PARALLELTIME000002" with content "14:32 CET"'
    - kw: When
      text: both results are wrapped the correct way, as one single next message
    - kw: Then
      text: 'that message''s role is "user" and its content holds exactly both tool_result blocks, in the same order they were dispatched'
    - kw: When
      text: the same two results are instead wrapped the wrong way, as two separate user messages, one result each
    - kw: Then
      text: 'the transcript now holds two consecutive user messages instead of one - meaning only the first tool_use block''s result actually lands in the message immediately after the assistant''s turn, while the second sits by itself one message later, answering nothing that comes right after it'
code:
  lang: go
  source: |
    // CORRECT: every result from this turn goes in ONE message, in order
    t = t.Append(UserMessage(results...))

    // WRONG - never do this: splitting one turn's results across messages
    // t = t.Append(UserMessage(results[0])).Append(UserMessage(results[1]))
checkpoint: Every result from a turn now travels back in exactly one message, and you can point to precisely what a split version gets wrong. Commit and stop for today.
---

A `tool_use` block only ever gets its answer from the message that comes immediately after the assistant turn that asked for it. When one turn asks for two tools at once, both of their `tool_result` blocks belong in that same next message - because "immediately after" only happens once. Split them into two separate user messages instead, and the second call's result no longer sits in the message right after the turn that made the call; it sits in a message of its own, one step later, answering nothing that follows it directly.

The real Messages API treats a split like this as a malformed request and rejects it outright - this project has not verified the exact wording it uses, so that wording has no place here, but the requirement itself is not optional: every `tool_use` in a turn gets its `tool_result` in the very next message, and every result from that turn goes into that one message together. Building the correct shape today, and seeing precisely how the split version drifts from it, is what makes that rule stick.

Expect to write no new production code today. The helpers from earlier lessons already build the correct shape; the whole lesson is holding it up against the wrong one and being able to name the difference. If you find yourself hunting for something to add to the message or loop code, that is the sign you have already got it - the lesson lives in the contrast, not in a new function.
