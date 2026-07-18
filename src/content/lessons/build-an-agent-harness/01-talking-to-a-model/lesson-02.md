---
project: build-an-agent-harness
lesson: 2
title: The transcript
overview: The transcript is the ordered list of messages shared with the model on every request. Today you build it and the one operation it needs - appending a new message without disturbing what came before.
goal: Build a Transcript type over a list of messages, and an Append operation that returns a new transcript without mutating the original.
spec:
  scenario: Appending to a transcript
  status: failing
  lines:
    - kw: Given
      text: 'a transcript holding one message: a user message with a single text block reading "What''s the weather in Paris?"'
    - kw: When
      text: 'an assistant message with a single text block reading "Let me check." is appended'
    - kw: Then
      text: 'the returned transcript holds two messages: the original user message unchanged, then the new assistant message'
    - kw: And
      text: 'the original transcript variable still holds only its original one message - appending built a new transcript rather than modifying the old one'
code:
  lang: go
  source: |
    // Append must return a NEW transcript; the original must be untouched
    func (t Transcript) Append(msgs ...Message) Transcript {
        // make a slice sized len(t)+len(msgs), copy t into it, then append msgs
        return nil
    }
checkpoint: You can grow a transcript by one exchange without ever mutating an earlier snapshot of it. Commit and stop for today.
---

The **transcript** is the ordered history of everything said so far, and it is exactly what goes in the request's message list on every single call - the model has no memory of its own, so the whole conversation rides along each time. The only operation a transcript needs today is `Append`: take the messages so far, add one or more new ones, and hand back the result.

The detail worth getting right now is that appending must produce a **new** transcript rather than growing the old one in place. Held onto an earlier transcript for logging, replay, or a retry, and a later append silently changed it out from under you, you would have a very confusing bug on your hands. Build the copy in, and every later chapter that reasons about "the transcript before this turn" versus "the transcript after" can trust that the before-snapshot never moves.
