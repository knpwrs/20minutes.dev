---
project: build-git
lesson: 7
title: 'cat-file: type, size, and content'
overview: 'Git''s cat-file command inspects an object by splitting the header back off. Today you build it, giving us the first real porcelain command and a clean way to read any object''s type, size, and content.'
goal: 'Parse a stored object into its type, size, and content, and fail clearly on a missing object.'
spec:
  scenario: cat-file reports an object's parts
  status: failing
  lines:
    - kw: Given
      text: 'a repository holding the blob ce013625030ba8dba906f756967f9e9ca394464a'
    - kw: When
      text: 'CatFile(id) reads and parses it'
    - kw: Then
      text: 'the type is blob, the size is 6, and the content is the bytes hello and a newline'
    - kw: And
      text: 'CatFile of an id that is not stored returns a clear object-not-found error rather than a panic'
code:
  lang: go
  source: |
    // ReadRaw, then split on the first NUL into header and content
    func (r *Repo) CatFile(id string) (typ string, size int, content []byte, err error) {
      raw, err := r.ReadRaw(id) // handles a missing file
      i := bytes.IndexByte(raw, 0)     // header is raw[:i], content is raw[i+1:]
      // header is "<type> <size>"; parse the two fields
    }
checkpoint: 'You can inspect any stored object by id. Commit and stop here. Try git cat-file -p on the same id to see the same content.'
---

The header we so carefully wrote now pays off. To turn raw serialized bytes into
a useful answer, find the first NUL byte: everything before it is the
`"<type> <size>"` header, everything after it is the content. Split the header on
the space to recover the type word and the declared size. That is the whole of
Git's `cat-file` inspection, and it works for every object type.

This is our first **porcelain** command, the friendly layer over the plumbing.
It also fixes where errors surface: asking for an id that was never stored should
give a clear "object not found" message, not a crash deep in the reader. Real Git
answers `git cat-file -t`, `-s`, and `-p` for exactly these three pieces, and
running it against your stored blob prints the same `hello`. That cross-check with
real Git is a theme we return to at every layer.
