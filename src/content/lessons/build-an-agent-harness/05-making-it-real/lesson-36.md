---
project: build-an-agent-harness
lesson: 36
title: 'Capstone: an agent with a real toolset'
overview: Nothing new today - every mechanism this project built composes into one agent - a system prompt, a several-tool registry, parallel tool calls, and the loop that ties them together.
goal: Assemble a full agent - system prompt, a three-tool registry including one that requires approval, and the loop - and run it through a question that dispatches two tools in parallel.
spec:
  scenario: The full agent handles two parallel tool calls in one turn
  status: failing
  lines:
    - kw: Given
      text: 'a registry holding get_weather, get_time, and send_email (the last requiring approval), the system prompt from lesson 30, and a user message asking for the weather and time in Paris'
    - kw: And
      text: 'a server that replies first with two tool_use calls in the same turn - get_weather then get_time, both for Paris - and then, once it has both results, a final text turn combining them'
    - kw: When
      text: 'the loop runs'
    - kw: Then
      text: 'it stops after exactly 2 turns with reason "end_turn"'
    - kw: And
      text: 'the assistant''s first turn carries exactly 2 tool_use blocks, in order get_weather then get_time, and the user message right after carries both of their results in that same order, in one message'
    - kw: And
      text: 'the final reply''s text is exactly "It''s 72°F and partly cloudy in Paris, and the local time there is 14:32 CET." - one answer built from both parallel calls'
code:
  lang: go
  source: |
    // compose the pieces you already built - no new machinery today.
    // register the read-only tools plus one that needs approval (the
    // RequiresApproval + Fn fields from lessons 8 and 32), put the system
    // prompt on the request, and hand both to the approval-aware loop:
    registry.Register(weatherTool)
    registry.Register(timeTool)
    registry.Register(sendEmailTool) // its RequiresApproval field is set
    // RunWithApproval(client, req, registry, approve) - req carries System
checkpoint: You have a working agent - a system prompt, several tools, parallel dispatch, and an approval-capable registry all running through one loop. Running it against a live model needs an API key you supply yourself; every spec you have written along the way, including today's, never needed one. Commit and stop for today.
---

There is no new idea today. Every piece this project built - the message shape from chapter 1, the tool registry and dispatch from chapter 2, parallel tool calls landing in one message from chapter 3, the turn limits and the loop's control flow from chapter 4, caching, the approval gate, and persistence from this chapter - assembles into one agent: a system prompt steering it, a registry of real tools it can call, one of which cannot run without approval, and the same loop from lesson 6 driving all of it.

Today's spec asks that assembled agent a question that needs two tools at once, and checks that the whole chain still holds together exactly as each piece promised on its own: both calls dispatched from one reply, both results landing in one following message, and a final answer that draws on both. The one honest gap left is that running this for real, against the live API, needs an API key you provide yourself - every test in this project, including this one, has run against recorded responses instead, which is how you would build an agent for real anyway.
