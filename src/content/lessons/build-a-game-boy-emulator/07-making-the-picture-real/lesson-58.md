---
project: build-a-game-boy-emulator
lesson: 58
title: The timer interrupt
overview: Lesson 38 gave you DIV, the free-running divider. The programmable timer is what games actually schedule work with, it counts up at a rate the ROM picks, and when it overflows it reloads and fires an interrupt. Today you build TIMA, TMA, and TAC and request the timer interrupt on overflow, so a ROM waiting on the timer finally gets woken.
goal: Add the programmable timer (TIMA 0xFF05, TMA 0xFF06, TAC 0xFF07), counting TIMA at TAC's rate and, on overflow, reloading from TMA and requesting the timer interrupt (IF bit 2).
spec:
  scenario: TIMA overflows, reloads, and requests the interrupt
  status: failing
  lines:
    - kw: Given
      text: TAC (0xFF07) is 0x05 (timer enabled, rate bits 01 = one tick per 16 cycles), TIMA (0xFF05) is 0xFF, TMA (0xFF06) is 0xAB, and IF (0xFF0F) is 0x00
    - kw: When
      text: the timer is advanced by 16 cycles (one TIMA tick)
    - kw: Then
      text: TIMA overflows and reloads to TMA's value 0xAB (not 0x00)
    - kw: And
      text: the timer interrupt is requested — IF bit 2 (0x04) is set
    - kw: And
      text: with TAC bit 2 clear (timer disabled) TIMA never changes no matter how many cycles pass
code:
  lang: go
  source: |
    // TAC (0xFF07): bit 2 = enable; bits 1-0 = rate select, cycles per TIMA tick =
    //   00 → 1024, 01 → 16, 10 → 64, 11 → 256.
    // While enabled, accumulate cycles and tick TIMA (0xFF05) once per that many.
    // On a tick that pushes TIMA past 0xFF: set TIMA = TMA (0xFF06) — NOT 0 — and
    // request the timer interrupt by setting bit 2 of IF (0xFF0F). DIV (lesson 38) keeps
    // free-running independently. When TAC bit 2 is clear, TIMA holds still.
reading: 'The programmable timer — TIMA/TMA/TAC and the overflow interrupt (IF bit 2).'
checkpoint: The timer now counts at the ROM's chosen rate and fires its interrupt on overflow, reloading from TMA. A ROM's timed events finally tick. Commit and stop here.
---

The `DIV` register from lesson 38 just runs; you cannot control it. The **programmable
timer** is the one games steer. Three registers drive it: `TIMA` (`0xFF05`) is the
counter, `TAC` (`0xFF07`) turns it on and picks one of four speeds, and `TMA`
(`0xFF06`) is the value `TIMA` reloads to when it overflows. A ROM sets these up to
get a steady interrupt, sixty times a second, or thousands, for music timing or
game logic.

The behavior that matters is the overflow. When `TIMA` ticks past `0xFF` it does
**not** wrap to `0x00`, it reloads from `TMA` and raises the timer interrupt by
setting bit 2 of `IF`. Because you already built interrupt servicing on lesson 40, that
set bit is all it takes: a ROM that enabled the timer interrupt and set `IME` will
now be pulled to the timer vector on schedule. Leave `DIV` exactly as it was, and
gate everything here behind `TAC`'s enable bit so a machine that never touches the
timer behaves as before.
