---
project: build-git
lesson: 15
title: 'add: staging a file'
overview: 'The add command is where working files enter Git. It reads a file, stores its contents as a blob, and records the path in the index. Today you wire those two halves together.'
goal: 'Stage a file by hashing its contents into a blob and recording it in the index.'
spec:
  scenario: Adding a file stores a blob and records it
  status: failing
  lines:
    - kw: Given
      text: 'a working file hello.txt whose contents are hello and a newline'
    - kw: When
      text: 'Add(index, hello.txt) is called'
    - kw: Then
      text: 'the blob ce013625030ba8dba906f756967f9e9ca394464a is written to the object store'
    - kw: And
      text: 'the index has an entry for hello.txt with mode 100644 and that id'
code:
  lang: go
  source: |
    // read the file, store it as a blob, record path -> (mode, id)
    func (r *Repo) Add(ix *Index, path string) error {
      data, err := os.ReadFile(filepath.Join(r.Root, path))
      id, err := r.WriteObject("blob", data)
      ix.Set(path, "100644", id)
      return err
    }
checkpoint: 'You can stage a real file into the index. Commit and stop here.'
---

`add` is the first command that touches your actual files. It does exactly two
things: **store** the file's current contents as a blob (reusing `WriteObject`,
so identical content is a no-op), and **record** the path in the index with the
resulting id. After this, the file's content is safely in the object database and
the index knows to include it in the next commit.

Notice `add` decouples content from name: the blob is content-addressed and knows
nothing about the filename, while the index entry ties a path to that blob. Two
files with identical bytes share one blob but get two index entries. For now every
file gets mode `100644`, the mode for an ordinary file; the next lesson handles
the one case where that changes.
