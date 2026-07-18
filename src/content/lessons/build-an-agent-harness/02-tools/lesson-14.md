---
project: build-an-agent-harness
lesson: 14
title: The tool loop
overview: The chapter 1 loop only ever needed one turn, because nothing asked for a tool. Today a tool_use reply sends it around twice - dispatch, return the result, and read the model's real answer.
goal: Extend the loop so a tool_use reply gets dispatched and its result sent back, before asking the model again for its real answer.
spec:
  scenario: Two turns through the tool loop
  status: failing
  lines:
    - kw: Given
      text: a transcript holding one user message asking about the weather in Paris
    - kw: And
      text: 'a server that replies first with lesson 11''s tool_use response, then with a final response whose text is "It''s 72°F and partly cloudy in Paris right now." and whose stop_reason is "end_turn"'
    - kw: When
      text: the loop runs
    - kw: Then
      text: 'it takes exactly 2 turns and stops with reason "end_turn"'
    - kw: And
      text: 'the final transcript holds 4 messages in order - the user question, the assistant''s text-plus-tool_use reply, a user message holding the tool_result, then the assistant''s final text'
code:
  lang: go
  source: |
    // when stop_reason is "tool_use": dispatch every tool_use block, append
    // their results in ONE user message, and loop again instead of returning
    if resp.StopReason == "tool_use" {
        results := registry.DispatchAll(resp.ToolUseBlocks())
        transcript = transcript.Append(UserMessage(results...))
        continue
    }
checkpoint: Your loop now handles a tool call end to end - ask, run, report back, and get the real answer. Commit and stop for today.
---

Every piece from this chapter now slots into the loop lesson 6 built: when a reply's `stop_reason` is `tool_use` instead of returning, extract its tool_use blocks, dispatch each one through the registry, wrap the results in a single user message, append it, and go around again. The loop does not need to know it is handling a tool call specially - it is the same "send, append, decide whether to continue" shape, just with one more branch.

Today's example only ever goes around twice: once to get the tool request, once to get the model's real answer once it has seen the result. That is exactly the walking-skeleton case the loop was built for back in chapter 1, now doing something an agent actually needs to do - reach outside itself, get an answer, and use it.
