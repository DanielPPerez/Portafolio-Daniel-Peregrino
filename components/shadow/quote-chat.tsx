"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Globe,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import type { ChatMessage, QuoteEstimate, QuoteTurn } from "@/lib/quote/types"
import { resolveLabelKey } from "@/lib/quote/label-resolver"
import {
  QuoteLineSelector,
  defaultLineOptions,
  type QuoteLineOption,
} from "@/components/shadow/quote-line-selector"
import type { BusinessLineHint } from "@/lib/quote/types"

export function QuoteChat() {
  const { t, locale } = useLanguage()
  const q = t.shadow.quote
  const f = t.shadow.contactForm

  const [businessLine, setBusinessLine] = useState<BusinessLineHint | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [requirements, setRequirements] = useState<string[]>([])
  const [quoteEstimate, setQuoteEstimate] = useState<QuoteEstimate | undefined>()
  const [lastBreakdown, setLastBreakdown] = useState<QuoteEstimate["breakdown"]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const formatMoney = (value: number, currency: string = "MXN") =>
    new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value)

  const lineOptions: ReadonlyArray<QuoteLineOption> = useMemo(
    () =>
      defaultLineOptions({
        software: q.lineSelector.software,
        softwareDescription: q.lineSelector.softwareDescription,
        repair: q.lineSelector.repair,
        repairDescription: q.lineSelector.repairDescription,
      }),
    [
      q.lineSelector.software,
      q.lineSelector.softwareDescription,
      q.lineSelector.repair,
      q.lineSelector.repairDescription,
    ],
  )

  function selectLine(value: BusinessLineHint) {
    setBusinessLine(value)
    setMessages([{ role: "assistant", content: q.greeting }])
    setRequirements([])
    setQuoteEstimate(undefined)
    setLastBreakdown([])
    setInput("")
  }

  function changeLine() {
    const userMessages = messages.filter((m) => m.role === "user").length
    if (userMessages > 0) {
      const ok = window.confirm(q.lineSelector.changeConfirm)
      if (!ok) return
    }
    setBusinessLine(null)
    setMessages([])
    setRequirements([])
    setQuoteEstimate(undefined)
    setLastBreakdown([])
    setInput("")
  }

  function reset() {
    setMessages([{ role: "assistant", content: q.greeting }])
    setRequirements([])
    setQuoteEstimate(undefined)
    setLastBreakdown([])
    setInput("")
  }

  // Pre-llenado del formulario de contacto, según la línea activa y el desglose.
  const fillContactForm = () => {
    const contactForm = document.querySelector("section#contacto form") as HTMLFormElement | null
    if (!contactForm) return

    const userMessages = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content.trim())
      .filter(Boolean)
    const userText = userMessages.length > 0 ? userMessages.join(" ") : ""

    const setInputValue = (name: string, value: string) => {
      const input = contactForm.elements.namedItem(name) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null
      if (input) {
        input.value = value
        input.dispatchEvent(new Event("input", { bubbles: true }))
        input.dispatchEvent(new Event("change", { bubbles: true }))
      }
    }

    if (businessLine === "repair") {
      const firstRepairLine = lastBreakdown[0]?.labelKey ?? "quoteCatalog.repairs.phone.diagnostics"
      const repairLabel = resolveLabelKey(firstRepairLine, t)
      setInputValue("projectName", `${f.defaultProjectNameRepair}: ${repairLabel}`)
      setInputValue(
        "projectDescription",
        userText ? `${f.summaryRepair}\n\n${userText}` : f.summaryRepair,
      )
      const addonLabels = lastBreakdown
        .slice(1)
        .map((b) => resolveLabelKey(b.labelKey, t))
        .join(", ")
      setInputValue(
        "projectScope",
        addonLabels ? `${repairLabel} + ${addonLabels}` : f.defaultScopeRepair,
      )
    } else {
      const moduleLabels = lastBreakdown.map((b) => resolveLabelKey(b.labelKey, t)).join(", ")
      setInputValue("projectName", f.defaultProjectNameSoftware)
      setInputValue(
        "projectDescription",
        userText ? `${f.summarySoftware}\n\n${userText}` : f.summarySoftware,
      )
      setInputValue("projectScope", moduleLabels || f.defaultScopeSoftware)
    }

    setInputValue("budget", "")
    setInputValue("timeline", "")
    setInputValue("deliverables", "")
    setInputValue("additionalNotes", "")

    contactForm.closest("section#contacto")?.scrollIntoView({ behavior: "smooth" })
  }

  async function requestTurn(history: ChatMessage[]): Promise<QuoteTurn> {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history,
        locale,
        businessLineHint: businessLine ?? undefined,
      }),
    })
    if (!res.ok) throw new Error("ai_error")
    return (await res.json()) as QuoteTurn
  }

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next: ChatMessage[] = [...messages, { role: "user", content }]
    setMessages(next)
    setInput("")
    setLoading(true)
    try {
      const turn = await requestTurn(next)
      setMessages((prev) => [...prev, { role: "assistant", content: turn.reply }])
      setRequirements(turn.requirements)
      if (turn.estimate) {
        setQuoteEstimate(turn.estimate)
        setLastBreakdown(turn.estimate.breakdown)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            locale === "es"
              ? "Tuve un problema procesando tu mensaje. ¿Lo intentamos de nuevo?"
              : "I had a problem processing your message. Can we try again?",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const showSuggestions = businessLine !== null && messages.length === 1 && !loading

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

        {businessLine === null ? (
          <Reveal delay={0.1}>
            <div className="mt-12">
              <QuoteLineSelector
                options={lineOptions}
                onSelect={selectLine}
                title={q.lineSelector.title}
                subtitle={q.lineSelector.subtitle}
              />
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-6 lg:grid-cols-5">
              {/* Chat */}
              <div className="flex min-h-[460px] flex-col rounded-2xl border border-border bg-card lg:col-span-3">
                <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
                  <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="size-3.5" aria-hidden="true" />
                    {businessLine === "software" ? q.lineSelector.software : q.lineSelector.repair}
                  </span>
                  <button
                    type="button"
                    onClick={changeLine}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    {q.lineSelector.change}
                  </button>
                </div>

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
                      {(businessLine === "repair"
                        ? q.suggestionsByLine.repair
                        : q.suggestionsByLine.software
                      ).map((s) => (
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
                    placeholder={
                      businessLine === "repair"
                        ? q.inputPlaceholderByLine.repair
                        : q.inputPlaceholderByLine.software
                    }
                    aria-label={
                      businessLine === "repair"
                        ? q.inputPlaceholderByLine.repair
                        : q.inputPlaceholderByLine.software
                    }
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
                  <EstimatePanel
                    estimate={quoteEstimate}
                    onFillContactForm={fillContactForm}
                    formatMoney={formatMoney}
                    resolveLabel={(k) => resolveLabelKey(k, t)}
                    t={t}
                    q={q}
                  />
                </div>

                <p className="text-center text-xs text-muted-foreground">{q.disclaimer}</p>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

type EstimatePanelProps = {
  estimate: QuoteEstimate | undefined
  onFillContactForm: () => void
  formatMoney: (n: number, currency?: string) => string
  resolveLabel: (k: string) => string
  t: ReturnType<typeof useLanguage>["t"]
  q: ReturnType<typeof useLanguage>["t"]["shadow"]["quote"]
}

function EstimatePanel({
  estimate,
  onFillContactForm,
  formatMoney,
  resolveLabel,
  t,
  q,
}: EstimatePanelProps) {
  if (!estimate) {
    return <p className="mt-2 text-sm text-muted-foreground">{q.estimateEmpty}</p>
  }

  if (estimate.requiresManualReview) {
    return (
      <div className="mt-3 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
          <AlertTriangle className="size-3.5" aria-hidden="true" />
          {q.manualReviewTitle}
        </div>
        <p className="text-sm text-foreground">{resolveLabel(estimate.disclaimerKey)}</p>
        <button
          onClick={(e) => {
            e.preventDefault()
            onFillContactForm()
          }}
          className={cn(
            buttonVariants(),
            "w-full bg-brand text-brand-foreground hover:bg-brand/90",
          )}
        >
          {q.ctaManualReview}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    )
  }

  const confidenceText = t.shadow.quote.confidence[estimate.confidence]
  const confidenceClass =
    estimate.confidence === "local_validated"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : estimate.confidence === "market_reference"
        ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
        : estimate.confidence === "calibrated"
          ? "border-brand/30 bg-brand/10 text-brand"
          : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"

  return (
    <div className="mt-3 space-y-4">
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
          confidenceClass,
        )}
      >
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        {confidenceText}
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {formatMoney(estimate.referenceMXN)}
        </p>
        <p className="text-xs text-muted-foreground">
          {q.rangeLabel}: {formatMoney(estimate.lowMXN)} – {formatMoney(estimate.highMXN)}
        </p>
      </div>

      {estimate.breakdown.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {q.breakdownTitle}
          </p>
          <ul className="mt-2 space-y-1.5">
            {estimate.breakdown.map((line, idx) => (
              <li
                key={`${line.labelKey}-${idx}`}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="text-foreground">{resolveLabel(line.labelKey)}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {formatMoney(line.amountMXN)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{resolveLabel(estimate.disclaimerKey)}</p>

      <button
        onClick={(e) => {
          e.preventDefault()
          onFillContactForm()
        }}
        className={cn(buttonVariants(), "w-full bg-brand text-brand-foreground hover:bg-brand/90")}
      >
        {q.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
