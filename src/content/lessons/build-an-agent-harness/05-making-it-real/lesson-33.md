---
project: build-an-agent-harness
lesson: 33
title: A denied call the model can see
overview: A denial is not silence - it goes back as an ordinary tool_result, marked is_error, the same convention chapter 2's failing tool used. Today you deny a call and watch the model react to it.
goal: Deny an approval-gated call and confirm the tool's side effect never runs, then run the full loop and confirm the model's next turn responds to the denial.
spec:
  scenario: A denied call that the model then reacts to
  status: failing
  lines:
    - kw: Given
      text: 'the same send_email tool and call as lesson 32, but this time an approver that denies every call it is asked about'
    - kw: When
      text: 'the call is dispatched through the approval gate'
    - kw: Then
      text: 'the result is a tool_result block whose tool_use_id is still "toolu_01L32APPROVEEXAMPLE01", whose content is exactly "denied: the user did not approve this call to send_email", and whose is_error is true'
    - kw: And
      text: 'the counter stays 0 - the tool''s real function never ran'
    - kw: When
      text: 'the whole loop instead runs on a user message asking to email the team, with that same denying approver, against a server that replies first with the send_email call and then, once it sees the denial, with a closing text turn'
    - kw: Then
      text: 'the loop stops after exactly 2 turns with reason "end_turn", and the final transcript holds exactly 4 messages: the user''s request, the assistant''s send_email call, a user message carrying that denied tool_result, and the assistant''s closing reply'
    - kw: And
      text: 'that closing reply''s text is exactly "Understood — I won''t send that email without your approval." - the model saw the denial and adapted instead of assuming the email went out'
code:
  lang: go
  source: |
    // the loop needs to know how to ask, so it takes an approve function -
    // an approval-aware entry point alongside the plain loop from lesson 14.
    // inside dispatch, denial is never a dropped call: it's an ordinary
    // tool_result with is_error true, which the next turn will see.
    if ok && t.RequiresApproval && !approve(call) {
        msg := fmt.Sprintf("denied: the user did not approve this call to %s", call.Name)
        return ToolResultBlock(call.ID, msg, true)
    }
checkpoint: A denial now reaches the model as a visible, ordinary tool_result instead of vanishing silently, and you have seen it change what the model says next. Commit and stop for today.
---

A denial could be implemented as simply not calling the tool's function and quietly returning nothing, but that leaves the model waiting on an answer to a call it thinks is still pending. Instead a denial becomes an ordinary `tool_result`, `is_error: true`, with content that says plainly what happened - exactly the convention lesson 15 built for a tool that fails on its own. Approval and correctness are different reasons a call can fail, but the model does not need a third shape to understand either one.

That is what makes today's second scenario worth running the full loop for rather than just checking `DispatchWithApproval` in isolation: the point is not only that the side effect never happens, but that the *model sees the refusal and adapts* - answering the user honestly about what it could not do instead of assuming the email went out. A gate that silently drops a denied call would leave that adaptation impossible; one that reports it, the way lesson 15 already taught this project to, gets it for free.
