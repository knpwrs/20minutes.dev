---
project: build-an-agent-harness
lesson: 6
title: The conversation loop
overview: Every exchange follows the same shape - send the transcript, read the reply, append it, and decide whether to continue. Today that loop becomes a runnable program talking to the real API for the first time.
goal: Build a loop that sends a transcript, appends the reply, and stops once the reply is not asking for a tool, then wire it into a program you can run.
spec:
  scenario: Running one turn of the conversation loop
  status: failing
  lines:
    - kw: Given
      text: a transcript holding one user message asking about the weather in Paris, and a server that will reply with the pinned end_turn response from lesson 5
    - kw: When
      text: the conversation loop runs against that transcript
    - kw: Then
      text: 'the loop stops after exactly 1 turn, reporting stop reason "end_turn"'
    - kw: And
      text: 'the final transcript holds two messages: the original user message, then a new assistant message whose text is "It''s 72°F and partly cloudy in Paris."'
code:
  lang: go
  source: |
    // Each turn: send, parse, append the reply, decide whether to continue.
    // Lesson 4's client hands back a raw HTTP response and lesson 5 parses it,
    // so the loop does both - it does not get a parsed reply for free.
    for {
        // send the request built from the transcript, then parse the body
        // into the Response type from lesson 5
        transcript = transcript.Append(resp.ToAssistantMessage())
        if resp.StopReason != "tool_use" {
            break
        }
        // ch2 will dispatch tools here and loop again
    }
checkpoint: Your program now sends a real request, reads a real reply, and stops correctly - the CLI talks to the live model from today onward. Commit and stop for today.
---

Everything you have built so far - the message, the transcript, the request, the client, the parsed response - exists to run inside one loop: send the transcript, read what comes back, append it, and decide whether to go around again. Today's version only ever needs one trip, because nothing you can send yet asks for a tool, but the shape is the real one; chapter 2 extends this same loop rather than replacing it.

Wire this loop into an actual entry point - a small program that takes a question, builds the starting transcript, and runs the loop against your configured client. From today the project is a walking skeleton: point it at the real API with a real key, and it holds an actual conversation with a live model, even though it cannot yet do anything but talk.
