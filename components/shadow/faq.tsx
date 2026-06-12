"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

export function ShadowFaq() {
  const { t } = useLanguage()

  return (
    <section id="faq" className="border-y border-border bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.shadow.faq.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{t.shadow.faq.subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion multiple={false} className="mt-10 w-full">
            {t.shadow.faq.items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
