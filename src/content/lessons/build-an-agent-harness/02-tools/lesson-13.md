---
project: build-an-agent-harness
lesson: 13
title: Returning a tool_result
overview: A tool_result goes back to the model inside a user message, never an assistant one - the one detail that is easy to get backwards. Today you wrap yesterday's result in the message that gets sent.
goal: Wrap a tool_result block in a user message, and confirm the role is user even though a tool ran, not the person.
spec:
  scenario: Wrapping a tool_result for sending back
  status: failing
  lines:
    - kw: Given
      text: 'the tool_result block from lesson 12, whose tool_use_id is "toolu_01A09q90qw90lq917835lq9" and whose content is "72°F, partly cloudy"'
    - kw: When
      text: it is wrapped into the next message to send to the model
    - kw: Then
      text: 'the message''s role is "user", not "assistant" - the result is reported back as if the user supplied it'
    - kw: And
      text: the message's content holds exactly that one tool_result block
code:
  lang: go
  source: |
    // tool results ride back to the model inside a role "user" message
    func toolResultMessage(results ...ContentBlock) Message {
        return UserMessage(results...)
    }
checkpoint: A tool's answer now goes back to the model in the message shape it actually expects. Commit and stop for today.
---

You have a `tool_result` block; now it has to travel back to the model, and it travels inside a **message**, the same way every other content block does. The detail that catches people off guard is the role that message carries: `user`, not `assistant`. The assistant was the one that asked for the tool; the answer to that request is reported back as though the user were the one supplying it, because from the model's point of view the next thing it reads is new information arriving from outside its own turn.

Wrapping today's single result is the simple case. Once several tool calls come back from one reply, chapter 3 pins down where every one of their results has to land, and getting today's wrapping right - one message, role `user`, holding the result block - is the base case that rule builds on.
