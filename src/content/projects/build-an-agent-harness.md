---
title: Build an Agent Harness
order: 57
lessons: 36
size: Medium
tech:
  - Tool calling
  - Agent loop
  - Streaming
estMin: 20
desc: 'Build the loop behind every AI agent: tool calls, streaming, retries, budgets, and an approval gate.'
blurb: 'An agent is a loop around a model that can call your code. Build that loop against a real API - tool dispatch, streaming, retries, cancellation, caching and a permission gate - and the magic turns into plumbing you understand.'
overview: |
  Everything an AI agent does sits inside a loop: send the conversation to a
  model, read what comes back, run any tools it asked for, append the results,
  and go around again. This project builds that loop and the machinery around it
  from scratch, against a real model API - your agent is talking to a live model
  by the sixth lesson and every day after.

  You will build the transcript and the request, a tool registry with schemas the
  model can read, a dispatcher that turns a model's request into a real function
  call, and the parsing that pulls tool calls out of a reply - including
  assembling arguments from a stream that splits them mid-token. Then the control
  layer that separates a demo from something you would actually run: turn limits,
  retries with backoff, timeouts, cancellation, transcript trimming, prompt
  caching, and an approval gate for tools you do not want called unsupervised.

  Working against a real protocol means you learn the real traps, not invented
  ones: why every result from a batch of parallel tool calls has to come back in
  a single message, why tool arguments arrive as broken JSON fragments, and why
  dropping the wrong message from a long transcript corrupts it. The tests never
  call the live API - they assert against recorded responses, which is how you
  would build this for real anyway. You need an API key to run your agent, not to
  develop it.

  What you finish with is a command-line agent that talks to the real API and
  runs a small toolset behind an approval gate, plus the full protocol layer
  underneath it. It is a teaching harness, not a production framework: a few of
  the control features (streaming output, retries, caching) are built and tested
  as standalone pieces rather than wired into the running loop, and the whole
  thing has only ever been exercised against recorded responses. Wiring those in,
  and pointing it at a real key, is where you take it next.
parts:
  - name: The loop
    count: 7
  - name: Tools
    count: 8
  - name: The model protocol
    count: 7
  - name: Control
    count: 7
  - name: Making it real
    count: 7
caveats:
  note: 'The full protocol surface (tool loop, retries, timeouts, caching, persistence) is implemented and unit-tested, and the CLI runs a real four-tool agent with an approval gate against the live API, but it has only ever been exercised against local test doubles, never a real key.'
  future:
    - Wire retries and a per-request timeout into the tool loop itself, not just as standalone tested primitives
    - Replace the byte-based token estimate with the real count_tokens API endpoint
    - Add a session flag so a conversation can persist and resume across separate CLI invocations
    - Turn on streaming so long replies print incrementally instead of waiting for the whole response
    - Wire prompt caching into the system prompt for cheaper multi-turn or repeated-run usage
    - Expand the toolset past the four demo tools into something closer to a real coding or research agent
resources:
  - title: Tool use with Claude
    url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
    note: The protocol this project implements. Read it alongside the tools chapter.
  - title: Streaming Messages
    url: https://platform.claude.com/docs/en/build-with-claude/streaming
    note: Every server-sent event type, including the partial-JSON tool argument deltas.
  - title: 'ReAct: Synergizing Reasoning and Acting in Language Models'
    author: Yao et al.
    url: https://arxiv.org/abs/2210.03629
    note: The paper that framed the reason-act-observe loop this project implements.
  - title: Building Effective Agents
    author: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: Practical patterns and the case for keeping agent loops simple.
  - title: Model Context Protocol specification
    url: https://modelcontextprotocol.io/
    note: An open standard for how agents expose and discover tools. Where you go after this project.
  - title: Release It!
    author: Michael Nygard
    note: On timeouts, retries, backoff and bulkheads - the control chapter's subject, from the systems side.
---
