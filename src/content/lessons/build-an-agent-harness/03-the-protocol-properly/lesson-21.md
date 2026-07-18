---
project: build-an-agent-harness
lesson: 21
title: 'pause_turn: resuming a server-side tool'
overview: A reply can stop for reason pause_turn mid-turn, without asking your code to run anything. Today you resume it correctly - by asking again with nothing new added, not by sending another user message.
goal: Extend the loop to resume a pause_turn reply by re-sending with the paused assistant message appended and no new user message, then confirm the resulting transcript can hold two assistant messages back to back.
spec:
  scenario: Resuming a paused turn with no new user message
  status: failing
  lines:
    - kw: Given
      text: 'a transcript holding one user message asking about the weather in Paris, and a server that replies first with a paused response - text "Let me search for the current weather in Paris..." and stop_reason "pause_turn" - then with a final response - text "It''s 72°F and partly cloudy in Paris right now." and stop_reason "end_turn"'
    - kw: When
      text: the loop runs
    - kw: Then
      text: 'it takes exactly 2 turns and stops with reason "end_turn"'
    - kw: And
      text: 'the final transcript holds exactly 3 messages, in order - the user question, the paused assistant text, then the final assistant text - two assistant messages back to back with no user message between them'
    - kw: And
      text: 'the second request sent to the model has a messages array of exactly 2 entries - the user question and the paused assistant text - no new user message was added to resume the pause'
code:
  lang: go
  source: |
    // the paused assistant message is already appended above; loop again
    // WITHOUT appending any new user message. Match the wire stop_reason the
    // same way the tool_use branch already does - a plain string here
    case "pause_turn":
        // nothing else to do - just go around again
checkpoint: A paused turn now resumes exactly the way the API expects - by asking again with nothing new added - and your transcript can correctly hold two assistant messages in a row. Commit and stop for today.
---

Every stop reason you have handled so far expects something from you before you ask again: `tool_use` wants a result appended, an ordinary `end_turn` just ends. `pause_turn` is different - it means the model is running a tool on the server's own side and simply has not finished, and resuming means asking again with *nothing new*, not even a user message standing in for "continue."

That breaks a pattern you might have started relying on without noticing: transcripts alternating strictly between `user` and `assistant`. Once a paused turn resolves, the transcript holds the paused assistant message immediately followed by the assistant's real answer - two assistant messages back to back, no user turn between them. Nothing about `Append` or the loop's shape needs to change to allow this; it was already general enough. What changes is recognising that `pause_turn` is a legitimate reason to loop again without adding anything, distinct from every other branch you have written.
