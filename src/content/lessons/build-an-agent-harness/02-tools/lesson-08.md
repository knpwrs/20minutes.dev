---
project: build-an-agent-harness
lesson: 8
title: A tool definition
overview: A tool has two halves - the description the model reads, and the function your code runs. Today you build both for a single tool the model has never seen before.
goal: Define a Tool type carrying a name, a description, an input_schema, and the function that runs it, and build the get_weather tool.
spec:
  scenario: A tool definition - name, description, input_schema
  status: failing
  lines:
    - kw: Given
      text: 'a tool named "get_weather" with description "Get the current weather for a city." and an input_schema requiring one string property "location" described as "City name, e.g. Paris"'
    - kw: When
      text: the tool is inspected
    - kw: Then
      text: 'its name is "get_weather" and its description is "Get the current weather for a city."'
    - kw: And
      text: 'its input_schema reports type "object", exactly one required property "location", and that property''s type is "string" with description "City name, e.g. Paris"'
    - kw: And
      text: 'the tool also carries a function that, given the input location "Paris", returns the string "72°F, partly cloudy" - and that function is not part of the definition sent to the model'
code:
  lang: go
  source: |
    // the wire-facing definition AND the function behind it, in one type.
    // the function is tagged so it never serializes into the request.
    type ToolFunc func(input map[string]any) (string, error)
    type Tool struct {
        Name        string
        Description string
        InputSchema map[string]any `json:"input_schema"` // a JSON Schema object
        Fn          ToolFunc       `json:"-"`             // local only, never sent
    }
checkpoint: You can describe a tool the model can call and hold the function that answers it, in one value with a clean split between what the model sees and what your code runs. Commit and stop for today.
---

Everything the model knows about a tool, it knows from one description sent with the request: a `name` it will use to ask for that tool, a `description` in plain language telling it what the tool is for, and an `input_schema` - an ordinary JSON Schema object - spelling out exactly what arguments it takes. There is no separate registration step on the model's side; this one definition is the entire contract.

Get the schema right and the model reads it like documentation: which arguments are required, what type each one is, and a human-readable hint about what to put there. Get it wrong - a missing `required`, a vague description - and the model still calls the tool, just with arguments that do not mean what you expected.

A tool has a second half the model never sees: the **function that actually runs**. The model reads the description and asks for the tool by name; your code is what looks up the weather and returns a string. Both halves belong to the same tool, so they live in the same value - but only the description half is ever serialized into a request. Keep the function beside the definition from the start (tagged so it stays off the wire), and the dispatch lesson a few days from now has something real to call, rather than having to bolt an executable side onto a definition that was only ever paperwork.
