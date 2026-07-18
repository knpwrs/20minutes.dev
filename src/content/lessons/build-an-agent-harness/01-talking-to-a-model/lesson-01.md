---
project: build-an-agent-harness
lesson: 1
title: 'A message: role and content'
overview: A message is a role plus a list of content blocks. Today you define all three block shapes - text, tool_use, tool_result - even though two of them stay unused until chapter 2.
goal: Define the Message type and the full content-block union, then build a user message holding one text block.
spec:
  scenario: 'The full content-block union, three shapes'
  status: failing
  lines:
    - kw: Given
      text: 'a text block whose text is "What''s the weather in Paris?"'
    - kw: And
      text: 'a tool_use block whose id is "toolu_01A09q90qw90lq917835lq9", name is "get_weather", and input is {"location": "Paris"}'
    - kw: And
      text: 'a tool_result block whose tool_use_id is "toolu_01A09q90qw90lq917835lq9" and content is "72°F, partly cloudy"'
    - kw: When
      text: 'a message is built with role "user" and the text block as its only content'
    - kw: Then
      text: 'the message''s role is "user" and its content holds exactly one block'
    - kw: And
      text: 'that block''s type is "text" and its text is "What''s the weather in Paris?"'
    - kw: And
      text: 'the tool_use block''s type is "tool_use" and its id, name, and input are unchanged from how it was built'
    - kw: And
      text: 'the tool_result block''s type is "tool_result" and its tool_use_id and content are unchanged from how it was built'
code:
  lang: go
  source: |
    // one struct covers all three block shapes; unused fields sit at zero value
    type ContentBlock struct {
        Type, Text                   string
        ID, Name, ToolUseID, Content string
        Input                        map[string]any
        IsError                      bool
    }
checkpoint: You have the full content-block union and a Message type that wraps it in a role, and you have built one of each shape. Commit and stop for today.
---

Every exchange with the model is a list of **messages**, and every message is just two things: a **role** - `user` or `assistant` - and a list of **content blocks**. The content block, though, is not one shape. It is a union of three: `text` for ordinary words, `tool_use` for the model asking to run something, and `tool_result` for reporting what happened. Real API responses mix these freely inside a single message's content list.

Building all three today, rather than growing the type later, means nothing about this project's data shape changes when tools show up in chapter 2 - only which fields get populated does. The `tool_use` and `tool_result` blocks you build today sit at their zero values in every message until then; that is the deliberate front-load, not dead code waiting to be deleted.
