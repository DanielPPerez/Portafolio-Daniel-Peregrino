import { describe, expect, it, vi } from "vitest"
import { createMockQuoteEngine, type QuoteScript } from "./mock-engine"
import type { ChatMessage } from "./types"

const softwareScript: QuoteScript = {
  steps: [
    { reply: "Software opener", requirements: ["req-soft-1"] },
    { reply: "Software middle", requirements: ["req-soft-2"] },
    { reply: "Software estimate", requirements: ["req-soft-3"], withEstimate: true },
  ],
  fallback: "Software fallback",
}

const repairScript: QuoteScript = {
  steps: [
    { reply: "Repair opener", requirements: ["req-repair-1"] },
    { reply: "Repair middle", requirements: ["req-repair-2"] },
    { reply: "Repair estimate", requirements: ["req-repair-3"], withEstimate: true },
  ],
  fallback: "Repair fallback",
}

const makeEngine = (overrides: Partial<Parameters<typeof createMockQuoteEngine>[0]> = {}) =>
  createMockQuoteEngine({
    softwareScript,
    repairScript,
    servicePrices: ["$2,500 USD", "$120 USD/h"],
    latencyMs: 0,
    ...overrides,
  })

describe("createMockQuoteEngine — script selection", () => {
  it("uses the repair script when businessLineHint is repair", async () => {
    const engine = makeEngine({ businessLineHint: "repair" })
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "first" },
      { role: "assistant", content: "Repair opener" },
      { role: "user", content: "second" },
    ]
    const turn = await engine.send(history)
    expect(turn.reply).toBe("Repair middle")
    expect(turn.requirements).toContain("req-repair-1")
    expect(turn.requirements).toContain("req-repair-2")
  })

  it("uses the software script when businessLineHint is software", async () => {
    const engine = makeEngine({ businessLineHint: "software" })
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "first" },
      { role: "assistant", content: "Software opener" },
      { role: "user", content: "second" },
    ]
    const turn = await engine.send(history)
    expect(turn.reply).toBe("Software middle")
    expect(turn.requirements).toContain("req-soft-1")
  })

  it("falls back to software script when no hint and no repair keywords", async () => {
    const engine = makeEngine()
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "first" },
      { role: "assistant", content: "Software opener" },
      { role: "user", content: "I want a corporate website" },
    ]
    const turn = await engine.send(history)
    expect(turn.reply).toBe("Software middle")
  })

  it("infers repair from repair keywords when no hint is provided", async () => {
    const engine = makeEngine()
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "first" },
      { role: "assistant", content: "Repair opener" },
      { role: "user", content: "se me cayó el celular y la pantalla está rota" },
    ]
    const turn = await engine.send(history)
    expect(turn.reply).toBe("Repair middle")
    expect(turn.requirements).toContain("req-repair-1")
  })

  it("hint wins over conflicting keywords in user text", async () => {
    const engine = makeEngine({ businessLineHint: "software" })
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "first" },
      { role: "assistant", content: "Software opener" },
      { role: "user", content: "pantalla rota de iPhone" },
    ]
    const turn = await engine.send(history)
    expect(turn.reply).toBe("Software middle")
  })

  it("returns the repair estimate and the repair disclaimer at the withEstimate step", async () => {
    const engine = makeEngine({ businessLineHint: "repair" })
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "msg 1" },
      { role: "assistant", content: "Repair middle" },
      { role: "user", content: "msg 2" },
      { role: "assistant", content: "Repair estimate" },
      { role: "user", content: "msg 3" },
    ]
    const turn = await engine.send(history)
    expect(turn.estimate).toBeDefined()
    expect(turn.estimate?.disclaimerKey).toBe("quotePricing.disclaimer.repairLocalValidated")
  })

  it("returns the software estimate and the software disclaimer at the withEstimate step", async () => {
    const engine = makeEngine({ businessLineHint: "software" })
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "msg 1" },
      { role: "assistant", content: "Software middle" },
      { role: "user", content: "msg 2" },
      { role: "assistant", content: "Software estimate" },
      { role: "user", content: "msg 3" },
    ]
    const turn = await engine.send(history)
    expect(turn.estimate).toBeDefined()
    expect(turn.estimate?.disclaimerKey).toBe("quotePricing.disclaimer.softwareCalibrated")
  })

  it("uses the per-line fallback once userTurns exceeds the script length", async () => {
    const engine = makeEngine({ businessLineHint: "repair" })
    const history: ChatMessage[] = [
      { role: "assistant", content: "greeting" },
      { role: "user", content: "1" },
      { role: "user", content: "2" },
      { role: "user", content: "3" },
      { role: "user", content: "4" },
    ]
    const turn = await engine.send(history)
    expect(turn.reply).toBe("Repair fallback")
    expect(turn.estimate).toBeDefined()
  })

  it("opens with the first step of the selected script when there are no user messages", async () => {
    const engine = makeEngine({ businessLineHint: "repair" })
    const turn = await engine.send([{ role: "assistant", content: "greeting" }])
    expect(turn.reply).toBe("Repair opener")
    expect(turn.requirements).toEqual([])
  })

  it("respects a zero latencyMs so tests stay fast (sanity check)", async () => {
    const spy = vi.spyOn(global, "setTimeout")
    const engine = makeEngine({ latencyMs: 0, businessLineHint: "software" })
    await engine.send([{ role: "assistant", content: "greeting" }])
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
