---
project: build-an-agent-harness
lesson: 29
title: Trimming an over-long transcript
overview: A transcript that grows without bound eventually has to be cut, but cutting by raw message count can slice a tool_result away from its tool_use. Today you trim by whole exchanges instead, so that can never happen.
goal: Trim a transcript to its last N exchanges, keeping every exchange whole, and confirm this avoids the orphaned tool_result that trimming by raw message count causes.
spec:
  scenario: Trimming by exchanges instead of by raw message count
  status: failing
  lines:
    - kw: Given
      text: 'a transcript of 3 exchanges, 8 messages long - a user asking "What''s 2+2?" then an assistant answering "4."; a user asking about the weather in Paris, an assistant tool_use call, a user message carrying that call''s tool_result, then the assistant''s "72°F and partly cloudy." answer; and a user saying "Thanks!" then an assistant answering "You''re welcome!"'
    - kw: When
      text: the transcript is trimmed to its last 4 messages by raw message count
    - kw: Then
      text: 'the trimmed transcript''s first message is the user message carrying the tool_result "72°F, partly cloudy" - the assistant''s tool_use call, three messages earlier, was cut away, leaving that result answering a call that is no longer there'
    - kw: When
      text: the same original transcript is instead trimmed to its last 2 exchanges
    - kw: Then
      text: 'the trimmed transcript holds all 6 messages of those last two exchanges - the weather question, its tool_use call, its tool_result, its answer, then "Thanks!" and "You''re welcome!" - and its first message is the weather question itself, a fresh user message carrying no tool_result at all'
code:
  lang: go
  source: |
    // an exchange starts at a user message carrying NO tool_result block;
    // keep only the last `keep` exchanges, in full, never mid-exchange
    func TrimToLastExchanges(t Transcript, keep int) Transcript {
        return t // replace: find exchange starts, then slice from the Nth-last
    }
checkpoint: A transcript now trims to whatever length you choose without ever cutting a tool_result away from the tool_use it answers. Commit and stop for today.
---

Cutting a transcript down to its last N messages sounds like the obvious way to keep it a manageable size, but a `tool_result` message has no meaning on its own - it only makes sense as the answer to a `tool_use` block sitting in the message before it. Trim by raw count and you can easily slice right between the two, handing the model a transcript whose very first message answers a call that transcript no longer contains.

The fix is trimming by **exchange** instead of by message: an exchange starts at a fresh user message - one carrying no `tool_result` block at all, a genuinely new turn - and runs up to, but not including, the next one. A user message that only carries a `tool_result` is never a boundary, because it belongs to the exchange its `tool_use` opened, so every exchange is a complete, self-contained unit; keeping the last few of them whole can never orphan a result from its call. Note this needs no special case for the system prompt, either - it was never part of the transcript to begin with, all the way back to lesson 7, so there is nothing here that could ever trim it away.
