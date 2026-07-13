# Scope rubric — is a lesson about 20 minutes?

A lesson is sized for a competent engineer who is **new to the topic**: read the
overview and spec, write the minimal code that satisfies it, and confirm it — all
in one sitting. Judge by the **primary signals first**; use the **diff proxies**
as an objective cross-check against the felt estimate.

## Primary signals (these decide it)

- **Concepts introduced: exactly 1.** Two new concepts ⇒ `too_big`, always.
- **Distinct behaviors under test: 1** (occasionally 2 facets of the *same*
  idea). Several independent behaviors ⇒ `too_big`.
- **Implementation shape:** one function/method or one small type — logic the
  learner can hold in their head, not an open-ended design with several viable
  architectures.
- **No bundled tool/library learning:** needing to learn a new API *and* apply it
  the same lesson ⇒ `too_big` (setup belongs on its own lesson).

`too_small` if any: no real logic (rename, config, a one-liner); < ~5 minutes of
work; or the test asserts something already true from an earlier lesson.

## Diff proxies (objective cross-check, from the lesson's commit)

Read the lesson's commit — `git show --stat HEAD` — and count new definitions and
tested behaviors. These bands are **rough anchors, not rules**: a dense 30-line
algorithm can be a full 20 minutes while 80 lines of boilerplate is 10. Always
weight concepts/behaviors above raw line counts.

| band        | changed lines | files | new funcs/types | behaviors tested |
| ----------- | ------------- | ----- | --------------- | ---------------- |
| `too_small` | < ~10         | 1     | 0               | 0–1 trivial      |
| `right`     | ~15–80        | 1–3   | 1 (rarely 2)    | 1–2, same idea   |
| `too_big`   | > ~120        | ≥ 4   | ≥ 3             | ≥ 3 distinct     |

## Reporting

Report **both** the felt human-time estimate (`scope`, `scope_estimate_min`) and
the proxy band (`proxy_scope`) with its raw signals. When they **disagree** — a
small diff that is genuinely hard to reason about (longer than the lines suggest),
or a large but mechanical diff (shorter) — say so and state which to trust and
why. Disagreement is a flag for the author to look closely, not noise.
