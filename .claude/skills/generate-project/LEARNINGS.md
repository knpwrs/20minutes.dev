# Learnings

Heuristics accumulated while generating projects. Read this before planning;
append to it after every run (step 6 of SKILL.md). Keep entries **general** —
things that will help the *next* project, not notes about one topic. Terse.
Prune anything a newer entry contradicts.

## Interaction

- The subject belongs to the user. Take it from the invocation argument; if it's
  missing, ask — suggesting example subjects is fine, but always leave an explicit
  free-text path for the user's own idea, and make clear the suggestions are only
  suggestions. Whatever they provide wins.
- Prefer stating sensible defaults (length, language, size) over
  interrogating; the user can override in their reply.

## Voice

- **No strict-TDD lingo anywhere learner-facing.** Building spec-first is a useful
  habit, not a methodology we sell. Avoid "test-driven", "write the failing test
  first", "make it pass", "red/green" in overviews, blurbs, goals, and lesson
  prose. Say "a concrete spec / a small checkable target / make it work". (The
  verifier still writes real tests — that's internal QA, not learner copy.)
- **Every lesson opens with an `overview`** (1–2 sentences: what you build today
  and why it matters), before the spec. The project as a whole also opens with an
  overview of what gets built over the N lessons.
- **Overviews set realistic expectations.** For a big subject (emulator, database,
  browser) the project builds a working *teaching-grade core*, not a complete
  product — say so. "A Game Boy core that boots a ROM into its main loop" is
  honest; "a Game Boy emulator" implies playing games it can't. Keep the overview
  consistent with `caveats` (verified at finalize: the verifier found the GB core
  reaches the main loop but is missing immediates/DAA/HALT), and reconcile the
  overview after finalize if the result came in narrower than authored.

## Planning

- One new idea per lesson is the single most violated rule. When a lesson's title
  contains "and", it is probably two lessons.
- **For a renderer subject, pick the DETERMINISTIC (Whitted-style) design, not a
  Monte-Carlo path tracer.** The whole site is spec-first with exact expected values;
  deterministic ray tracing yields clean reproducible numbers (t=4,6; a normal; a
  Phong color to 5 places), while random per-pixel sampling defeats exact `Then`s.
  More generally, prefer the variant of any subject whose outputs are exactly
  checkable over the statistically-defined one.
- **Two trivial data-holder lessons: don't split into two thin lessons, and don't
  renumber the project — reframe one as the headline concept and the other as a
  one-line companion.** A "point lights AND materials" lesson tripped the
  two-concepts rule, but splitting gives two ~8-min struct-only lessons (both
  too_small). Fix: make Materials (5 params, defaults, wire onto the shape) the
  lesson's one real concept and introduce the trivial `PointLight` struct in the
  body prose as "the other input tomorrow's function needs." One concept
  headlines; the plumbing rides along.
- **Nail the product shape — run vs import — before planning the arc, and re-confirm
  if the user narrows scope mid-run.** It drives everything downstream: the
  walking-skeleton target, whether finalize adds a binary or a usage example, and
  what "usable each lesson" means. A search-engine project flipped from "crawler CLI
  you run" to "in-memory index library you import" on one user sentence ("closer to
  Elasticsearch, add + search"); that dropped crawling/persistence, changed the
  lesson-1 skeleton from a run loop to `index.add(id,text)`, and made finalize
  produce a usage example (`runs_today:"n/a"`) not a CLI. Ask "would a user run this
  or import it?" and state the answer in the plan before writing lessons.
- **A "run the analyzer on the query too" lesson is too_small on its own.** Query-time
  analysis is a one-line reuse of the document analyzer, and its assertions just
  restate the earlier `analyze()` lesson — a verifier flagged exactly this. Fold the
  index/query-analyzer *symmetry* point into the free-text `search()` lesson's prose
  instead; `search()` (analyze → candidates → score → top-k) is the real lesson. If
  you need the lesson back, an OR-vs-AND "require every term" mode (union vs
  intersection of candidates) is a genuine one-idea query lesson.
- The first 2–3 lessons of a project should each be trivially small (read a value,
  print a byte). They build momentum and confirm the toolchain works before any
  real difficulty.
- End every chapter on a lesson whose deliverable can be run or printed — a demo
  beats an abstraction as a stopping point.
- A ~40-lesson project with 4–5 chapters of 6–16 lessons each reads well; much
  longer and the syllabus's "+N more" dominates.
- **Shape the core data structure for what the FINAL chapter needs, not just the
  first.** A regex project built its Ch1 backtracker to return `bool`; the Ch4
  capture/search chapter then needed positions *and* group slots, forcing a fork
  chain (matchHere → matchHereEnd → capture variant) and a 40-min captures lesson.
  When planning, trace what the last chapter extracts (offsets, captures, an AST for
  a later pass) and give the early core a shape that carries it — return an end
  offset / thread a slots array from the start, or spend one explicit refactor
  lesson.
- **"Capture groups" is two lessons, not one.** (a) number groups + record each span;
  (b) save/restore those spans across backtracking so a failed branch leaves no
  stale offsets. Bundled, a verifier measured ~40 min and flagged too_big. The same
  "record, then make it survive backtracking" split applies to any feature that
  writes state during a trial-and-error match.
- **Compound-data features split into a literal lesson and an index lesson.** Arrays
  and hashes each want two lessons: (a) parse + eval the literal, (b) wire the type
  into the index operator. Bundled, "parse+eval+index" runs ~30 min. Hashes are the
  clearest case: one hash lesson is token + AST node + object + HashKey/Hashable
  machinery + parse + eval + index dispatch (6 files, ~180 lines, verifier measured
  32 min). Split it exactly like arrays; the extra hashing machinery is what pushes
  hashes over 20 min even when the array version fits.
- **Payoff/confirmation lessons legitimately have ZERO production diff.** When earlier
  lessons build the mechanism right, closures and recursion "just work" the day you
  write the first program that needs them — the lesson is a test proving it end to
  end. Brief the verifier that a green test with no new code is the *expected* outcome
  for these, not a defect, and don't manufacture code to hit a line count. Design at
  least one such payoff beat per subsystem — it is the satisfying "it works!" moment.
- **A separate length-probe path for quantifiers doesn't compose.** If `* + ?` match
  their operand via a distinct helper (matchOne/matchAll) instead of recursing
  through the main matcher, then a quantified *group* silently won't record captures,
  and `(a|b)+` (alternation inside the repeat) won't match at all — the probe only
  handles single-consume atoms. Either route quantifiers through the main recursive
  matcher (splice style) from lesson one, or scope the project to simple quantified
  groups and say so in caveats. This is the honest engine progression to lean on:
  backtracking is simple but limited, an NFA is complete for boolean matching, a Pike
  VM is what full linear-time captures need.

- **For a calendar/scheduler project (cron, ical, a date-recurrence engine), let the
  host time library do ALL calendar arithmetic and make the rollover cases ZERO-code
  payoff lessons.** A cron "next fire time" built as a minute-by-minute scan
  (`t = t.Add(oneMinute); if matches(t) ...`) gets month rollover, year rollover,
  end-of-month skipping (Apr has no 31st), and leap-day resolution (Feb 29 only in a
  leap year) entirely for free, because `Add` plus `Day()/Month()/Weekday()` handle
  the calendar. So the "rolls across a month boundary" and "resolves Feb 29 to the
  right leap year" lessons are payoff/edge-pin beats with no new production code -
  brief the verifier that green-with-zero-diff is the intended outcome, and pin them
  because Design Principle #8 wants those boundaries. Two consecutive zero-code payoff
  edge-pins at a chapter's tail are legitimate for a Small library project; give each
  two facets of its one idea (month-boundary + absent-day; find-next-leap + skip-4-yrs).
- **A bounded scan's horizon must exceed the LONGEST real gap, or it is a latent bug
  the happy-path tests never hit.** A cron next-fire scan needs a stop bound for
  impossible expressions (`0 0 30 2 *`), but the max gap between real fires is the
  8-year Feb-29 jump across a skipped century leap year (2096 to 2104, since 2100 is
  not leap) - so a 5-year bound silently fails to resolve a valid leap-day expression
  evaluated near a century boundary. Use a horizon past the true max (9 years here) and
  state the reasoning in prose. This is the calendar analog of the fixed-width-int wrap
  rule: the boundary a mid-range test never reaches.

- **For a codec (decode + encode) LIBRARY project, pair each fixed-width type's
  decode AND encode in ONE lesson (two facets of the same little-endian-layout
  idea), but keep the varint decode and encode as SEPARATE lessons.** Protobuf's
  fixed32/fixed64 (and their float/double reinterpretation) are one idea done both
  directions; zigzag decode+encode likewise fits one lesson (a bijection, two
  facets). But the varint is the core and its encode loop (emit 7-bit groups, set
  continuation) is a genuinely distinct algorithm from the decode loop, so it earns
  its own lesson. This kept a full protobuf codec (25 lessons) inside a Small scope.
- **For a decode-into-named-fields chapter, front-load the WHOLE result type and
  descriptor shape on the FIRST schema lesson**, not the minimum it needs. The
  protobuf schema chapter first returned a bare `map[string]any`; unknown-field
  preservation (3 lessons later) then needed a place to stash raw bytes, which would
  have forced a `Decode` signature refactor mid-chapter. Fix: on lesson 1 of the
  chapter return a small result struct (`Message{Fields map; Unknown []byte}`) and
  give the field-descriptor its full shape up front (a `Repeated` flag, a nested
  `Sub` descriptor) even though those slots stay unused for a few lessons. Same
  "introduce the general representation on member #1" rule as SQL statements, applied
  to the decoded-value type. Brief the verifier that the unused slots are expected,
  not dead code to delete.
- **A byte-dense codec is the ideal case for the pre-compute-with-a-throwaway-script
  rule** (see Verification): one Go program reproduced every varint, tag, zigzag,
  little-endian fixed, embedded-message, packed, and capstone byte string, locking
  ~40 exact `Then` values before authoring. Go gotcha when reproducing a
  sign-extended negative varint: `uint64(int64(int32(-1)))` is a *constant-overflow
  compile error* - assign through a `var` to break the constant chain.
- **In a "run" app whose ONE connection handler evolves each demo lesson, keep the
  accept loop sequential until the dedicated concurrency lesson.** An HTTP server's
  walking-skeleton `main` was wired with `go handle` at lesson 2 (echo); that would
  have made the lesson-32 "serve concurrently" spec a no-op (its test passes with
  zero change). The reference language's `go`/threads/async make premature
  concurrency the path of least resistance for a verifier. Brief early verifiers:
  "accept loop stays sequential; the concurrency lesson owns `go handle`."
- **Watch for a router/Mux the walking-skeleton handler then bypasses.** The HTTP
  project built a `Mux` (routing, 404, 405) in one chapter, but the runnable
  `Handle` served files directly and never routed through it — the Mux was orphaned,
  and HEAD/405 behaved differently on routes vs files. When planning a "run" app,
  make the entry point actually flow through the abstractions the lessons build
  (e.g. introduce the static-file handler AS a fallback handler on the Mux), or the
  finalize pass has to unify two parallel dispatch paths. Trace "does the running
  binary route through what the lessons built?" for every abstraction.

- **For a text-format parser LIBRARY (TOML, JSON, INI, CSV), front-load the WHOLE
  tagged-union value type with EVERY Kind on lesson 1, even though ~9 of 10 kinds
  stay unused for many lessons.** The TOML project defined `Value{Kind; Str; Int;
  Float; Bool; Arr; Tbl; DT}` with all ten Kinds on lesson 1 (empty-document ->
  empty table); every later value lesson then just adds a `parseValue` dispatch
  branch and fills one field, never reshaping the type. Verifiers scored lesson 1
  proxy(too_big)/felt(right) because the enum + struct is ~100 mechanical lines the
  hint hands over verbatim - brief them that the unused Kinds/fields are the
  front-load, not dead code. Same rule as SQL statements / protobuf result structs,
  applied to a parser's value union.
- **A line-oriented parser silently becomes a whole-input reader the first time a
  value spans lines (multiline strings, multiline arrays) - plan for it and brief
  those verifiers.** TOML lessons 1-9 read input as independent lines; lesson 10
  (multiline `"""`) then needs a value to consume following lines. The clean,
  low-churn pattern the verifiers converged on: the value parser returns a sentinel
  `errUnterminatedMultiline` / `errUnterminatedArray`, and the outer loop keeps
  appending the next physical line and retrying until it closes. Tell the lesson-10
  and lesson-26 verifiers this line-pulling adjustment is expected and prior
  single-line tests must stay green, or they either refuse to touch the loop or
  rebuild it as a cursor.
- **In a symbol-dense config/format project, single-quote EVERY spec `text:` scalar
  by default.** TOML values contain `=`, `:`, `#`, `[`, `{`, `"`, and colon-space
  ("the Len wire type: ...") - all YAML mapping-trap or comment triggers. Writing
  every Given/When/Then line single-quoted from the start (doubling any literal
  apostrophe, e.g. `array''s`) made all 32 lessons pass the js-yaml validator on the
  first run. Describe literal delimiters in PROSE inside the quoted scalar ("opened
  with three double quotes", "open-bracket-bracket products close-bracket-bracket")
  rather than embedding raw `"""`/`[[`, which keeps the YAML clean and reads fine.
- **For an RFC/spec-anchored parser (URI/RFC 3986, HTTP, dates), the specification's
  own worked-example TABLE is the project's exact-value goldmine - PRE-COMPUTE the
  whole table with a throwaway reference impl before authoring.** A URL-parser project
  rode RFC 3986 Section 5.4 (Appendix C): a ~250-line reference impl reproduced all
  ~40 normal+abnormal reference-resolution results against base `http://a/b/c/d;p?q`
  (`g`->`http://a/b/c/g`, `../../../g`->`http://a/g`) plus remove_dot_segments and
  percent cases in seconds, locking every `Then` before a single lesson was written.
  Every per-lesson verifier then just CONFIRMED buildability/scope, never discovered a
  value. Pick the STRICT variant of the algorithm (strict RFC 3986 5.2.2, not the
  legacy same-scheme mode) so the pinned results match the spec table exactly.
- **For an optional-component parser (URI components, HTTP headers, any grammar with
  present-but-empty parts), front-load a `Has<Component>` PRESENCE bool beside every
  optional string on lesson 1 - it is load-bearing TWICE downstream.** A URI needs
  `HasAuthority/HasQuery/HasFragment` (and HasUserinfo/HasPort) because `p?` (empty but
  present query) must round-trip differently from `p` (absent), and reference
  resolution branches on "did the reference DEFINE a query/authority" not "is it
  non-empty". Testing `Query != ""` instead of the flag silently breaks both
  recomposition and resolution. Same front-load-the-whole-shape rule as tagged-union
  value types, applied to optionality.
- **When `Parse` grows ONE delimiter per lesson (split off scheme, then authority,
  then fragment, then query), choose each lesson's test inputs to contain ONLY that
  lesson's delimiter so earlier pinned values stay stable as the function accretes.**
  `Parse("foo").Path=="foo"` must survive every later split; a lesson that splits the
  fragment must test `path#frag` (no `?`), because the query split does not exist yet
  and would otherwise leave `?...` in the path. This is the accumulate-into-one-function
  rule (see Writing specs) applied to a left-to-right splitter - the whole Chapter-1
  arc of a component parser depends on it.

- **For a glob / pattern-matching LIBRARY, the carrying design is a two-pointer
  linear matcher plus a `matchOne(pat,p,c) (matched bool, next int)` token helper,
  with path-awareness as a SEPARATE segment layer that reuses the single-segment
  matcher unchanged.** Build the single-segment matcher first (literal, `?`, `*`);
  introduce the two-pointer scan and `matchOne` on the star lesson so every later
  token (classes, escapes) is a small addition to `matchOne` rather than a loop
  rewrite. Then on the paths lesson, RENAME the finished single-segment `Match` to
  `matchSegment` and give a new `Match` the job of splitting on `/` and matching
  segment-by-segment - `*`/`?` never crossing `/` falls out for free (segments hold
  no slash), and the globstar `**` is just a zero-or-more-SEGMENT backtracker over
  the segment list. This rename+split is one clean refactor lesson (prior no-slash
  tests stay green because a slash-free pattern is a one-segment path); brief the
  verifier accordingly.
- **A gitignore engine layered on a glob matcher: front-load the full
  `Rule{Pattern,Negated,DirOnly,Anchored}` on the parse lesson, then each convention
  sets ONE flag.** Anchored rules match the WHOLE path via the path-aware `Match`
  (so they inherit `**` for free - a genuine zero-production-code payoff lesson worth
  its slot); floating rules match the BASENAME via `matchSegment`. Negation and
  last-match-wins are ONE lesson (negation is meaningless without ordering) - the
  ordered walk that folds `ignored = !r.Negated` on each match yields last-match-wins
  for free. "A path under an ignored directory is ignored" is a separate real lesson:
  wrap the per-path decision in an ancestor-prefix loop.
- **Parse ORDER is the load-bearing subtlety in a gitignore parser - pin it in the
  lesson prose.** Strip a trailing `/` (dir-only) BEFORE the interior-slash anchoring
  check, or `build/` looks anchored. Check a bare leading `!` (negation) BEFORE the
  `\!` literal-escape case. Run the blank/comment skip on the ORIGINAL first char so
  `\#foo` isn't dropped as a comment before it is unescaped to `#foo`. A verifier
  will silently "fix" a wrong order, so state it.

## Writing specs

- Always give a literal expected value in the `Then`. If you can't, the lesson
  isn't concrete enough yet.
- **For a symbol-dense pattern project (glob, regex, gitignore) single-quote EVERY
  spec `text:` scalar and describe delimiters plainly.** Patterns are full of
  `* ? [ ] ! / # \` - all YAML flow-scalar or comment triggers. In single-quoted
  YAML a backslash is literal, so a glob pattern of backslash-star is `'\*'` (no
  doubling) - but the Go test needs `"\\*"`, so state the host-language literal form
  in the verifier brief or agents burn time fighting the escaping. A doubled-backslash
  pattern matching one backslash is `'\\'` in the spec, Go `"\\\\"` vs name `"\\"`.
- **Socket / accept-loop / concurrency lessons are checkable via a real client
  round-trip, and that keeps them language-neutral.** Listen on an ephemeral
  `127.0.0.1:0` (avoids port collisions), dial it, send bytes, assert the reply —
  behavior, not internal socket state. Concurrency: two clients + a deliberately
  slow handler, assert both are served and overlap (generous timing margins so it
  isn't flaky). No spec needs to name a socket API.
- **A response/output serializer must emit map-keyed fields in a DETERMINISTIC
  (sorted) order, or every multi-field exact-byte spec is flaky.** Go randomizes map
  iteration, so an HTTP response with two headers serializes in a random order.
  Establish sorted-header serialization on the lesson that first serializes headers,
  and pin multi-header expected bytes in that order (`Content-Length` before
  `Content-Type`). Applies to any subject serializing an unordered map to bytes
  (JSON-ish output, header blocks, key-value records).
- **Accumulate-into-one-serializer trap: a lesson asserting the serializer's output
  WITHOUT a field breaks when the next lesson auto-adds that field.** The response
  serialize() spec (status+headers+body, no Content-Length) went stale the moment
  the next lesson auto-derived Content-Length. Fixes: (a) the earlier lesson asserts
  via substring not full bytes, or (b) tell the learner in the adding lesson "your
  earlier exact-bytes check gains a line now — update it." And make the auto-added
  field **only-if-absent** so a later lesson (HEAD: keep Content-Length but empty
  body) can set it explicitly without the serializer clobbering it. This is the
  accumulate-into-one-function rule applied to a builder, not just a numeric sum.
- **When a function is built up term-by-term across several lessons, each lesson's
  test input must produce a value that STAYS TRUE once later terms land.** A
  ray-tracer Phong split (lesson: ambient+diffuse, next lesson: +specular) picked a
  straight-on eye/light geometry whose ambient+diffuse value was 1.0 — but that same
  geometry is specular-*maximal*, so once specular was added the earlier lesson's
  test broke (became 1.9). Fix: choose per-lesson inputs where the not-yet-added
  terms are genuinely ~0 (e.g. eye *off* the highlight → specular≈0), so the
  intermediate-lesson value equals the final-function value. Applies to any
  accumulate-into-one-function arc (lighting terms, score components, flag
  effects). A verifier catches it as a next-lesson regression, not a same-lesson
  failure — brief lesson N+1 to re-run lesson N's tests.
- **A canonical/general implementation of lesson N can silently subsume lesson
  N+1's "edge cases" lesson, making it too_small.** Ray-sphere "two hits" (lesson N)
  written with the full quadratic naturally handles tangent/miss/negative-t, so the
  "discriminant cases" lesson N+1 added only tests. Fix: explicitly steer lesson N
  to the happy path in its prose ("assume it hits; handling misses is tomorrow —
  leave that guard for then") so the follow-up owns real logic. Generalizes to any
  "add the edge/guard cases next" split.
- **When a spec asserts a value that depends on "the center" (center pixel, midpoint,
  median), the stated dimensions must actually make that element central.** A camera
  spec said 201×201 but asserted the ray through pixel (100,50) points straight ahead
  — only true at 201×**101** (then (100,50) is the exact center). Off-by-one on a
  dimension silently changes the asserted result. Recompute that the named index is
  really the middle.
- **Values computed through recursion + an epsilon offset need a looser comparison
  tolerance.** A reflected-color spec value reproduced only to ~1e-4, not 1e-5,
  because the "over-point" nudge (offset the hit along the normal to avoid acne)
  amplifies through the second bounce. Say so in the lesson ("compare to a thousandth,
  not a millionth, here") so a correct result isn't rejected by rounding.
- **Test the wrap/overflow boundary, not just a mid-range case.** Any op that can
  overflow a byte or word (INC/DEC, ADD, SUB, 16-bit math, PC/SP increment) needs a
  `Then` *at* the boundary — e.g. `0xFF INC → 0x00`, not only `0x0F → 0x10`. Go's
  `uint8`/`uint16` truncate silently, so a Go reference passes either way; but a
  language without fixed-width ints (JS, Python) will pass a mid-range-only spec
  while a naive port (`b++`) is wrong at the edge (256, not 0). The second-language
  (JS) pass caught exactly this on the INC/DEC lesson. Boundary coverage keeps the
  spec honest for *every* language — which is the whole point of "language of your
  choice".
- Keep specs free of language APIs. "the id is <sha>" is portable; "sha1.Sum
  returns X" is not.
- **A concrete absolute program/file path in a spec must exist on every verify OS.**
  A shell project hard-coded `/bin/true` and `/bin/false` in early specs (before the
  PATH-search lesson); those live in `/usr/bin` on macOS, not `/bin`, so the
  lesson-4 verifier had to work around it. `/bin/echo`, `/bin/cat`, `/bin/ls` exist
  in `/bin` on both macOS and Linux; `true`/`false` do not — use `/usr/bin/true`,
  `/usr/bin/false` (or a PATH-resolvable bare name once PATH search exists). When a
  spec needs a real external path before the project can resolve names, pick one
  present on macOS *and* Linux.
- **Pure-math helper lessons (`log_tf`, `idf`, `tf-idf`, `bm25`) verify cleanly with
  given scalar inputs and clean expected values — they stay language-neutral and dodge
  the "build a 1000-doc corpus" problem.** Pick inputs that land on round outputs
  (`idf(1000,10)=2.0`, `bm25(idf=1.0,tf=2,dl=3,avgdl=3)=1.4286`); state the rounding
  ("to 4 places") in the Then. But a *composition* lesson (e.g. "sum the per-term
  weights") framed with magic illustrative weights (`4.0 for "cat" + 1.5 for "dog" =
  5.5`) reads as a corpus to reverse-engineer — a verifier flagged it ambiguous. Frame
  such lessons as the PROPERTY (`query_score == sum of weight(t,doc)`, and an absent
  term contributes 0), keeping the numbers as an illustration, not a target to
  construct.
- **A crude N-rule suffix stemmer mangles most words (`running`→`runn`); choose spec
  examples that stem cleanly** (`jumping`→`jump`, `jumped`→`jump`, `cats`→`cat`, and
  `class`→`class` to show the `-ss` guard) and state the crudeness honestly rather than
  implying Porter quality. Ask the lesson-agent to hand-confirm every stem value.
- **Specify observable behavior, not internal data layout.** A spec/hint that
  mandates *how* state is stored ("keep the framebuffer as raw indices, apply the
  palette only at encode") collides with equally-valid choices earlier lessons made.
  Lesson 56 (palettes) did exactly this and both the Go and JS ports — which had each
  applied the palette inside the scanline renderer — were forced to touch
  prior-lesson code to comply. State what's observable at the register/output level
  ("the displayed shade comes from BGP read live from 0xFF47; identity 0xE4 is a
  no-op") and leave *where* the value is computed to the builder. Surfaced by the
  dual-language pass converging on the same objection.
- **When many items are placed on a SMALL deterministic hash space and a lesson
  asserts exact per-bucket COUNTS, those counts are implementation-dependent at the
  collision points — pin the collision rule in the INTRODUCING lesson.** A
  consistent-hash-ring project put 1200 virtual nodes on a 16-bit (65536-slot) ring
  and asserted a weighting split of alpha 981 / beta 499 / gamma 520. Two natural
  implementations diverge only at the ~6 collided positions: skip-if-occupied
  (first-writer-wins) gives 981/499/520; append + `owner[p]=name` overwrite
  (last-writer-wins) gives 976/498/526. The vnode-introducing lesson's hint showed a
  plain overwrite while the later weighting lesson's authored value assumed dedup —
  a latent bug only the count-dense lesson surfaces. Fix: state the collision
  convention ("if a position is already occupied, skip it") in the hint AND prose of
  the lesson that first places multiple items, so every downstream exact-count
  lesson is reproducible. Birthday-collision math: N items on M slots collide once
  N ≈ sqrt(M); a 16-bit ring collides by ~300 items, so any teaching-scale vnode
  count will hit it.
- The `code` hint should be the smallest possible nudge (<8 lines) and may be in
  any language; the learner is not expected to use that language.
- **On a lesson whose whole point is deriving a trick, the hint must NOT contain the
  trick.** Verifiers repeatedly flag arithmetic/flag lessons (ADD's "widen to expose
  the carry", half-carry `(a&0xF)+(b&0xF)>0xF`) where `code.source` is the full
  answer — the learner transcribes, never derives. Give a case label + a comment
  naming the *strategy* and which values to set, not the expressions. Likewise
  don't pre-walk the exact worked example in the background prose; leave the "aha"
  for the test. This is fine for primitive plumbing lessons (a struct, an array
  index) where there is no derivation to spoil.
- The spec's Given/When/Then must exercise **everything** the `goal` and
  `checkpoint` claim. Bundling N sibling ops ("AND, OR, XOR") reads as one idea to
  the author but verifiers flag it two ways at once: too_big *and* ambiguous
  (spec tests a subset of what the goal names). Fix by cutting the goal to what
  the spec tests and demoting the rest to a prose "follows the same pattern" note
  — pick the subset that still covers every distinct behavior (e.g. AND sets H,
  XOR clears it, so those two alone cover all three logical ops).
- Enrich a too_small early lesson with a **second assertion on the same concept**
  (a boundary value, a second fetch), never a new concept — keeps one-idea while
  filling the 20-min box.
- **A "prove the headline result" synthesis lesson that only re-asserts two
  already-proven facts reads too_small — enrich it in place with the SYMMETRIC
  facet, don't renumber.** A ring-vs-modulo comparison lesson just combined "ring
  moves 1" (proven earlier) and "modulo moves 8" (proven earlier) on a node ADD; a
  verifier flagged it too_small (0 new funcs, restates prior lessons). Adding the
  removal direction (ring moves 1 back vs modulo still moves 8 on a node LEAVE) is a
  genuine second facet of the same churn-cost idea, doubles the assertion set, and
  needs no new lesson slot. Prefer this over splitting/merging, which renumbers the
  whole project and its `parts[]` counts.
- **A deliberately Small (~20-25 lesson) library project naturally accrues several
  legitimately test-only beats — a boundary pin, a bulk-application demo, a
  distinctness-edge proof — that verifiers score too_small; keep the load-bearing
  ones.** A consistent-hashing project had 4 such (key-exactly-on-node `>=` pin,
  ring-vs-modulo headline, replica-set R=1/R>=N edges, R=2-over-the-keyset bulk
  placement). Each pins an edge Design Principle #8 wants or demonstrates the API in
  bulk, and none introduces a fork; that they add no production code is expected for
  a payoff/edge lesson, not a defect. Only act (enrich or merge) when a beat is a
  PURE recap adding no new facet — see the symmetric-facet fix above.
- List every constant/mask the lesson needs in the hint. Showing only 2 of 4 flag
  masks and leaving the rest "to infer" is a recurring verifier gripe.
- **A flag-affecting instruction's spec and hint must account for EVERY flag it
  touches — including the ones it clears.** Recurring correctness bug on bit-op
  lessons (rotates/shifts): the hint sets C (and maybe Z) but silently omits "clear N
  and H", so copying it verbatim leaves stale flags. State all four flags' fate in
  the spec, and in the hint name them all (Z from result, N/H cleared, C = the bit
  shifted out) rather than showing a partial SetFlag sequence.
- **Structural specs are fine — even necessary — for a construction chapter.** The
  Thompson-NFA chapter compiles AST→state-graph over several lessons *before* the
  simulator that would let you assert behavior exists, so those lessons assert the
  graph shape ("start is a Split whose branches are Char 'a' and Char 'b'; the 'a'
  state loops back to the Split"). These verified cleanly. Keep the assertion at the
  graph-shape level (any reasonable Thompson impl satisfies it), not a specific field
  layout — the "observable behavior, not internal layout" rule still bites for
  representation-specific claims like `parse("ab|cd") is Alt(Concat[..],Concat[..])`,
  which a verifier had to reinterpret; prefer a behavioral precedence check there.
- **Check hint identifiers against the public API already in the namespace.** A hint
  that named an NFA accept-state kind `Match` collided with the package-level `Match`
  function the project had already built (same Go package) — it only surfaces in a
  real build. Pick neutral names (`Accept`) in hints for enum values / helpers.
- **For a parser/AST chapter, assert on a `String()` round-trip** — have every node
  print itself back as normalized source and make each parsing lesson's spec
  `parse(src).String() == "<normalized>"` (e.g. `"1 + 2 * 3"` → `"(1 + (2 * 3))"`,
  `"let x = 5;"` → `"let x = 5;"`). It is concrete, language-neutral, and reads a
  whole subtree in one value — far better than asserting Go struct shapes. **Caveat:
  keep the parenthesization convention consistent across sibling nodes.** A node that
  embeds an infix condition (`if`, `while`) must NOT wrap it in its own parens,
  because the infix's `String()` already self-parenthesizes — `"while " + cond + " "`
  gives `while (x < 10) x`, but `"while (" + cond + ")"` double-wraps to
  `while ((x < 10)) x` and breaks the spec. A verifier caught the `if` case; pin the
  exact format (and which nodes add parens) when you author, or the hint ships a bug.
- **A "write X in the language itself" capstone must have its in-language program
  hand-traced for exact output — the bug can live in the algorithm, not the host
  language.** The natural recursive `map` (`push(map(rest,f), f(first))`) *reverses*
  the array (`[6,4,2]`, not `[2,4,6]`): it bottoms out on the last element and `push`
  appends, so results come out last-to-first. A map that silently reverses is a
  broken capstone. Use the accumulator form (`iter(rest, push(acc, f(first)))`), which
  preserves order. Same family as the fixed-width-int trap, one level up: the
  in-language program's correctness is independent of the reference language, so trace
  it by hand (or have the verifier report the *actual* order) before pinning the `Then`.
- **A `code` hint that declares a value it doesn't use won't compile in a strict
  language.** A Go minus-negation hint wrote `i, ok := right.(*Integer)` then used only
  `i` — an unused-variable compile error, and misleading on a lesson that defers type
  checks. On an "assume the type for now" lesson use the panicking form (`i :=
  x.(*T)`), which compiles and honestly reflects "assume it"; the later error-handling
  lesson replaces it with the comma-ok guard. Hints are copied verbatim — they must at
  least compile.

## Durability / crash-safety lessons

- **A crash spec must forbid the clean path, not just assert an end state.** The
  testable core of "survives a crash" is: leave the torn artifact on disk (a
  half-written temp snapshot) and reach recovery WITHOUT calling save/checkpoint/
  close - just reopen. Word the `When` as "a crash is simulated after X and before
  Y" and split the save into write-temp+fsync / rename so a test can stop between
  them. An end-state-only spec passes even for a non-atomic implementation.
- **Pin file-system facts alongside recovered values.** Durability specs get their
  edges from the filesystem, not arithmetic: "no `db.txt.tmp` remains after a
  completed save", "the WAL is truncated to zero length after checkpoint", "the
  live file still holds the *old* whole snapshot, never a torn mix", "the mutation
  applied exactly once (no double-apply on reopen after checkpoint)". These are the
  boundaries Design Principle #8 wants for this subject.
- **Statement/record-based redo logging is the language-neutral WAL choice.** Log
  each mutation as a replayable record and recover by re-applying in commit order;
  the spec pins "N records in commit order, each replayable" + the recovered rows,
  without coupling to any fsync/file API. Ordering ("snapshot first, then truncate
  the WAL") is itself a one-idea lesson worth its own beat.

## Continuity

- **A walking-skeleton "run" app has ONE handler that evolves every demo lesson, and
  each evolution stales the previous demo's test — that is expected, not a
  regression.** The HTTP server's `Handle` went echo → canned 200 → echo-parsed-path
  → real Response → static file server across five demo lessons; each rewrite changed
  the exact bytes the prior demo asserted. Brief each demo-lesson verifier with an
  explicit "evolution note": what the handler becomes today, and which prior test to
  update or retire (this is the ONE permitted prior-code change). Without it, agents
  either refuse to touch prior code (and can't make today green) or silently break
  earlier tests. Distinguish this sanctioned evolution from an accidental regression
  in a pure helper.
- **Identity-default gotcha: the lesson that first gives an object a matrix/transform
  field must introduce a CONSTRUCTOR, not rely on the zero value.** A zero-value 4×4
  matrix is all zeros (a non-invertible degenerate transform), not the identity — so
  the lesson that adds `Transform` to a shape must ship a `NewShape()` that sets
  `Identity()` and ripple-update every bare `Shape{}` literal, or every prior
  intersection silently breaks (invert-a-zero). Brief the verifier to expect the
  ripple. Same shape as the field-wiring note below, but the failure is silent
  (wrong render) rather than a compile error.
- **Extract-an-interface refactor lessons are legitimately ~25-min "right" even
  though diff proxies scream too_big.** The lesson that generalizes the first
  concrete type into an interface (sphere → `Shape` with
  `LocalIntersect`/`LocalNormalAt`, transform + material lifted to a generic
  wrapper) touches many call sites (World, Intersection, Comps, shade) — 9 files,
  100+ lines — but it is one concept and a mechanical spread. Give it its own
  lesson (per the "spend one explicit refactor lesson" rule), brief the verifier
  it is pure behavior-preserving refactoring with every earlier test green, and
  expect proxy(too_big)/felt(right) disagreement.
- When separate structs are introduced on different lessons (e.g. `Registers`
  lesson 1, `CPU` lesson 4) but later used together, **one lesson must explicitly
  wire them** (embed/own). Trace the first cross-struct reference (here `c.B` on
  lesson 7) and make sure an earlier lesson established the containment, or the
  build breaks there.
- One-new-idea makes each lesson introduce its own type in isolation; the
  "assembly" is itself a design decision that needs a home on the lesson the
  pieces first meet.
- The same trap bites **single fields**, not just whole structs: a field a later
  opcode needs (a stack pointer on lesson 25, an interrupt-enable flag on lesson
  39) is often first *used* by a lesson with no earlier lesson declaring it.
  Introduce it on the lesson it is first needed, with a one-line "add this field
  now" note in the prose.
- A lesson that **refactors a shared structure** (e.g. flattening memory into
  regions) must preserve prior behavior and signatures or it regresses every
  earlier lesson. Say so in the lesson, and brief the verifier to keep the old
  behavior green.
- **Front-load the family's general representation on the lesson the FIRST member
  arrives** — the single most reliable cause of a late-chapter `too_big`. A lesson
  that introduces member #1 with a one-off marker (a `bool CountStar`, a concrete
  `Parse() SelectStmt` return) forces a structural refactor when member #2 lands,
  so member #2's lesson carries *two* concepts (the refactor + the new behavior)
  and blows scope. This bit the SQL project twice: lesson 20 (CREATE) had to
  invent the `Stmt` interface + keyword dispatch that lesson 15 (SELECT) should
  have introduced; lesson 32 (SUM/MIN/MAX/AVG) had to generalize the select list
  from a `bool` that lesson 31 (COUNT) should have made an `Agg{Func,Column}`. Fix:
  on member #1's lesson, spend the one extra line to introduce the *general*
  shape (an interface/marker even with a single implementor, a `{func,arg}`
  struct even for one func) so every later member is a pure one-concept addition.
  When planning, for any feature that is clearly the first of a family
  (statements, expression nodes, operators, aggregates, clauses), ask "what
  representation will member #2 need?" and put it on member #1's lesson.
- **Lexers/parsers: define token classes at their real breadth on the introducing
  lesson, not the minimum the lesson's example needs.** Lesson 9 read identifiers
  as "letters only"; the demo's `user_id` column (lesson 36) then depended on
  underscore support no lesson established. An identifier is letters + digits +
  underscore, a number may be multi-digit, a string may be empty — state the full
  class up front; a later lesson's realistic data almost always needs it.
- **Demo/integration lessons surface cross-cutting gaps the feature lessons each
  dodged.** The JOIN demo needed the *select list* to accept qualified names,
  which the qualified-ref lesson had only added to WHERE expressions. Expect a
  chapter-closing demo to do real wiring, brief its verifier to expect it, and let
  it run slightly longer (~25 min) than a feature lesson — but fold any genuinely
  missing prerequisite back to the lesson that owned it.

## Repo mechanics

- Project metadata is a **content collection**: `src/content/projects/<slug>.md`
  (frontmatter — title/order/lessons/size/tech/estMin/desc/blurb/
  overview/parts/caveats/resources). Homepage, projects page, and per-project pages
  all derive from it via `getAllProjects()`/`getProject()`; never hard-code a
  project list. `src/data/projects.ts` is now just the type + those helpers.
- Chapters are **folders**, not frontmatter: a lesson's `NN-chapter-slug` folder
  (e.g. `03-control-flow`) gives its chapter and order — the leading `NN` selects
  the matching `parts[]` entry by position. `parts[].name` just supplies that
  chapter's display name; there's no frontmatter string to keep in sync, so a
  lesson can no longer silently drop out of the syllabus by typo.
- `parts[].count` is the *total* lessons in the chapter (used for "+N more"); it is
  fine for authored files to be a subset.
- Run `npx astro build` after writing — it is the fastest schema check.
- **A frontmatter scalar must never START with a backtick** (or `@`) — YAML reserves
  those, so `overview: ` + a backticked symbol (`` `?` means… ``) fails the build
  with a misleading "bad indentation of a mapping entry" error pointing at the
  *next* line. Symbol-heavy projects (regex `? * + | ^ $`, shell globs, operators)
  hit this constantly on `overview`/`checkpoint`/`goal`. Fix: single-quote the whole
  value (`'`…`'`) or reword so it doesn't lead with the backtick. Also: **`tech` tags
  are concepts, never a language** (`NFA`, `B-trees`, `Sockets`) — the language is
  the learner's, so naming one contradicts the premise.
- **A colon-space (`": "`) inside an unquoted `overview`/`goal`/`checkpoint` scalar
  breaks the build** with the same misleading "bad indentation of a mapping entry"
  error as the leading-backtick trap - YAML reads the text after the colon as a
  nested mapping. Definition-style prose triggers it constantly ("the Len wire type:
  a length then bytes", "the inverse of the decoder: pack a field and wire type").
  Single-quote the whole scalar. The standalone js-yaml validator catches every one
  before a build; run it after authoring.
- There is **no `currentDay` field** — learner progress is client-only, stored in
  localStorage and hydrated on load (`src/scripts/progress.ts`). The server renders
  a neutral no-progress skeleton; project frontmatter must not include `currentDay`.
- Watch for a **stray duplicate `code:` key** in frontmatter when a hint's
  `source:` block ends — the easiest YAML footgun to introduce and it silently
  makes the whole frontmatter invalid. Build catches it; fix before moving on.
- To *replace* a placeholder project, overwrite its `src/content/projects/<slug>.md`
  frontmatter (counts, `tech`, `parts`) and delete the old scattered lesson files
  first, so the authored set is the whole project and nothing stale lingers.
- Give each project a **`resources`** list (classic books + key specs/articles);
  the overview page renders it as "Recommended reading". `adjust-project` can add
  to or update it later.
- **When RESUMING an interrupted run, validate ALL lessons standalone (js-yaml),
  including ones a prior session wrote - not just the gap you author.** A prior
  interrupted run left lesson 4 with a checkpoint scalar that STARTED with a backtick
  (`` checkpoint: `*` expands... ``); because the run never reached `astro build`, the
  invalid YAML (misleading "bad indentation of a mapping entry" pointing at the next
  line) sat undetected until the resume validated the whole set. Loop the js-yaml check
  over every `lesson-XX.md` in the project on resume; a half-finished predecessor is
  the most likely place a leading-backtick/colon-space trap hides. Also expect the
  precompute scratch dir and a `.git`-but-no-commits verify repo to already exist - reuse
  the precompute script, and scaffold go.mod/.gitignore into the empty repo rather than
  re-initing.

## Verification

- Verify as a sequential chain, **one agent per lesson**, all on one cumulative
  project — never parallel agents (lessons depend on each other) and never one
  agent for the whole project (it gets context-loaded and underestimates how long
  later lessons take a newcomer). A fresh agent per lesson keeps the 20-minute call
  honest.
- Run the lesson-agents synchronously and in order; each depends on the previous
  lesson's committed code.
- Name the target language's test framework in the brief; without it, agents pick
  inconsistent setups and waste time on scaffolding.
- Each lesson-agent must run the whole suite, not just today's test — silent
  regressions in earlier lessons are a common defect.
- **Build every lesson, lesson 1 through the last — no static-review shortcut.**
  The whole arc must compile and stay green; a half-built prefix hides exactly the
  late-project continuity breaks you most need to find.
- The project is a **git repo; one commit per lesson** (`Lesson NN · <title>`). That
  history is a deliverable — the reviewer walks it to experience the project as a
  learner would. Never amend earlier lessons.
- Scrutinize **numeric-value-dense** lessons hardest (flag arithmetic, addressing
  math, decode tables) — that is where a hand-computed expected value in a spec is
  most likely wrong. Ask the lesson-agent to recompute the trickiest values by name;
  it catches both wrong specs and prose that contradicts a correct spec.
- **For a numeric-dense project, PRE-COMPUTE the entire value chain with one
  throwaway reference script before spawning the verify chain.** A ~60-line Go
  scratch program reproducing the project's hash + all derived positions/counts
  confirmed 40+ exact `Then` values in seconds and isolated the single real spec bug
  (an implementation-dependent weighting count) up front — so the 23 per-lesson
  subagents became confirmation of buildability/scope, not value discovery. When an
  exact value is impl-dependent, test BOTH plausible implementations in the script to
  learn which convention the authored value assumed (that is how the skip-vs-overwrite
  collision ambiguity above was pinned). Cheaper and more reliable than discovering a
  wrong value at lesson N and re-running the tail of the chain.
- **A recurring language-specific vet/lint warning is not a spec defect - name it in
  every verifier brief up front so agents stop re-flagging it.** Naming a byte cursor
  method `ReadByte() byte` trips Go's `stdmethods` vet check (it wants `(byte,
  error)` per `io.ByteReader`); it is non-fatal and `go test` stays green, but all 25
  verifiers re-reported it. Telling each agent "there is a known pre-existing
  non-fatal ReadByte vet warning, leave it" cut the noise. The natural hint name for
  a language-neutral concept sometimes collides with a host-language convention;
  accept it (or pick a non-colliding name) rather than distorting the lesson.
- Give each lesson-agent a one-line **"state so far"** (what the cumulative project
  already has: structs, opcodes, methods). It stops them re-flagging settled
  continuity and cuts scaffolding time noticeably.
- **The orchestrator owns git; forbid lesson-agents from running git commands.** One
  agent tried `rm -rf .git`; another ran gratuitous `git status`. Tell each agent
  "do not commit, do not run any git commands," commit yourself after it returns,
  and re-check the repo is intact if an agent reports an errant destructive command.
  (A lesson-agent here ran `git reset` to "confirm nothing was committed" —
  harmless, history untouched, but confirm `git rev-list --count HEAD` after any
  such report.) **"Do not run git" is NOT enough on its own — an agent silently
  `rm`-ed the entire `.git` directory mid-run (no report), and because git history
  is unrecoverable, lessons 1-10 collapsed into one reconstructed snapshot commit.
  Two defenses, use BOTH: (a) put an explicit line in EVERY agent brief — "NEVER
  delete/move/modify the `.git` directory; never run `rm`, `git reset --hard`, or any
  destructive command"; (b) after each lesson commit, `cp -r .git ../<slug>-git-backup`,
  and before each commit `[ -d .git ] || cp -r ../<slug>-git-backup .git` to restore.
  The backup is cheap insurance the "forbid git" rule alone does not provide.**
- **If a lesson-agent dies mid-task (API/spend/timeout), inspect the working tree
  before re-running — the work is often already complete.** The cut-off happens
  during the agent's final prose, after the code and test are written. Read the new
  test, confirm it asserts the lesson's exact spec values, run `go test`/`go vet`
  and the entry point yourself, then commit — cheaper and more faithful than
  spawning a fresh agent that may re-derive differently. Only re-run if the tree is
  genuinely half-written (won't build, or the test doesn't cover the spec).
- Triage verifier flags: separate **harness implementation choices** from real
  spec defects. Agents often pick a flat array where the lesson hints imply
  separate stores (or vice-versa) and flag "ambiguous" — that is their call to
  avoid refactoring, not a lesson bug. Only act when the spec's values, continuity,
  or scope are actually wrong.
- The felt "would a newcomer take 20 min?" estimate is soft — an LLM builds in
  seconds and guesses. Anchor it: score every lesson against
  `references/scope-rubric.md` and cross-check the felt estimate against the
  lesson's commit diff (`git show --stat`). Concepts/behaviors outrank line counts;
  act hardest on lessons where the felt estimate and the diff proxy **disagree**.
- The lesson-by-lesson chain implements only the behavior the specs test. Always
  end with a **finalize pass** (`capstone:` commits): complete the families the
  lessons introduced so real input runs further, fail gracefully on the rest, and
  write a `CAVEATS.md`. **Whether it needs a runnable binary depends on the
  product** — ask "would a user run this, or import it?" An app/tool (emulator,
  shell, server, CLI, renderer) gets a runnable entry point + built-in demo;
  confirm the run command works. A **library** (regex engine, data structure,
  parser) does NOT — a `main` would be artificial, the tested public API is the
  deliverable, so finalize just ensures a coherent API + a runnable usage example
  (`runs_today: "n/a"`, and `CAVEATS.md` documents *use* via an example, not a run
  command). Never bolt a binary onto a library to satisfy the process.
- Better than deferring: **walking skeleton.** Have the lesson-agent stand up a
  minimal entry point as soon as the project can run anything end to end, and
  smoke-run it every later lesson (`runs_today`). Then each lesson's commit is
  runnable and finalize only completes families + docs.
- **Finalize earns its keep by combining edge cases no single happy-path lesson
  tests.** On the search-engine library it found two real crashes the 34 green
  lessons never hit: `idf(N, df)` divided by zero when a query term was absent
  from the *whole* corpus (`df==0`), and boolean `eval` threw `IndexError` on a
  malformed query (leading/ trailing operator). Numeric ranking formulas
  especially need a `df==0` / empty-index guard, and any left-to-right expression
  evaluator needs a malformed-input guard — none of which a per-lesson spec
  exercises. Expect finalize to add these robustness guards at composition
  boundaries and to record them in `CAVEATS.md`; this is the point of the pass,
  not a defect in the lessons.
- Feed the finalize agent's `site_caveats` back into the project's `caveats` field
  in `src/content/projects/<slug>.md` so the site's "Scope & extensions" panel
  matches what the reference actually does. Keep it to one note + 4–6 learner-facing
  extensions. Also reconcile the `overview` there if the result came in narrower
  than authored.
- **For a RUN app, finalize must give it a FIXED, configurable listen address — not
  the ephemeral `127.0.0.1:0` the per-lesson tests use.** The HTTP server's lessons
  all bound `:0` (so parallel-safe tests never collide), but that leaves the demo
  binary with an unpredictable port and no usable URL. Finalize switched it to a
  `-addr`/env default `:8080`, printed the URL, and added a zero-setup built-in demo
  (write an `index.html` to a temp dir when no root is given) so `go run ...` then
  `curl` works with no assets. Also: finalize is where an orphaned abstraction gets
  wired in (the Mux + static-file fallback) and where cross-cutting robustness gaps
  the lessons dodged get fixed — nil header maps that panic on mutation, a HEAD path
  that 405'd on dynamic routes, a chunked-decoder off-by-one on the terminating CRLF.
  Expect the finalize pass on an app to do real integration work, not just docs.
- **Live-smoke the finished binary yourself after finalize — `go test` green is not
  "it runs."** The finalize agent reported `runs:true`, but a manual `curl` found
  `HEAD /health` returning 405 (HEAD worked on files but not dynamic Mux routes) — a
  coherence bug no per-lesson test covered because no lesson exercised HEAD against a
  registered route. Start the server, curl each surface (a route, a file, a 404, a
  HEAD), and read the access log before declaring it usable.
- **A second-language pass is the real test of "language of your choice."** Re-run
  the whole lesson chain in a language whose semantics differ from the reference —
  one without fixed-width integers (JavaScript, Python) is ideal. It catches specs
  that quietly lean on the reference language's behavior: the Game Boy project
  (authored against Go's `uint8`/`uint16`) had INC/DEC and 16-bit-ADD specs that
  tested only a mid-range value, so a naive JS port passed while being wrong at the
  wrap boundary. Ask each second-language agent an explicit `agnostic_ok` question
  ("did the spec port on stated values, or did it assume the reference language's
  integer semantics?"). Fixes go back into the lesson specs (a boundary facet),
  improving the project for everyone. Give the second language its own finalize +
  `CAVEATS.md` (swap the output target if it makes sense — e.g. an HTML `<canvas>`
  renderer instead of a PGM file).
- **In a systems project, the reference language's stdlib will trivialize some
  lessons — decide per lesson whether to build the primitive explicitly or keep it
  as a language-neutral "rule" lesson.** Building a shell in Go, three lessons went
  effectively no-op because `os/exec` already does the work: PATH search
  (`exec.Command` looks up bare names), pipeline-status-is-last-command (the
  natural wait loop yields it), and N-stage generalization (the 2-stage code was
  already written generically). Two valid responses: (a) reframe the lesson to
  build the primitive itself and have the shell use it (lesson 6 made learners
  write an explicit `resolve(name)` resolver instead of leaning on the implicit
  lookup) — best when there's a real primitive to own; or (b) keep the lesson if
  the concept is genuine in the *hint's* language (C) and load-bearing for later
  lessons (pipeline-status underpins `&&`/`||`), and note the triviality.
  Verifiers flag these `too_small` with `scope`+`proxy` agreeing; triage as a
  language artifact, not a spec defect, when the hint-language work is real.
- **When two consecutive lessons are "handle the specific case" then "generalize to
  N", brief the first lesson's verifier to implement ONLY the specific case.** A
  shell's two-command-pipe lesson was verified by an agent that wrote the pipe loop
  generically over N stages, which collapsed the next lesson ("pipelines of any
  length") to a `too_small` no-op — its test passed with zero code change. The
  lessons split cleanly for a learner who hard-codes two stages first; the
  verifier just optimized. Tell the N-of-2 agent "wire exactly two children, do
  not generalize yet."
- **`git init` the verification repo with a `.gitignore` for build artifacts, and the
  orchestrator should `rm` stray binaries before each commit.** Lesson-agents that
  run `go build ./...` leave a binary named after the module dir; a plain
  `git add -A` silently committed it. Add `/<binary>` and `*.test` to `.gitignore`
  at init.
- **Validate your project's frontmatter standalone when the whole-repo build is blocked
  by an unrelated project.** `npx astro build` validates *all* content collections, so a
  concurrently-authored (or pre-existing broken) project elsewhere fails the build before
  your files are even reached. Write a tiny Node script that loads the repo's `js-yaml`
  (under `node_modules/.pnpm/js-yaml@*/...`) and parses just your `lesson-XX.md`
  frontmatter against the required fields — it isolates your work from other
  projects' breakage and is faster than a full build. (Also: a scalar starting with
  a backtick still fails YAML; single-quote every `checkpoint`/`goal`/`overview`
  that leads with `` ` `` — pervasive in symbol-heavy subjects like shells, regex,
  operators.)
- **A "wrap-and-bubble" mechanism is two lessons: introduce the wrapper, then unwrap
  it at the boundary.** In a tree-walker, `return` wraps its value in a `ReturnValue`
  that bubbles through blocks (one lesson), then the function-call boundary *unwraps*
  it so a function's return becomes an ordinary value to the caller (next lesson). The
  unwrap lesson alone is `too_small` (a ~5-line `if isReturnValue { return .Value }`) —
  don't merge it; enrich it with a second facet of the SAME idea: unwrapping happens at
  *every* call boundary, so a `return` in an inner function ends only the inner one
  (`fn(){ let g = fn(){ return 1 }; g(); return 2 }()` is `2`). Same shape as any
  bubble-a-signal mechanism (errors bubble like returns; break/continue later).
- **For a self-describing-vs-schema format, finalize's schema-LESS pretty-printer
  will mis-render ambiguous wire data, and that is honest, not a bug.** The protobuf
  demo's field-tree printer guesses a LEN payload is a string when it is valid UTF-8,
  so a packed-int field `[0x07,0x08,0x09]` prints as the control-char string
  `"\a\b\t"`. A LEN field is genuinely indistinguishable from bytes / packed-scalars
  / an embedded message without a schema - the schema mode resolves it correctly.
  Surface the ambiguity in `CAVEATS.md` rather than adding heuristics that pretend to
  disambiguate. The finalize pass here also completed the scalar family (the lessons
  only wired the exact types their specs tested - string/int32 - so Decode/Encode
  needed the full bool/enum/uint/sint/fixed/float/double/bytes/message set filled in)
  and hardened the reader against a length-prefix buffer overrun the happy-path
  lessons never hit. Expect finalize on a codec to (a) complete the type family and
  (b) add the overrun/truncation/bad-wire-type guards.
- **The finalize pass on a recursive-descent parser finds crashes at the STRUCTURE
  edges, where two container features meet - not at the scalar leaves the lessons
  drilled.** The TOML lessons each tested one container (arrays, inline tables,
  arrays-of-tables, dotted keys) in isolation; finalize found the parser panicked
  when a `[a.b]` header path reached THROUGH an empty or scalar value array
  (`existing.Arr[len-1]` on a plain `[]`), and silently created a DUPLICATE key when
  a dotted key walked through an existing scalar (`a = 1` then `a.b = 2`) instead of
  erroring. It also completed the introduced-but-not-finished `[[a.b]]` dotted
  array-of-tables header. Expect finalize on a parser to (a) add index/kind guards
  everywhere one container type is reached through another, (b) turn "silently
  duplicate / overwrite" into a positioned error, and (c) finish any header/key form
  the lessons demonstrated only in its single-segment shape. For a parser LIBRARY,
  finalize still adds a thin runnable demo (a `cmd/<name>` that pretty-prints a
  built-in config or a file and exits non-zero with the line/column error) plus a
  `String()`/`Dump()` display layer - the demo REUSES the library and is not itself
  a lesson deliverable.
- **The finalize pass on an interpreter/evaluator finds composition crashes the
  happy-path lessons never hit** — the same payoff as the search-engine's `df==0`
  guard, in a new subject. Here it caught a division-by-zero that *panicked* (lessons
  only tested `7/2`) and a parser that silently returned a partial AST instead of
  reporting its collected errors, plus completed a small family (string `==`/`!=`).
  For a RUN interpreter, finalize's entry point is a REPL **and** a source-file runner
  plus a zero-setup `--demo` that drives the whole pipeline (variables, a loop, a
  recursive fn, arrays + an in-language `map`, a hash) through `puts`. Expect finalize
  to turn every "assume the operand is valid" shortcut into a graceful error.
- **When a struct keeps BOTH a raw aggregate field and its parsed sub-fields, a mutator
  that edits the sub-fields but a serializer that rebuilds from the RAW field silently
  drop the mutation - a coherence gap the per-lesson specs miss and finalize catches.**
  The URL parser kept `Authority` (raw) plus `Userinfo/Host/Port`; `Normalize` lowercased
  `Host` and dropped the default `Port`, but `String()` recomposed from the untouched
  raw `Authority`, so `Normalize(u).String()` ignored the normalization entirely. No
  lesson spec exercised the composition (normalization lessons asserted sub-FIELDS;
  the recompose lesson round-tripped a freshly PARSED URI whose raw and sub-fields still
  agreed), so all 25 lessons were green while the library was incoherent. Finalize
  rebuilt `Authority` from the sub-fields inside `Normalize`. Two takeaways: (a) prefer
  a serializer that DERIVES the aggregate from sub-fields over one that echoes a stale
  raw capture; (b) finalize on a parser+normalizer library should explicitly test
  `mutate(parse(x)).String()`, the round-trip through BOTH layers, which no single
  lesson does.
- **For a time-driven project, PRE-COMPUTE every next-fire timestamp AND every weekday
  with a throwaway program in the SAME time library the verifiers use.** The weekday of a
  fixed date (is 2024-01-13 a Friday?) and the year a leap-day expression resolves to are
  exactly the values an author gets wrong by hand; a ~150-line Go scratch impl of the
  whole parser+matcher+scan locked all of them (`0 0 13 * 5` from 2024-01-10 -> Jan 12
  Fri, Jan 13 Sat, Jan 19 Fri - the OR quirk visible across three fires) before authoring,
  so the per-lesson subagents only confirmed buildability. Always drive tests and the
  finalize CLI from a FIXED reference instant (an `-at` flag defaulting to a documented
  timestamp like 2024-01-01T00:00:00Z), never `time.Now()`, or output is non-deterministic.
- **When a later lesson WIDENS a function's return signature (e.g. `Next(...) T` becomes
  `Next(...) (T, bool)`), the prior lesson's tests break at COMPILE time, not runtime -
  brief that verifier that updating the earlier call sites to the new form is the one
  sanctioned prior-code change.** Same class as the walking-skeleton handler evolution,
  but the failure is a build error, so an unbriefed verifier either refuses to touch the
  prior test or can't compile the suite. Name the exact old and new signatures in the brief.
- **Live-smoke a finalize CLI with its OWN documented invocation - Go's `flag` package
  stops parsing at the first non-flag arg.** A cron demo CLI took a positional expression
  plus `-at`/`-n` flags; `cron next '<expr>' -at ... -n 3` silently swallowed the flags as
  extra positionals (the expr must come AFTER its flags: `cron next -at ... -n 3 '<expr>'`).
  `go test` was green because the tests used the correct order. Run the exact command from
  the CLI's own usage/help text and from `CAVEATS.md`, both orders if the tool takes
  positionals + flags, before declaring it usable - or parse flags manually so order is free.

- **A three-way CLASSIFIER lesson (path absolute/rootless/empty, host reg-name/IPv4/IPv6)
  reads proxy(right)/felt(too_small) - keep it as a load-bearing setup lesson and enrich
  with a boundary assertion on the SAME predicate rather than renumber.** A URL parser's
  `classifyPath` mirrors an earlier `classifyHost` almost verbatim (short if/else-if,
  most of the diff is doc-comment + a table test), so verifiers flag felt-too_small even
  though the resolver genuinely branches on the three-way result. Fix in place: add a
  boundary facet (`/` is absolute, `.` is rootless) that the same leading-slash predicate
  already satisfies - fills the box, adds no concept, no project-wide renumber. Same
  keep-the-load-bearing-setup-beat call as the consistent-hashing edge lessons.

- **For a version/range grammar (SemVer, npm ranges), the spec's own worked precedence
  chain and desugaring table are the exact-value goldmine - PRE-COMPUTE the whole chain
  with a ~250-line throwaway reference impl before authoring.** A SemVer project locked
  every value in seconds: all parse rejects (leading zero, bad ident, empty), the full
  8-version chain `1.0.0-alpha < ... < 1.0.0`, every desugaring (`^0.2.3`->`>=0.2.3 <0.3.0`,
  `^0.0.3`->`>=0.0.3 <0.0.4`, `~1.2.3`->`>=1.2.3 <1.3.0`, `1.x`->`>=1.0.0 <2.0.0`), and
  the capstone sort+satisfy booleans - so all 24 per-lesson subagents only confirmed
  buildability, never discovered a value. The precompute reference IS basically the library,
  so it doubles as the finalize sanity check.
- **A range/pattern-desugaring library wants a "print the normalized form" lesson
  (`Range.String()` -> the plain comparators), NOT a sign-flipped mirror of a prior
  function.** A planned `MinSatisfying` (mirror of `MaxSatisfying`, only `<` vs `>`) got
  flagged too_small (pure copy-paste, verifier's own suggestion was "give it something new
  to teach"). Swapping it for a Range-normalization/print lesson is a genuinely-new one-idea
  beat that ALSO pins every desugaring as an exact string (the round-trip analog of a
  Version `String()`), and it hands finalize a display layer for free. When a chapter's 4th
  slot is a mirror function, prefer a serialization/normalization lesson - and check the
  capstone/overview don't reference the function you drop (they usually reference only the
  max/primary direction).
- **Front-loading the two-level OR-of-ANDs shape on the AND-set lesson makes the OR lesson
  a small-but-real extension - accept the too_small proxy.** Giving `Range = [][]Comparator`
  on the comparator-set lesson (with `Satisfies` already looping "any set") means the later
  `||` lesson is a ~10-line diff (split on `||`, wrap each piece) that proxies too_small,
  yet OR is a genuine distinct concept a learner must model. Same accept-the-small-diff call
  as a zero-code payoff lesson; the alternative (introducing the flat shape first, reshaping
  at the OR lesson) is the late-chapter refactor trap the front-load rule exists to avoid.
- **A permissive parser with no error return is finalize's reliable find on a matcher
  library: it silently drops unparseable input and then VACUOUSLY matches everything.**
  A SemVer `ParseRange` dropped a garbage token, leaving an empty comparator set that
  `Satisfies` treats as "matches every version" (so `satisfies 1.0.0 garbage` -> true).
  No per-lesson spec exercised malformed range input. Finalize added a validating front
  door at the CLI boundary (a `ParseRangeStrict`-style check) rather than changing the
  lesson-pinned `ParseRange` signature - same class as the search-engine `df==0` guard and
  the TOML container-edge crashes. For a range-matcher LIBRARY, finalize adds a thin
  `cmd/<name>` demo CLI (parse/compare/sort/satisfies + a no-arg built-in demo) that reuses
  the library unchanged and fails gracefully (clear "invalid version/range", non-zero exit)
  - live-run the no-arg demo AND an args invocation AND a bad-input invocation before
  reporting runs:true.

- **For a Pratt-parser / expression-evaluator LIBRARY, the whole exact-value goldmine is
  three things: fully-parenthesized `String()` renders, exact float results, and exact
  positioned error strings - PRE-COMPUTE all of them with a ~250-line reference impl
  (which IS basically the library) before authoring.** Pin binding powers as a table and
  pin the associativity/convention edges as renders AND results: left-assoc `10-3-2 ->
  ((10 - 3) - 2) -> 5`, right-assoc `2^3^2 -> (2 ^ (3 ^ 2)) -> 512`, and the unary-minus
  convention `-2^2 -> (-(2 ^ 2)) -> -4` (state it: unary minus binds LOOSER than `^`, so
  prefix bp 30 < `^` left bp 40; this matches Python/math). Parse chapter asserts via
  `Parse(s).String()`; eval chapter asserts via `EvalString(s, env)` - both language-neutral.
- **Front-load the whole error/env plumbing on the signatures from birth and it costs
  nothing.** `Parse(in) (Expr,error)` from lesson 1 of the parse chapter (error always nil
  until the errors chapter), `Eval(e, env) (float64,error)` + `type Env map[string]float64`
  from lesson 1 of the eval chapter, and a `Pos int` field set on EVERY AST node at parse
  time (from the operator/name token). Then the errors chapter is pure fill-in: divide-by-zero,
  undefined-name, and arity errors all read `n.Pos` (no signature widening, no refactor), and
  the eval errors are as positioned as the parse errors. The alternative (add error/env/Pos
  later) forces the exact compile-time signature-widening churn the front-load rule exists to
  avoid. Brief early verifiers that the always-nil error / empty env / unused Pos are the
  intended front-load, not dead code.
- **Trace which lesson EMITS each token kind, not just which declares it.** Declaring the
  full `Kind` enum on lesson 1 (EOF, Number, Operator, LParen, RParen, Ident, Comma, Illegal)
  is the right front-load, but a verifier caught that NO lesson ever added the tokenizer
  SCANNER RULE for `Comma` before the function-call lesson consumed it - the enum value sat
  emitted-by-nobody, so `max(1, 2, 3)` silently mis-parsed (the `,` fell through to Illegal).
  Fix: fold each structural token's one-line scanner rule into the lesson that first NEEDS it
  (the comma rule rides along with "parse comma-separated arguments", exactly as the identifier
  scanner rides along with the Var-parse lesson). When planning a lexer+parser, make a
  checklist: for every Kind, which lesson introduces its scan rule?
- **The eval chapter of an operator language is one meaty tree-walk lesson (the recursive
  Bin dispatch over `+ - * /`, ~15 min) followed by one-line payoff beats for each remaining
  operator (`^` via Pow, `%` via Mod, unary minus).** Each payoff beat is genuinely too_small
  by production diff (0 new defs, one switch case) but pins a distinct Design-Principle-#8 edge:
  right-assoc `2^3^2=512`, the FLOAT remainder `7.5%2=1.5`, the `-2^2=-4` convention. Keep them
  (they are the satisfying "it just works" beats and each proves a parse-chapter decision), but
  brief the verifier that too_small is expected, and be aware two-to-three consecutive one-liners
  is a mild lull - it is the honest shape of "parser did the hard part, evaluator just follows
  the tree." Do NOT merge distinct operators into one lesson to pad size (two operators = two
  behaviors, which trips too_big the other way).
- **Finalize on an expression-evaluator library adds a REPL that does assignment REPL-SIDE
  without touching the library grammar.** The calculator REPL scans each line for a top-level
  `=` (an identifier then `=`) and, if found, evaluates the RHS with the library and stores it in
  a persistent `Env` - the library's `Parse` never learns about assignment. Seed constants
  (`pi`, `e`) in the REPL's env only. Complete the one-arg builtin family in the same
  dispatch+arity style (floor/ceil/round). Fail-and-CONTINUE on any parse/eval error (print
  `error: <msg>`, keep the loop and the env). Live-smoke: run `-demo`, then pipe a multi-line
  script with an assignment, a use of it, a malformed line, and a following good line, and
  confirm the env persists past the error and the loop never crashes.

- **For a recalculation-DAG subject (spreadsheet engine, build system, reactive/dataflow
  graph), the topological graph must register EVERY computed/formula node up front - even one
  with NO precedents.** A precedent-free formula (`=1/0`, `=5+5`) has no incoming edge, so a
  buildGraph that only creates nodes from edges never registers it; Kahn's `topoOrder` then
  omits it, and a later "cells not in the order are a cycle" fallback misflags it `#CIRC!`.
  This is the DAG analog of the front-load-the-whole-shape rule: on the graph-build lesson,
  add every formula cell as a node (in-degree 0 by default) BEFORE adding precedent edges.
  A verifier only surfaces it at the first lesson that recalculates a precedent-free formula
  (division-by-zero), so pin a precedent-free node in the graph-build lesson's prose.
- **Pin the topological-sort TIE-BREAK (reading order: row then col) in the introducing
  lesson, and include literal SOURCE cells as in-degree-0 nodes so a pinned chain order is
  `[A1,B1,C1]` not `[B1,C1]`.** Kahn is free to pop any ready node; two natural orders
  (row-major vs column-major) diverge, so any pinned topo order / range expansion / precedent
  list is implementation-dependent without a stated convention - same class as the
  consistent-hash-ring collision rule. Use one comparator (`less` = Row then Col) everywhere:
  range expansion, precedent lists, ready-set ordering.
- **A spreadsheet/formula-graph engine is another exact-value goldmine: PRE-COMPUTE the whole
  chain (A1<->(col,row) incl. the multi-letter `AA`/`AB` base-26-bijective edge, range
  expansions, fully-parenthesized `parse().String()` renders, eval results, precedent sets,
  topo orders for a chain AND a diamond, incremental affected-sets + values, cycle flags,
  error propagation) with a ~500-line throwaway reference impl that IS basically the library.**
  All per-lesson verifiers then just confirm buildability/scope. Assert the parser via
  `parse(s).String()` (fully parenthesized: `1+2*3 -> (1 + (2 * 3))`, left-assoc
  `10-3-2 -> ((10 - 3) - 2)`, comparisons lowest bp `1+2>3 -> ((1 + 2) > 3)`).
- **A pure tagged-union type-definition lesson (`Value{Kind; Num; Str; Bool; Code}`) is
  legitimately too_small on its own (verifier felt ~8 min, 0 logic, "struct fields read back")
  - enrich it IN PLACE with a `String()`/render method, NOT a split.** The renderer is a second
  facet of the SAME type (Number->"42" no trailing zeros, Bool->"TRUE"/"FALSE", Err->its code),
  it's genuinely needed by the finalize demo that prints the grid, and it adds real logic + a
  testable behavior without a new concept. Same enrich-with-a-same-concept-facet rule as the
  too_small early data-holder lessons.
- **The "Set auto-recalculates and returns the changed cells" API-polish beat is a SAFE late
  widening in Go: `SetNumber(a,n)` -> `SetNumber(a,n) []Ref` does NOT break prior callers**
  (Go lets a caller ignore a return value), unlike a widening that changes arity or a
  `Next() T`->`Next() (T,bool)` change. Fold `recalcFrom` into the setter so an edit updates
  dependents with no explicit `Recalculate()` and returns the recomputed set (a UI/test can
  assert the ripple). Brief the verifier the unused return in earlier tests is expected.
- **For the incremental-recalc centerpiece ("edit recomputes ONLY dependents"), the negative
  assertion needs an unrelated FORMULA (`E1='=D1+1'`), not just a literal.** A literal is
  trivially never recomputed; only an unrelated formula outside the changed cell's transitive
  closure proves the affected-set filter actually excludes formulas, not just non-formulas.
  Pin: edit A1 recomputes `[B1,C1]` (with values) while D1 (literal) AND E1 (unrelated formula)
  stay untouched and out of the returned set.
- **Two trivial error-kind returns (`#NAME?` unknown-function default case + `#REF!` bare-range-
  in-scalar-context) belong in ONE lesson, even though a strict verifier reads "2 concepts =>
  too_big".** Both are one-line guards reusing the error-value + propagation mechanism already
  learned two lessons earlier (combined felt ~15 min); splitting yields two ~7-min too_small
  lessons. They are two facets of one idea ("the remaining invalid-element guards"), not two new
  mechanisms - keep them. CONTRAST with distinct operators (`^`, `%`), where each IS a real new
  behavior deserving its own beat: the split test is "is this a new mechanism, or another
  application of one already taught?"
- **Finalize on a recursive-descent formula/expression parser LIBRARY reliably finds a PANIC on
  malformed input (unbalanced parens / dangling operator / trailing tokens walk the token cursor
  past EOF -> index-out-of-range).** The happy-path lessons never feed a malformed formula. The
  fix: make `peek()`/`next()` bounds-safe and route a structurally-bad formula to an `ErrorNode`
  that evaluates to a graceful error value (`#ERROR!`) instead of crashing. Same class as the
  search-engine `df==0` guard and TOML container-edge crashes. For a library the finalize also
  adds a thin `cmd/<name>` demo that REUSES the library unchanged (build a sheet, print the grid,
  edit + reprint the recompute list, show a flagged cycle and a propagating error) - live-run it.

- **For a "reproduce a real tool's exact output/ids" project (Git object ids, a
  checksum/format that a canonical CLI computes), PRE-COMPUTE every value TWICE: once
  with the real tool's plumbing in a throwaway workspace, and once from scratch in the
  target language, then diff them before authoring.** For build-git a ~90-line bash
  script (`git hash-object`/`git mktree`/`git commit-tree` with fixed
  GIT_AUTHOR_DATE/GIT_COMMITTER_DATE) pinned every blob/tree/commit id, and a ~120-line
  from-scratch Go `ref.go` reproduced all of them - the from-scratch match is what PROVES
  the byte-exact formula (see the git-encoding notes below) before a single lesson is
  written. All 41 per-lesson agents then only confirmed buildability/scope; not one had
  to discover a value. Pick a FIXED identity+timestamp so commit ids are reproducible.
- **Git tree encoding has three byte-exact traps a from-scratch impl must nail, each a
  Design-Principle-#8 edge worth its own pin:** (a) the id inside a tree entry is the
  20 RAW bytes of the sha, not the 40 hex chars; (b) a directory's mode is stored as
  `40000` (no leading zero) in the hashed body but `git cat-file -p` DISPLAYS it padded
  to `040000` - pin both and say which is which, mixing them changes the hash (Go
  `fmt.Sprintf("%06s", mode)` zero-pads a string left, confirmed); (c) entries sort by
  name BYTE order but a directory sorts as if its name ended in `/`, so `sub.txt` < `sub`
  (`.`=0x2E < `/`=0x2F). The slash rule only bites when a file and dir share a prefix, so
  give the flat-tree lesson a plain-name sort and REFINE it in a dedicated one-idea edge
  lesson (earlier no-collision trees stay green).
- **Never pin zlib/deflate-compressed bytes of a stored object - pin the INFLATED
  content.** Compression level varies by library, but the hash is taken over the
  uncompressed `"<type> <size>\0<content>"`, so ids match the real tool regardless of
  compression. Assert on what you get back after inflating.
- **A one-line pure-formatter lesson (an identity/timestamp line, a header render) reads
  too_small on its own; enrich IN PLACE by adding the INVERSE (parse) as the second facet
  of one "the precise shape, written and read" idea** - and the parse is genuinely reused
  by the later read-the-object lesson, so it is load-bearing, not padding. Beats merging
  (which renumbers the whole project). Same enrich-with-a-same-concept-facet rule as the
  too_small data-holder lessons.
- **When a hint references a handle's struct FIELD (`r.Root`), the first verifier fixes
  its exported/unexported form and every later agent re-flags the hint mismatch as a
  "defect".** It is a cosmetic hint-vs-impl-choice, never a spec bug. State the
  established shape in the "state so far" line of later briefs ("the Repo field is
  unexported `root`") so the chain stops re-reporting it. The hints stay internally
  consistent (a learner defines their own handle); do not churn them.
- **A build-your-own-Git/VCS project is the sharpest case of the .git-deletion hazard:
  the verify repo is itself a git repo AND the tool manages its own data dir.** Force the
  tool to store under its OWN dir (`.mygit/`) rooted at a passed-in path, and make every
  test use `t.TempDir()` as that root so it never writes near the real `.git`. Put the
  ban on ALL git in every brief - "even read-only `git status`", because several agents
  still ran `git status` "to sanity-check" despite a plain "do not commit" (harmless, but
  confirm `git rev-list --count HEAD` after any such report). Keep the `cp -r .git` backup
  + restore-before-commit; no agent deleted `.git` this run, the backup is cheap insurance.
- **The headline "the ids match the real tool" payoff MUST be cross-checked end-to-end at
  finalize by pointing the REAL tool at the library's own output.** For build-git,
  `git --git-dir=<demo>/.mygit cat-file -p <id>` read the library's commit, tree (showing
  `040000 src`), and blob byte-for-byte - because the tool's data dir is a valid git dir
  (objects/ fan-out + refs/ + HEAD). Do this yourself (agents can't run git); it is the
  most convincing proof the project delivered. Generalizes: whenever the deliverable
  claims compatibility with an external tool/format, drive that external tool over the
  deliverable's output as the final acceptance check.
- **A porcelain that hooks into two subsystems (Git commit: parent-FROM-HEAD in,
  branch-move out) is ONE idea with two mechanical halves - keep it one lesson**, then let
  the very next lesson be a zero-code payoff ("a second commit just advances") proving it.
  The signature-widening (explicit-parents -> auto-from-HEAD) is a compile-time break of
  the earlier porcelain lesson's one call site: brief that the sanctioned prior-code change
  ALSO includes an added `SetHEAD` (the HEAD reader had no missing-file tolerance unlike
  the resolver), not just the arg drop.
