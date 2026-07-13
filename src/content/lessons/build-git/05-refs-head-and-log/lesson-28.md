---
project: build-git
lesson: 28
title: 'HEAD is a symbolic ref'
overview: 'HEAD tells Git which branch you are on. It does not hold a commit id directly; it points at a branch by name. Today you build that symbolic ref and read the branch it names.'
goal: 'Store HEAD as a symbolic ref and read out the branch it points to.'
spec:
  scenario: HEAD points at a branch by name
  status: failing
  lines:
    - kw: Given
      text: 'an initialised repository'
    - kw: When
      text: 'SetHEAD(refs/heads/main) writes HEAD, then ReadHEAD reads it'
    - kw: Then
      text: 'the file .mygit/HEAD contains the text ref: refs/heads/main followed by a newline'
    - kw: And
      text: 'ReadHEAD reports that HEAD is symbolic and names refs/heads/main'
code:
  lang: go
  source: |
    // HEAD holds "ref: <refname>\n" when it points at a branch
    func (r *Repo) SetHEAD(refname string) error {
      full := filepath.Join(r.Root, ".mygit", "HEAD")
      return os.WriteFile(full, []byte("ref: "+refname+"\n"), 0o644)
    }
    // ReadHEAD: if the file starts with "ref: ", the rest is the branch name
checkpoint: 'HEAD names the current branch. Commit and stop here.'
---

**HEAD** answers "where am I?" Almost always it points at a branch rather than a
commit, so that when you commit, the branch moves and HEAD follows along. It does
this by being a **symbolic ref**: the file `.mygit/HEAD` contains the text
`ref: refs/heads/main`, naming another ref instead of holding an id. Being on the
`main` branch just means HEAD says `ref: refs/heads/main`.

This indirection is what makes committing work naturally: HEAD points at the
branch, the branch points at the latest commit, and advancing the branch keeps
HEAD correct for free. Reading HEAD, then, has two steps in general, and today you
do the first: recognise the `ref: ` prefix and pull out the branch name. Next
lesson you follow that name the rest of the way to a commit id.
