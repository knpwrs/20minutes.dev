---
project: build-an-agent-harness
lesson: 10
title: Sending tools with the request
overview: The model can only call a tool it was told about on that exact request. Today you add the tools array to the request body, and confirm an empty registry sends none at all.
goal: Add a tools field to the request, populated from the registry's definitions in order, and confirm it is omitted entirely when there are no tools.
spec:
  scenario: Adding tools to the request body
  status: failing
  lines:
    - kw: Given
      text: a request with model, max_tokens, and the one Paris-weather message from lesson 3, plus the two-tool registry from lesson 9
    - kw: When
      text: the request is serialized to JSON
    - kw: Then
      text: 'the JSON has a "tools" array with exactly 2 entries, in registration order - "get_weather" first, "get_time" second'
    - kw: And
      text: the "messages" array is unaffected by adding tools
    - kw: When
      text: the same request is built from an empty registry instead
    - kw: Then
      text: the serialized JSON has no "tools" key at all - not an empty array, omitted entirely
code:
  lang: go
  source: |
    type Request struct {
        Model     string
        MaxTokens int
        Messages  Transcript
        Tools     []Tool `json:"tools,omitempty"`
    }
checkpoint: Your request now tells the model exactly which tools it may call, and says nothing at all when there are none. Commit and stop for today.
---

A tool definition only matters to the model if it rides along on the request that needs it - there is no separate "teach the model about this tool" step. Today you add a `tools` array to the request body, filled straight from the registry's `Definitions()` in the order lesson 9 already pins down.

The edge worth confirming today is the empty case. A request with no tools registered should produce a body with no `tools` key at all, not `"tools": []`. It is a small distinction, but plenty of code accidentally sends an empty array where the field should be absent, and while the real API tolerates either, getting into the habit of an honestly-empty request body now pays off the day you are debugging exactly what a request contained.
