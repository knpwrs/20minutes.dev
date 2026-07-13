---
project: build-a-csv-parser
lesson: 12
title: Spaces are significant
overview: CSV does not trim your fields for you, so a space next to a comma is part of the value. Today you confirm that leading and trailing spaces are preserved, and that a space before a quote stops it from opening a quoted field.
goal: Preserve leading and trailing spaces in fields, and treat a leading space as defeating a quote.
spec:
  scenario: Significant surrounding whitespace
  status: failing
  lines:
    - kw: Given
      text: 'the input with spaces around each field, space a space comma space b space, that is the raw characters space a space comma space b space'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the spaces are kept, giving [" a ", " b "]'
    - kw: And
      text: 'a space before a quote means the field does not start with a quote, so space quote x quote parses to one literal field " \"x\"" rather than the quoted value x; a whitespace-only field is preserved, so a,   ,b gives ["a", "   ", "b"]; and a trailing space before a newline survives, so "a \nb" gives [["a "], ["b"]]'
code:
  lang: go
  source: |
    // do nothing special for ' ': a space is an ordinary rune, appended like any other
    // the quoted-vs-unquoted decision still hinges on the FIRST rune of the field:
    //   first rune is '"'      -> quoted
    //   first rune is a space  -> unquoted; the space (and any later '"') are literal
checkpoint: Leading and trailing spaces are preserved, and a leading space defeats quoting. Commit and stop here.
---

CSV has no built-in notion of trimming. A field is exactly the characters between
its delimiters, spaces included, so ` a ` with a space on each side is a
three-character value and not `a`. Treating whitespace as significant by default is
the honest choice, because the parser cannot know whether those spaces are noise or
data, and it keeps the round trip exact. If a user wants trimming they will ask for
it, which is a dialect option you add in the next chapter; the default preserves
what is there.

This connects directly to the start-of-field quoting rule. Because a field is quoted
only when its **first** character is a double quote, a single leading space changes
everything: `" a "` opens with a space, so the field is unquoted and the quotes
inside it are literal characters. This is a common surprise in hand-edited files
where someone adds a space after a comma for readability and accidentally disables
quoting for that field. Confirming both halves here, that spaces are kept and that a
leading space defeats a quote, makes the parser's behavior around whitespace fully
predictable before you add the option to trim it away.
