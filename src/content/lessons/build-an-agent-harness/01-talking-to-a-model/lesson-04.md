---
project: build-an-agent-harness
lesson: 4
title: Sending it
overview: A client sends a POST with three headers - the API key, the version, and content type - to a base URL you choose. Today that base URL becomes configurable, because every later spec targets a local test server, never the live API.
goal: Build a client with a configurable base URL, and confirm it sends the right method, headers, and body to wherever it points.
spec:
  scenario: Sending a request to a configurable base URL
  status: failing
  lines:
    - kw: Given
      text: 'a client configured with base URL "http://127.0.0.1:9999" (a local test server) and API key "sk-ant-demo-key-not-real"'
    - kw: When
      text: the client sends the request from lesson 3
    - kw: Then
      text: 'the request is a POST to "http://127.0.0.1:9999/v1/messages"'
    - kw: And
      text: 'header "x-api-key" is "sk-ant-demo-key-not-real"'
    - kw: And
      text: 'header "anthropic-version" is "2023-06-01"'
    - kw: And
      text: 'header "content-type" is "application/json"'
    - kw: And
      text: 'a client built with no base URL specified defaults to "https://api.anthropic.com" - the real API, untouched until you choose otherwise'
code:
  lang: go
  source: |
    type Client struct {
        BaseURL string // defaults to DefaultBaseURL; tests point it elsewhere
        APIKey  string
    }

    const DefaultBaseURL = "https://api.anthropic.com"

    // set headers x-api-key, anthropic-version ("2023-06-01"), content-type
checkpoint: Your client can send a real request to wherever you point it, with the headers the API requires, and defaults to the real API only when you do not override it. Commit and stop for today.
---

Sending the request means one `POST` to `/v1/messages`, carrying three headers the API demands - `x-api-key` for authentication, `anthropic-version` pinned to a specific date so the wire format never shifts under you, and `content-type` saying the body is JSON. None of that is hard. The one design decision that matters is where the request goes.

Make the **base URL** a field on the client, defaulting to the real API but overridable, rather than a hardcoded string. This is not a nicety - it is load-bearing for the rest of the project. You never test an agent against a live model: it answers differently every time, costs money per call, and cannot produce the exact bytes a spec needs to pin. Every spec from tomorrow onward spins up a local server that returns fixed, real, recorded bytes, and points your client at it through this exact field. Retrofitting this later would mean touching every test you are about to write.
