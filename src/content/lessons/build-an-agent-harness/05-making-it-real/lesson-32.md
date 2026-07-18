---
project: build-an-agent-harness
lesson: 32
title: An approval gate
overview: Some tools should never run unsupervised - sending an email, deleting a file. Today a registered tool can require approval, and only runs once something outside the model actually says yes.
goal: Build an approval gate so a tool marked as requiring approval only runs, and only produces its real side effect, once approved.
spec:
  scenario: An approved call runs the tool for real
  status: failing
  lines:
    - kw: Given
      text: 'a send_email tool registered as requiring approval, whose function increments a counter and returns "sent"'
    - kw: And
      text: 'a tool_use call with id "toolu_01L32APPROVEEXAMPLE01", name "send_email", and input {"to": "team@example.com", "body": "Standup moved to 10am."}'
    - kw: And
      text: 'an approver that approves every call it is asked about'
    - kw: When
      text: 'the call is dispatched through the approval gate'
    - kw: Then
      text: 'the result is a tool_result block whose tool_use_id is "toolu_01L32APPROVEEXAMPLE01" and whose content is "sent"'
    - kw: And
      text: 'the counter is 1 - approval let the tool''s real function run'
code:
  lang: go
  source: |
    type Approver func(call ContentBlock) bool
    func (r *Registry) DispatchWithApproval(call ContentBlock, approve Approver) ContentBlock {
        t, ok := r.tools[call.Name]
        if ok && t.RequiresApproval && !approve(call) {
            return ContentBlock{} // lesson 33 fills this branch in
        }
        return r.Dispatch(call)
    }
checkpoint: A tool marked as requiring approval now only produces its real side effect once something outside the model has said yes. Commit and stop for today.
---

Every tool dispatched so far has run the instant the model asked for it - reasonable for `get_weather`, less reasonable for a tool that sends an email or deletes a file on someone's behalf. An **approval gate** adds one check in front of dispatch: a tool registered with `RequiresApproval` does not run until an `Approver` - a human clicking allow, a policy check, anything outside the model itself - has said yes for that specific call.

Today only the approved path matters: consult the approver, and if it says yes, dispatch exactly as lesson 12 always has. The tool's real function - the one with the actual side effect - only ever runs on the far side of that check. Nothing about the tool_use block, the registry, or the resulting tool_result changes shape; the gate sits entirely in front of them, and an approved call is indistinguishable from one that was never gated at all.
