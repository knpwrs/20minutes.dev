---
project: build-an-agent-harness
lesson: 9
title: The tool registry
overview: A registry holds every tool the agent knows about, in the order they were registered - the same order the request will send them in. Today you build it, register two tools, and read them back.
goal: Build a registry that stores tools in registration order and can look any of them up by name.
spec:
  scenario: Registering and listing tools in order
  status: failing
  lines:
    - kw: Given
      text: an empty registry, with the get_weather tool registered first and the get_time tool registered second
    - kw: When
      text: the registry's definitions are listed
    - kw: Then
      text: 'there are exactly 2 definitions, in registration order - "get_weather" first, "get_time" second'
    - kw: When
      text: 'a tool is looked up by the name "get_time"'
    - kw: Then
      text: 'it is found, and its description is "Get the current local time for a city."'
    - kw: When
      text: 'a tool is looked up by the name "get_directions"'
    - kw: Then
      text: it is not found
code:
  lang: go
  source: |
    type Registry struct {
        tools map[string]Tool
        order []string // registration order
    }

    func (r *Registry) Register(t Tool) {
        // append to order only the first time this name is seen
    }
checkpoint: The registry remembers every tool you register, in order, and can hand any one of them back by name. Commit and stop for today.
---

The **registry** is where every tool your agent can offer lives before it ever reaches a request: register each one once at startup, then ask it for two things later - the full list of definitions to send, and any single tool by name when a call for it comes in. Neither operation needs to be clever; a map gets you the lookup, but a map alone throws away the order you registered things in.

Keep that order, because it becomes the order the model sees the tools in on every request from lesson 10 onward, and a stable order is one less thing to reason about when comparing two requests. Today's registry only ever grows - nothing here removes a tool - so registering the same name twice can simply mean the newer definition replaces the old one without disturbing its position in the list.
