---
project: build-an-agent-harness
lesson: 23
title: A turn limit
overview: Nothing so far stops a model that keeps calling tools forever. Today the loop gets its own turn limit - a client-side guard the API itself has no concept of.
goal: Add a MaxTurns option that stops the loop before starting another turn once the limit is reached, reporting a max_turns result distinct from any real stop reason.
spec:
  scenario: The loop stops itself once its turn limit is reached
  status: failing
  lines:
    - kw: Given
      text: a transcript holding one user message asking about the weather in Paris, a server that would keep replying with a get_weather tool_use call forever if asked, and a loop configured with a turn limit of 2
    - kw: When
      text: the loop runs
    - kw: Then
      text: 'the loop stops with reason "max_turns" after exactly 2 turns, never asking the model a third time'
    - kw: And
      text: 'the transcript holds exactly 5 messages - two complete round trips of an assistant tool_use followed by a user tool_result, after the original question - and nothing from a third turn'
code:
  lang: go
  source: |
    // check the limit BEFORE sending another request, not after
    if maxTurns > 0 && turns >= maxTurns {
        return LoopResult{Transcript: t, Stop: LoopMaxTurns, Turns: turns}
    }
    turns++
checkpoint: The loop can no longer run away on a model that keeps calling tools - it stops itself at a limit you choose, and says so distinctly. Commit and stop for today.
---

Every stop reason you have handled up to now came from the model - `end_turn`, `tool_use`, `pause_turn`, `max_tokens`. A turn limit is different: it belongs entirely to your harness. The real API has no concept of "too many turns"; a model that keeps finding reasons to call another tool will happily do so forever, and only your own loop can decide enough is enough.

The check has to run before the next request goes out, not after a reply comes back, or the limit would always let one extra turn slip through. And the result it produces, `max_turns`, is worth keeping distinct from `end_turn` or `truncated` even though all three end the loop the same way - a caller inspecting why the conversation stopped needs to tell "the model finished" apart from "we cut it off ourselves" apart from "the model got cut off mid-generation." Three different reasons the loop can end, and now the harness can report all three honestly.
