---
project: build-a-shell
lesson: 33
title: Background jobs
overview: A trailing `&` runs a command in the background so you get your prompt back immediately. Today you launch a job without waiting for it, and announce it the way a shell does.
goal: Run a pipeline ending in `&` in the background - do not wait for it, and print its job number and process id.
spec:
  scenario: Launching a background job
  status: failing
  lines:
    - kw: Given
      text: 'the line: sleep 1 &'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'the shell returns to the prompt immediately without waiting for sleep to finish'
    - kw: And
      text: 'it prints a job line like "[1] 12345" (a job number and the child''s process id)'
code:
  lang: c
  source: |
    pid_t pid = fork();
    if (pid == 0) { /* set up + exec the pipeline */ }
    if (background) {
        printf("[%d] %d\n", job_num, pid);   // announce, do NOT waitpid
        record_job(job_num, pid);            // remember it for later
    } else waitpid(pid, &st, 0);
checkpoint: '`sleep 5 &` gives you your prompt back. Commit and stop here.'
---

A command that ends in `&` runs in the **background**: the shell starts it and
then, instead of waiting, hands you the prompt right back so you can keep working
while it runs. The only mechanical difference from a normal command is that you
**skip the wait** - you fork and exec exactly as before, but do not `waitpid` for
the child to finish.

When it launches a background job, a shell prints a line like `[1] 12345`: the
**job number** (a small counter the shell assigns) and the child's **process id**.
Because you are not waiting, you must **remember** the job - stash its number and
pid in a small table - because a child you never wait for becomes a **zombie** when
it finishes, and someone has to clean it up. Announcing and recording the job today
sets up tomorrow, where you reap finished jobs and report them done.
