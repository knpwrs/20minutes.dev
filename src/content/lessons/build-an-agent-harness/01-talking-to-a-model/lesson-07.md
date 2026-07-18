---
project: build-an-agent-harness
lesson: 7
title: The system prompt
overview: The system prompt sets the model's behaviour, and it sits outside the message list entirely. Today it becomes its own top-level request field - one that can never be trimmed away.
goal: Add a top-level system field to the request, separate from messages, and confirm the message list is untouched by it.
spec:
  scenario: Adding a system prompt
  status: failing
  lines:
    - kw: Given
      text: 'a request with system "You are a helpful assistant with access to tools. Use them when they would help answer the user''s question." and the same model, max_tokens, and one message as lesson 3'
    - kw: When
      text: the request is serialized to JSON
    - kw: Then
      text: the JSON has a top-level "system" field holding that exact text
    - kw: And
      text: the "messages" array is exactly the same single user message as lesson 3, unaffected by adding a system field
    - kw: And
      text: the system text appears nowhere inside "messages" - it was never a message, so it can never be trimmed out of the transcript later
    - kw: When
      text: 'the conversation loop from lesson 6 runs a full turn against the pinned end_turn response, carrying that system prompt'
    - kw: Then
      text: 'the final transcript still holds exactly two messages - the user message and the assistant reply - and neither of them is a system message'
    - kw: And
      text: 'the system prompt is still sent on that turn, and would be sent again on every later turn - the loop never appends it and never has to remember it'
code:
  lang: go
  source: |
    // a sibling of Messages, not an entry in it. omitempty keeps it off the
    // wire entirely when unset, so lesson 6's loop keeps working untouched
    type Request struct {
        Model     string
        MaxTokens int
        System    string `json:"system,omitempty"`
        Messages  Transcript
    }
checkpoint: The system prompt rides along on every request as its own field, and you have watched a full turn go by without it ever entering the transcript. Commit and stop for today.
---

The **system prompt** tells the model how to behave for the whole conversation - its persona, its constraints, what it should reach for tools to do. It is tempting to picture it as the first message in the transcript, but the real API treats it as something else entirely: a top-level field on the request, sitting beside `messages`, never inside it.

This placement is worth internalising now because of what it rules out later. A value that was never part of the transcript cannot be dropped by anything that edits the transcript - not a trimming pass, not a summarizer, not a bug in how you build the message list. Chapter 4 builds a mechanism that shortens an over-long transcript, and it never needs a special case to "preserve the system prompt," because the system prompt was never sitting in the list it trims.

That is why today's spec does not stop at the serialized bytes. Run a whole turn through lesson 6's loop with a system prompt set, and then count the transcript: two messages, neither of them a system message, while the prompt itself still went out on the request. The loop never appended it and never had to. Plenty of harnesses do model the system prompt as message zero and then grow a careful little rule to protect it from every transcript operation that comes later - an entire category of bug that this one placement decision deletes before it can exist.
