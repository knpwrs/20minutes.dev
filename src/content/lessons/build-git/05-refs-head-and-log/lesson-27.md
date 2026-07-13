---
project: build-git
lesson: 27
title: 'Branch refs'
overview: 'A branch is nothing more than a file holding a commit id. Today you build refs, the named pointers that let a human say main instead of a 40-character hash.'
goal: 'Store and read a branch ref as a file containing a commit id.'
spec:
  scenario: A ref stores and returns a commit id
  status: failing
  lines:
    - kw: Given
      text: 'an initialised repository and the commit f18e98d326b190d096879422d56d4ac5cf572db1'
    - kw: When
      text: 'UpdateRef(refs/heads/main, that id) is called'
    - kw: Then
      text: 'a file exists at .mygit/refs/heads/main whose contents are the 40-hex id followed by a newline'
    - kw: And
      text: 'ReadRef(refs/heads/main) returns f18e98d326b190d096879422d56d4ac5cf572db1'
code:
  lang: go
  source: |
    // a ref is a file under .mygit containing "<id>\n"
    func (r *Repo) UpdateRef(name, id string) error {
      full := filepath.Join(r.Root, ".mygit", name)
      os.MkdirAll(filepath.Dir(full), 0o755)
      return os.WriteFile(full, []byte(id+"\n"), 0o644)
    }
checkpoint: 'You can store and read branch refs. Commit and stop here.'
---

The commit graph is content-addressed, so every commit already has a permanent
name: its hash. But humans do not want to track 40-hex strings, and history needs
movable labels. A **ref** solves both: it is a file under `.mygit/refs` whose
contents are a single commit id plus a newline. The branch `main` is literally the
file `.mygit/refs/heads/main` holding the id of the latest commit on that branch.

That is the whole mechanism. To move a branch forward you overwrite its file with
a new commit id; to read where a branch points you read the file. Branches are
cheap precisely because they are one small file each. Next we handle the special
ref that says which branch you are currently on.
