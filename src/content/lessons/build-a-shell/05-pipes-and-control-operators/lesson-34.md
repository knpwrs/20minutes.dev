---
project: build-a-shell
lesson: 34
title: Reaping finished jobs
overview: The final piece is cleaning up after background jobs so they do not pile up as zombies. Today the shell checks for finished jobs before each prompt and reports them done - and your shell is complete.
goal: Before each prompt, reap any finished background jobs without blocking, and report each as done.
spec:
  scenario: Reaping a completed background job
  status: failing
  lines:
    - kw: Given
      text: 'a background job "[1]" was started and has since finished'
    - kw: When
      text: the shell is about to print the next prompt
    - kw: Then
      text: 'it reports the job as done, e.g. "[1]+ Done", and removes it from the job table'
    - kw: And
      text: 'the finished child leaves no zombie process behind'
code:
  lang: c
  source: |
    // non-blocking sweep: reap any child that has finished, don't wait
    pid_t pid;
    while ((pid = waitpid(-1, &st, WNOHANG)) > 0) {
        Job *j = find_job(pid);
        printf("[%d]+ Done\n", j->num);
        remove_job(j);
    }
checkpoint: Background jobs are reaped and reported. Your shell is complete. Commit and stop here.
---

A background child that finishes does not disappear - it becomes a **zombie**, a
dead process the kernel keeps around only so its parent can read its exit status.
If the shell never collects that status, zombies accumulate. The fix is to
**reap** finished jobs, and the natural moment is **just before each prompt**:
sweep for any child that has exited, report it, and forget it.

The tool is a **non-blocking wait** - ask for any finished child but with the
"don't block" flag, so if nothing has finished the shell moves on and prints the
prompt without hanging. For each child it does reap, look up its job number, print
a `Done` notice, and drop it from the table. That is the whole job-control story at
its simplest: launch without waiting, then clean up lazily at the next prompt. With
this, your shell reads, parses, expands, redirects, pipes, sequences, and manages
background jobs - a real, working shell.
