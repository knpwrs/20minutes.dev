---
project: build-a-fuzzy-finder
lesson: 29
title: One keystroke at a time
overview: An interactive finder is driven by keystrokes, and each key maps to one state change. Today you build the dispatcher that turns a key into an action, closing the chapter with a finder you can drive entirely from a key script.
goal: Handle a single keystroke - a printable character, backspace, up, down, or enter - by applying the matching finder operation, and report when enter accepts a selection.
spec:
  scenario: Dispatching keystrokes to finder operations
  status: failing
  lines:
    - kw: Given
      text: 'a Finder over ["src/main.go", "go.mod", "src/app.go"] with an empty query'
    - kw: When
      text: 'the keys "g", "o" are typed, then Down, then Enter'
    - kw: Then
      text: 'after "g" and "o" the query is "go" with results ["src/app.go", "src/main.go", "go.mod"], Down moves the selection to index 1, and Enter accepts and returns "src/main.go" with a done signal'
code:
  lang: go
  source: |
    // Map one key to one operation; return whether Enter accepted (done)
    // and the accepted value if so.
    func (f *Finder) HandleKey(k Key) (accepted string, done bool) {
      switch k.Kind {
      case Printable: f.SetQuery(f.Query + string(k.Rune))
      case Backspace: f.Backspace()
      case Up:        f.Up()
      case Down:      f.Down()
      case Enter:     s, ok := f.Accept(); return s, ok
      }
      return "", false
    }
checkpoint: The finder can be driven entirely by a sequence of keystrokes. Commit and stop here.
---

A terminal delivers input one **key** at a time, so the finder needs a single entry point that takes a key and applies the right change: a printable character appends to the query (which narrows or widens the results), backspace deletes, the arrows move the selection, and Enter **accepts**. Each case is a method you already built; the dispatcher is just the wiring that connects a key to the right one.

Enter is special because it ends the session, so `HandleKey` reports a **done** signal and the accepted value when it fires. Modeling input as keys rather than raw terminal bytes is what keeps the finder testable and language-neutral: a whole interactive session is just a **list of keys** fed through this function, and the final accepted value is deterministic. The chapter closes with a finder you can drive from a script; the last chapter feeds it a real corpus and the real terminal.
