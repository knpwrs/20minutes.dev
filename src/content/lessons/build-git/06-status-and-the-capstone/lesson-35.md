---
project: build-git
lesson: 35
title: 'A working file''s would-be id'
overview: 'To tell whether a file has changed, we compute what its blob id would be right now, without storing anything. Today you build that comparison primitive, the basis of status.'
goal: 'Compute a working file''s blob id from its current contents, without writing it to the store.'
spec:
  scenario: A file's current content hashes to a blob id
  status: failing
  lines:
    - kw: Given
      text: 'a working file hello.txt whose contents are hello and a newline'
    - kw: When
      text: 'WorkingId(hello.txt) hashes its current contents as a blob'
    - kw: Then
      text: 'it returns ce013625030ba8dba906f756967f9e9ca394464a'
    - kw: And
      text: 'nothing is written to the object store (this is hash-object without the store step), and after changing the file to hello world and a newline it returns 3b18e512dba79e4c8300dd08aeb37f8e728b8dad'
code:
  lang: go
  source: |
    // hash the file's current bytes; do NOT write to the store
    func (r *Repo) WorkingId(path string) (string, error) {
      data, err := os.ReadFile(filepath.Join(r.Root, path))
      return HashObject("blob", data), err
    }
checkpoint: 'You can compute a file''s current blob id. Commit and stop here.'
---

Comparing files by content is easy once everything is content-addressed: two files
are identical exactly when their blob ids match. To ask "has `hello.txt` changed
since I staged it?" we compute what its blob id **would be** from its current
contents and compare that to the id recorded in the index. This is `hash-object`
without the `-w` that writes: pure hashing, no store side effect.

That single primitive is all `status` needs. Because the id is a fingerprint of the
bytes, we never diff file contents directly; we just compare 40-hex ids. Change one
byte and the id changes completely, so `hello\n` gives `ce013625...` and
`hello world\n` gives `3b18e512...`. The next lessons turn this comparison into a
classification of every path.
