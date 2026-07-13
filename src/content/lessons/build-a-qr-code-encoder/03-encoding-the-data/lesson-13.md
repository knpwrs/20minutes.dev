---
project: build-a-qr-code-encoder
lesson: 13
title: The alphanumeric table
overview: 'Alphanumeric mode is the compact way to encode uppercase text, digits, and a handful of symbols, and it starts from a fixed 45-value table. Today you build that lookup from character to value.'
goal: 'Map each supported character to its alphanumeric value in the 45-entry table.'
spec:
  scenario: 'Characters map to alphanumeric values'
  status: failing
  lines:
    - kw: Given
      text: 'the ordered alphanumeric alphabet 0-9, then A-Z, then the nine symbols (space) $ % * + - . / :'
    - kw: When
      text: 'the values of ''0'', ''A'', ''H'', ''O'', (space), and '':'' are looked up'
    - kw: Then
      text: '''0'' is 0, ''A'' is 10, ''H'' is 17, and ''O'' is 24'
    - kw: And
      text: 'the nine trailing symbols map in order - space=36, ''$''=37, ''%''=38, ''*''=39, ''+''=40, ''-''=41, ''.''=42, ''/''=43, '':''=44 - and a character outside the 45 (a lowercase letter, a comma) is rejected as not encodable in alphanumeric mode'
code:
  lang: go
  source: |
    // Position in this exact string IS the value. Index 0..44.
    const alnum = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:"
    func alnumVal(c byte) (int, bool) {
      i := strings.IndexByte(alnum, c)
      return i, i >= 0
    }
checkpoint: 'You can look up the alphanumeric value of any supported character. Commit and stop here.'
---

QR supports several data **modes**, and alphanumeric mode is the one that fits our worked example. It covers 45 characters: the digits `0-9` (values 0 to 9), the uppercase letters `A-Z` (values 10 to 35), and nine symbols - space, `$ % * + - . / :` - taking values 36 to 44. There are no lowercase letters here; text that needs them uses byte mode instead (later this chapter).

The table is just this ordered alphabet, and a character's **value is its position** in it. So `H` is the 18th entry counting from zero, value `17`, and `:` is the very last, value `44`. Keep the "and can this even be encoded" answer alongside the value, because a lowercase letter or an unlisted symbol has no alphanumeric value at all and the encoder must fall back to another mode rather than emit garbage. These values feed directly into the packing step next.
