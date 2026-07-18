---
project: build-an-agent-harness
lesson: 30
title: Prompt caching with cache_control
overview: Caching turns a stable prefix of a request - like a long system prompt - into something the API only has to process once. Today you mark that prefix and see exactly where the marker has to sit.
goal: Build a request whose system prompt is cached, with cache_control ephemeral on the last block of the array-of-blocks system field.
spec:
  scenario: Marking the system prompt's cached prefix
  status: failing
  lines:
    - kw: Given
      text: 'the long stable system prompt "You are a careful, concise assistant with access to weather and time tools. Always use a tool rather than guessing at real-world facts like weather or the current time. When you are not confident a tool applies, answer directly instead.", sent as a single array-of-blocks system entry with cache_control ephemeral on that block, alongside the two-tool registry from lesson 9 and the one Paris-weather message from lesson 3'
    - kw: When
      text: 'the request is serialized to JSON'
    - kw: Then
      text: 'the top-level "system" field is an array holding exactly one block, whose type is "text", whose text is that exact prompt, and whose cache_control is {"type": "ephemeral"}'
    - kw: And
      text: 'neither the "messages" array nor any entry in the "tools" array carries a cache_control key - the marker sits on that one system block alone'
code:
  lang: go
  source: |
    type SystemBlock struct {
        Type, Text   string
        CacheControl *CacheControl `json:"cache_control,omitempty"`
    }
    // the marker goes on the LAST block of the system array - never on a
    // message or a tool. Note: your system field has been a plain string
    // since lesson 7; to carry blocks it must now accept both forms (in Go,
    // widen it to `any`), so the old string requests still serialize as before
checkpoint: The system prompt now rides along with a cache_control marker on its one block, and you know exactly why that placement is not arbitrary. Commit and stop for today.
---

Every request you have built so far resends the entire conversation from scratch, and the model reprocesses all of it every single time - including a system prompt that has not changed since the first turn. **Prompt caching** lets the API skip that reprocessing for a prefix you mark as stable: send `cache_control: {"type": "ephemeral"}` on a content block, and everything up to and including that block becomes eligible to be reused on a later request, rather than paid for again.

The reason placement is not arbitrary is that caching is a **prefix match**: the API only reuses what it cached if a later request sends the identical bytes, in the identical order, up to the marked block. Change one word earlier in the system prompt, reorder a tool, add a message before it - anything upstream of the marker - and the whole cached prefix is invalidated for that request. That is why the marker sits on the *last* block of whatever you want reused, here the system prompt's one-and-only block, rather than somewhere in the middle where an earlier edit could quietly break it.
