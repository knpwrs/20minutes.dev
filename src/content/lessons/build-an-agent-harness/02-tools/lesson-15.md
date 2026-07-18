---
project: build-an-agent-harness
lesson: 15
title: 'A failing tool: is_error'
overview: Not every tool call succeeds, and a failure is never dropped - it goes back as a tool_result the model can see, marked is_error true. Today you dispatch a call the tool rejects and confirm exactly what comes back.
goal: Dispatch a tool_use call whose arguments the tool function rejects, and confirm the result is a tool_result with is_error true, still correlated to the call.
spec:
  scenario: Dispatching a call the tool rejects
  status: failing
  lines:
    - kw: Given
      text: 'the registry''s get_weather tool, which has no data for location "Atlantis"'
    - kw: And
      text: 'a tool_use block with id "toolu_01BADCALL0000000000000", name "get_weather", and input {"location": "Atlantis"}'
    - kw: When
      text: the call is dispatched
    - kw: Then
      text: 'the result is a tool_result block whose tool_use_id is still "toolu_01BADCALL0000000000000" - the failure is correlated to its call, never dropped'
    - kw: And
      text: its is_error is true
    - kw: And
      text: 'its content is exactly error: no weather data for location "Atlantis"'
code:
  lang: go
  source: |
    // Dispatch already exists (lesson 12) - now the tool function itself can
    // return an error; wrap it as a tool_result with IsError true, keeping ID
    result, err := t.Fn(call.Input)
    if err != nil {
        return ToolResultBlock(call.ID, "error: "+err.Error(), true)
    }
checkpoint: A failing tool call now comes back as an ordinary tool_result with is_error true, still tied to its call id, so the model can see it and adapt. Commit and stop for today.
---

A tool can fail for reasons that have nothing to do with your code - a location that does not exist, an argument outside what the tool supports. When that happens, dispatching must not crash and must not quietly swallow the call. It produces an ordinary `tool_result`, exactly like a success, with one difference: `is_error` set to `true`, and its `content` describing what went wrong.

This matters because the model is the one that reads it next. A dropped or crashed call leaves the model waiting on a reply that never comes; an `is_error` result lets it see the failure and decide what to do - try different arguments, ask the user for clarification, or give up gracefully. The `tool_use_id` still has to match the call, for exactly the same reason it mattered in lesson 12: the model needs to know which of its requests this failure answers.
