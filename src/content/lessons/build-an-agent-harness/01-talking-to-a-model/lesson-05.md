---
project: build-an-agent-harness
lesson: 5
title: Reading the response
overview: A response has its own content blocks, a stop_reason explaining why it stopped, and a token usage count. Today you parse one and build the helper that reads its text back out.
goal: Parse a pinned response and read its stop_reason, its usage, and its text content back out.
spec:
  scenario: Parsing a response
  status: failing
  lines:
    - kw: Given
      text: 'the JSON response {"id":"msg_01L4example000000000000","type":"message","role":"assistant","model":"claude-opus-4-8","content":[{"type":"text","text":"It''s 72°F and partly cloudy in Paris."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":15,"output_tokens":12}}'
    - kw: When
      text: the response is parsed
    - kw: Then
      text: 'its stop_reason is "end_turn"'
    - kw: And
      text: 'concatenating the text of every text content block gives "It''s 72°F and partly cloudy in Paris."'
    - kw: And
      text: its usage reports 15 input tokens and 12 output tokens
code:
  lang: go
  source: |
    type Response struct {
        Content    []ContentBlock
        StopReason string
        Usage      struct{ InputTokens, OutputTokens int }
    }

    // TextContent: concatenate every block whose Type is "text", in order
checkpoint: You can parse any pinned response and read back exactly why it stopped, what it cost, and what it said. Commit and stop for today.
---

The response the model sends back mirrors the request's shape: a list of content blocks, plus two fields nothing you send has - `stop_reason`, which says *why* generation ended, and `usage`, a count of tokens spent on both sides of the exchange. Parse the whole thing today, even though only `text` blocks are populated until chapter 2.

Build the one helper you will lean on constantly from here forward: concatenating every `text` block's text, in content order, into the reply's plain-language answer. It looks trivial today because a response only ever holds one text block, but writing it as "concatenate every text block, skipping anything else" rather than "read content[0].text" is what lets it keep working once a reply's content array starts mixing text with the blocks chapter 2 introduces.
