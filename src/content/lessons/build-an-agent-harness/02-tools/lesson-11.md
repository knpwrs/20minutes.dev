---
project: build-an-agent-harness
lesson: 11
title: A tool_use block
overview: When the model wants a tool instead of just answering, its reply carries a tool_use block alongside any text, and stops for reason tool_use. Today you parse that reply and pull its tool_use blocks out.
goal: Parse a reply that mixes a text block with a tool_use block, and extract just the tool_use blocks in order.
spec:
  scenario: A reply asking for a tool
  status: failing
  lines:
    - kw: Given
      text: 'the pinned response whose content is a text block reading "I''ll check the weather in Paris for you." followed by a tool_use block with id "toolu_01A09q90qw90lq917835lq9", name "get_weather", and input {"location": "Paris"}, and whose stop_reason is "tool_use"'
    - kw: When
      text: the response is parsed and its tool_use blocks are extracted
    - kw: Then
      text: 'stop_reason is "tool_use", not "end_turn" - the model is not done, it is waiting on a tool'
    - kw: And
      text: 'there is exactly one tool_use block, whose name is "get_weather" and whose input.location is "Paris"'
    - kw: And
      text: 'concatenating the text content still gives "I''ll check the weather in Paris for you." - the text block is untouched by the tool_use block sitting alongside it'
code:
  lang: go
  source: |
    // ToolUseBlocks: filter Content down to blocks whose Type is "tool_use",
    // preserving Content order
    func (r Response) ToolUseBlocks() []ContentBlock {
        var out []ContentBlock
        return out
    }
checkpoint: You can tell a reply that wants a tool from one that is finished, and pull out exactly the calls it is making. Commit and stop for today.
---

This is the moment the content-block union you front-loaded in lesson 1 starts paying for itself. A reply asking for a tool is not a special message type - it is an ordinary response whose `content` array happens to include one or more `tool_use` blocks, often right alongside a `text` block where the model narrates what it is about to do. The signal that something needs running is `stop_reason: "tool_use"`, not the mere presence of a block.

Write the extraction as a filter over `Content` - keep the blocks whose type is `tool_use`, in the order they appear - rather than assuming a fixed position. Today's reply only ever has one, but chapter 3 pins down replies with several tool_use blocks side by side, and this same filter has to keep working unchanged when that happens.
