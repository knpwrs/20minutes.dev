---
project: build-an-agent-harness
lesson: 12
title: Dispatching a tool call
overview: A tool_use block names a tool and gives its arguments. Dispatching looks that tool up and runs it for real. Today you wire a tool_use block through to a function call and read back its answer.
goal: Dispatch a tool_use block through the registry to the tool's function, and get back a tool_result block carrying its answer.
spec:
  scenario: Dispatching a known tool call
  status: failing
  lines:
    - kw: Given
      text: 'the registry from lesson 9, whose get_weather tool answers "72°F, partly cloudy" for location "Paris"'
    - kw: And
      text: 'a tool_use block with id "toolu_01A09q90qw90lq917835lq9", name "get_weather", and input {"location": "Paris"}'
    - kw: When
      text: the call is dispatched
    - kw: Then
      text: 'the result is a tool_result block whose tool_use_id is "toolu_01A09q90qw90lq917835lq9" and whose content is "72°F, partly cloudy"'
code:
  lang: go
  source: |
    // Dispatch: look up call.Name, run its function on call.Input, and wrap
    // the answer in a tool_result block carrying call.ID
    func (r *Registry) Dispatch(call ContentBlock) ContentBlock {
        return ContentBlock{}
    }
checkpoint: A tool_use block can now run for real and come back as a tool_result, correlated to the call that asked for it. Commit and stop for today.
---

A `tool_use` block is a request, and **dispatching** is honouring it: look up the named tool in the registry, hand it the block's `input` as arguments, and run the actual function behind it - a real weather lookup, a real file read, whatever the tool does. Nothing here is model-side; from this point the model is out of the picture until you send an answer back.

The one detail to carry forward is the block's `id`. It means nothing on its own, but it is how the model correlates a result to the call that produced it once several calls are in flight at once, which chapter 3 will ask you to handle. Carry that same id straight through onto the `tool_result` block you build today, unchanged, even though right now there is only ever one call to correlate.
