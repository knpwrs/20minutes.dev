---
project: build-an-agent-harness
lesson: 16
title: Several tool calls in one reply
overview: A single reply can carry more than one tool_use block side by side. Today DispatchAll runs every one of them and hands back their results in the same order the model asked for them.
goal: Dispatch a reply carrying two tool_use blocks and confirm the results come back in call order, correlated to the right calls.
spec:
  scenario: Dispatching two parallel tool calls from one reply
  status: failing
  lines:
    - kw: Given
      text: 'a response whose content is two tool_use blocks, in this order - first id "toolu_01PARALLELWEATHER00001" name "get_weather" input.location "Paris", then id "toolu_01PARALLELTIME000002" name "get_time" input.location "Paris" - and whose stop_reason is "tool_use"'
    - kw: And
      text: 'the registry from lesson 9, whose get_weather answers "72°F, partly cloudy" and whose get_time answers "14:32 CET" for Paris'
    - kw: When
      text: the response''s tool_use blocks are extracted and dispatched all at once
    - kw: Then
      text: 'there are exactly 2 tool_use blocks, in content order - get_weather first, get_time second'
    - kw: And
      text: 'dispatching returns exactly 2 tool_result blocks, in that same order - the first correlated to "toolu_01PARALLELWEATHER00001" with content "72°F, partly cloudy", the second correlated to "toolu_01PARALLELTIME000002" with content "14:32 CET"'
code:
  lang: go
  source: |
    // DispatchAll runs every call, IN CONTENT ORDER, and returns their
    // tool_result blocks in that same order
    func (r *Registry) DispatchAll(calls []ContentBlock) []ContentBlock {
        var out []ContentBlock
        for _, call := range calls {
            out = append(out, r.Dispatch(call))
        }
        return out
    }
checkpoint: A reply asking for several tools at once now runs every one of them and reports back in the order they were asked. Commit and stop for today.
---

Nothing so far has stopped a reply from asking for more than one tool at once - `ToolUseBlocks` already filters the whole content array, and `Dispatch` already handles one call at a time. What chapter 3 adds is the case where that array actually holds two, or more, `tool_use` blocks side by side, because the model decided it needed both the weather and the time in the same breath rather than asking for them one at a time.

`DispatchAll` is barely more than a loop over `Dispatch`, but the loop's order is the part worth being deliberate about: run the calls in the order they appear in `content`, and return their results in that same order. The model matches each result back to its call by `tool_use_id`, not by position, so nothing breaks if you got the order wrong today - but tomorrow's lesson pins down exactly where all of these results have to land, and a stable, predictable order is one less thing to reason about once that rule is in play.
