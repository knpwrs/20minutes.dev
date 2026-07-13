---
project: build-git
lesson: 18
title: 'write-tree for a flat index'
overview: 'write-tree turns the staging area into a tree object, the bridge from index to commit. Today you handle the flat case, an index with no subdirectories, and its id matches the tree you built by hand earlier.'
goal: 'Turn a flat index into one tree object.'
spec:
  scenario: A flat index becomes a tree
  status: failing
  lines:
    - kw: Given
      text: 'an index holding hello.txt (100644, ce013625030ba8dba906f756967f9e9ca394464a) and README.md (100644, 0805455a24b6c68fbc38d0fa5d121f735984285d), neither in a subdirectory'
    - kw: When
      text: 'WriteTreeFromIndex builds a tree from the index entries'
    - kw: Then
      text: 'it returns 3aa9b583db8437a8dabb60b4b4c86ae87c17de85, the same tree those two files produced earlier'
    - kw: And
      text: 'that tree object is stored, so cat-file can read it back'
code:
  lang: go
  source: |
    // each index entry with no slash in its path is one file entry
    func (r *Repo) WriteTreeFromIndex(ix *Index) (string, error) {
      var entries []Entry
      for _, p := range ix.Paths() {
        e := ix.entries[p]
        entries = append(entries, Entry{Mode: e.Mode, Name: p, Id: e.Id})
      }
      return r.WriteTree(entries)
    }
checkpoint: 'You can turn a flat index into a tree. Commit and stop here.'
---

`write-tree` is the operation that snapshots the staging area into a real object.
For a flat index (no subdirectories) it is almost trivial: every entry becomes a
tree entry with the same mode, name, and id, and you hand them to the `WriteTree`
you already built, which sorts and hashes them. The payoff is the point: an index
staged from `hello.txt` and `README.md` produces the identical tree id you got by
constructing those entries directly, `3aa9b583...`.

This closes the loop between the index and the object store: staged files become a
content-addressed tree, ready to be committed. The next lesson handles the harder
case, an index whose paths reach into subdirectories, which is where `write-tree`
has to build nested trees.
