---
project: build-an-agent-harness
lesson: 34
title: Persisting a transcript
overview: A running conversation lives in memory only until the process exits. Today it becomes a JSON session file - and it has to save the system prompt too, since lesson 7 made that a field the transcript itself never carries.
goal: Build a PersistedSession holding the model, max_tokens, system prompt, and messages together, and persist one to JSON.
spec:
  scenario: Persisting model, system prompt, and messages together
  status: failing
  lines:
    - kw: Given
      text: 'a session with model "claude-opus-4-8", max_tokens 1024, the system prompt introduced in lesson 30 sent this time as a plain string, and a 4-message transcript - a user question about the weather in Paris, an assistant get_weather call with id "toolu_01L34PERSISTEXAMPLE1", a user message carrying that call''s result "72°F, partly cloudy", and the assistant''s final text "It''s 72°F and partly cloudy in Paris."'
    - kw: When
      text: 'the session is persisted to JSON and parsed back'
    - kw: Then
      text: 'the parsed session has exactly four fields - model, max_tokens, system, and messages - with none missing or empty'
    - kw: And
      text: 'its system field holds the full prompt text, even though that text appears nowhere inside its messages array'
    - kw: And
      text: 'its messages array holds the same 4 messages, in the same order and with the same tool_use id "toolu_01L34PERSISTEXAMPLE1", as the original session'
code:
  lang: go
  source: |
    // system is a request FIELD (lesson 7), not a message - persist it
    // alongside the messages or resuming loses it entirely
    type PersistedSession struct {
        Model     string
        MaxTokens int
        System    string // or raw JSON, whichever form was sent
        Messages  Transcript
    }
checkpoint: A conversation can now be written out whole - not just its messages but the system prompt beside them - and read back with nothing missing. Commit and stop for today.
---

Everything built so far lives only as long as the process runs: turn off the program and the conversation is gone. **Persisting** it means writing enough to a file that a later process could pick the exact same conversation back up, and the transcript alone is not enough for that - lesson 7 made the system prompt a top-level request field precisely so trimming could never touch it, but that same design means a plain dump of `messages` would silently leave it behind.

So a `PersistedSession` saves the whole request shape that matters: `model`, `max_tokens`, `system`, and `messages`, together. None of these are new ideas - you built every one of them in earlier chapters - today is only about bundling them into one thing that survives being written to disk and read back, ready for lesson 35 to prove the round trip is exact.
