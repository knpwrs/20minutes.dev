---
project: build-a-fuzzy-finder
lesson: 33
title: A scripted session
overview: Before wiring a live terminal, prove the whole interactive flow with a scripted session - a list of keys driven through the finder to a final choice. Today you run that end to end, and confirm the non-interactive filter shares the same pipeline.
goal: Drive a Finder through a scripted key sequence to an accepted result, and confirm filter mode produces the matching highlighted output.
spec:
  scenario: An end-to-end scripted session
  status: failing
  lines:
    - kw: Given
      text: 'a Finder over ["src/main.go", "src/app.go", "go.mod", "README.md"]'
    - kw: When
      text: 'the keys "a", "p", "p" then Enter are fed to it'
    - kw: Then
      text: 'the query becomes "app", the results are exactly ["src/app.go"] (the only candidate containing a, p, p in order), and Enter accepts "src/app.go"'
    - kw: And
      text: 'filter mode on the same corpus with query "app" prints the single line "src/[a][p][p].go"'
code:
  lang: go
  source: |
    // Feed a slice of keys through HandleKey; the last Enter returns the
    // accepted value. This is a full interactive session, deterministic
    // and testable, with no terminal involved.
    keys := []Key{ch('a'), ch('p'), ch('p'), enter()}
    var accepted string
    for _, k := range keys {
      if s, done := f.HandleKey(k); done { accepted = s }
    }
    // accepted == "src/app.go"
checkpoint: A whole interactive session runs deterministically from a key script. Commit and stop here.
---

Before touching a real terminal - raw mode, escape sequences, the parts that are fiddly and platform-specific - you can prove the entire interactive flow works by **scripting** it. A session is just a list of keys pushed through `HandleKey`: type `app`, watch the results narrow to the one matching candidate, press Enter, and read back the accepted value. Because every step is deterministic, the whole session is a plain, exact test - no timing, no I/O.

This is also the moment the two faces of the tool line up. The scripted **interactive** session and the non-interactive **filter** mode run the very same pipeline - parse, rank, highlight - so `app` accepts `src/app.go` interactively and prints `src/[a][p][p].go` from `-f`. That shared core is why the finder stayed testable the whole way through. All that is left is the capstone: the same machinery, driven over a realistic corpus, standing in for the live tool.
