"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, RotateCcw, Send, Sparkles } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { createMockQuoteEngine } from "@/lib/quote/mock-engine"
import type { ChatMessage, Estimate } from "@/lib/quote/types"

export function QuoteChat() {
  const { t, locale } = useLanguage()
  const q = t.shadow.quote

  // La UI depende del contrato QuoteEngine, no del mock concreto: cambiar a Claude
  // más adelante solo implica sustituir esta factory.
  const engine = useMemo(
    () =>
      createMockQuoteEngine({
        script: q.script,
        servicePrices: t.shadow.services.items.map((s) => s.price),
      }),
    [q.script, t.shadow.services.items],
  )

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: q.greeting },
  ])
  const [requirements, setRequirements] = useState<string[]>([])
  const [estimate, setEstimate] = useState<Estimate | undefined>()
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const formatMoney = (value: number, currency: string) =>
    new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value)

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next: ChatMessage[] = [...messages, { role: "user", content }]
    setMessages(next)
    setInput("")
    setLoading(true)
    try {
      const turn = await engine.send(next)
      setMessages((prev) => [...prev, { role: "assistant", content: turn.reply }])
      setRequirements(turn.requirements)
      if (turn.estimate) setEstimate(turn.estimate)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessages([{ role: "assistant", content: q.greeting }])
    setRequirements([])
    setEstimate(undefined)
    setInput("")
  }

  const showSuggestions = messages.length === 1 && !loading

  return (
    <section id="cotizar" className="border-t border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {q.badge}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {q.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{q.subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            {/* Chat */}
            <div className="flex min-h-[460px] flex-col rounded-2xl border border-border bg-card lg:col-span-3">
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] text-pretty rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "rounded-br-sm bg-brand text-brand-foreground"
                          : "rounded-bl-sm bg-muted text-foreground",
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                      <span className="inline-flex gap-1">
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.1s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                      </span>
                    </div>
                  </div>
                )}

                {showSuggestions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {q.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
                className="flex items-center gap-2 border-t border-border p-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={q.inputPlaceholder}
                  aria-label={q.inputPlaceholder}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  className="bg-brand text-brand-foreground hover:bg-brand/90"
                  aria-label={q.send}
                >
                  <Send className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={reset}
                  aria-label={q.reset}
                  title={q.reset}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                </Button>
              </form>
            </div>

            {/* Panel lateral: requisitos + estimado */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground">{q.requirementsTitle}</h3>
                {requirements.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">{q.emptyRequirements}</p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {requirements.map((r) => (
                      <li
                        key={r}
                        className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground">{q.estimateTitle}</h3>
                {estimate ? (
                  <>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {formatMoney(estimate.min, estimate.currency)}
                      <span className="text-muted-foreground"> – </span>
                      {formatMoney(estimate.max, estimate.currency)}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{q.negotiable}</p>
                    <a
                      href="#contacto"
                      className={cn(
                        buttonVariants(),
                        "mt-4 w-full bg-brand text-brand-foreground hover:bg-brand/90",
                      )}
                    >
                      {q.cta}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{q.emptyRequirements}</p>
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground">{q.disclaimer}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
