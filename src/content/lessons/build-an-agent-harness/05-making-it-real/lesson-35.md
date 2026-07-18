---
project: build-an-agent-harness
lesson: 35
title: Resuming from a transcript
overview: A persisted session is only useful if loading it reproduces the exact conversation it was saved from. Today you load lesson 34's session back and prove the round trip is exact, then keep the conversation going.
goal: Load a persisted session back and confirm it exactly matches what was saved, then append one more turn and continue the conversation.
spec:
  scenario: A lossless round trip, then one more turn
  status: failing
  lines:
    - kw: Given
      text: 'the session persisted in lesson 34'
    - kw: When
      text: 'it is loaded back from its JSON bytes'
    - kw: Then
      text: 'the loaded session exactly matches the original - same model, same max_tokens, same system prompt, and the same 4 messages in the same order'
    - kw: When
      text: 'a new user message "And tomorrow?" is appended to the loaded transcript and the loop runs one more turn against a server that replies "Tomorrow in Paris looks similar: around 70°F and partly cloudy."'
    - kw: Then
      text: 'the loop stops with reason "end_turn", and the resulting transcript holds exactly 6 messages - the original 4, then the new user question, then the assistant''s new reply'
    - kw: And
      text: 'that new reply''s text is exactly "Tomorrow in Paris looks similar: around 70°F and partly cloudy." - the conversation continued from exactly where it was saved, not from scratch'
code:
  lang: go
  source: |
    resumed := ResumeSession(persistedBytes) // reverses PersistSession exactly
    transcript := resumed.Messages.Append(UserMessage(TextBlock("And tomorrow?")))
    // then call RunLoop as usual, using resumed.System and this transcript
checkpoint: Resuming a saved session now reproduces the exact conversation it came from and lets it carry on from there. Commit and stop for today.
---

Building `PersistedSession` proved nothing about whether loading one back actually works - a persist function that quietly drops a field or mangles a message would look fine until you tried to resume from it. Today closes that loop: load lesson 34's session back and check it matches the original, field for field, message for message, before trusting it with anything else.

That check is only half the point, though. A resumed session that just sits there parsed is not really a conversation - it has to be able to *continue*. Append one new user message to the loaded transcript, run the loop one more turn, and the model answers as though it had been there the whole time, because as far as the request is concerned, it has: the system prompt, the tool call, its result, and the earlier reply all ride along exactly as they did before the process ever stopped.
