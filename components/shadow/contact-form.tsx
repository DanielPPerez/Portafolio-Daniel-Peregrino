"use client"

import { useActionState } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import { submitContact, type ContactState } from "@/app/actions/contact"

export function ShadowContactForm() {
  const { t } = useLanguage()
  const f = t.shadow.contactForm
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, null)

  return (
    <section id="contacto" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {f.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{f.subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {state?.ok ? (
            <div
              role="status"
              className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 p-10 text-center"
            >
              <CheckCircle2 className="size-10 text-brand" aria-hidden="true" />
              <p className="text-pretty font-medium text-foreground">{f.success}</p>
            </div>
          ) : (
            <form action={formAction} className="mt-10 grid gap-5" noValidate>
              <div className="grid gap-2">
                <Label htmlFor="name">{f.name}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={f.placeholderName}
                  required
                  aria-invalid={!!state?.fieldErrors?.name}
                />
                {state?.fieldErrors?.name && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.name}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{f.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={f.placeholderEmail}
                  required
                  aria-invalid={!!state?.fieldErrors?.email}
                />
                {state?.fieldErrors?.email && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="projectType">{f.projectType}</Label>
                <Select name="projectType" defaultValue={f.projectTypes[0]}>
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder={f.selectType} />
                  </SelectTrigger>
                  <SelectContent>
                    {f.projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* New fields */}
              <div className="grid gap-2">
                <Label htmlFor="projectName">{f.projectName}</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  placeholder={f.placeholderProjectName}
                  required
                  aria-invalid={!!state?.fieldErrors?.projectName}
                />
                {state?.fieldErrors?.projectName && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.projectName}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="projectDescription">{f.projectDescription}</Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  placeholder={f.placeholderProjectDescription}
                  required
                  aria-invalid={!!state?.fieldErrors?.projectDescription}
                />
                {state?.fieldErrors?.projectDescription && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.projectDescription}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="projectScope">{f.projectScope}</Label>
                <Textarea
                  id="projectScope"
                  name="projectScope"
                  placeholder={f.placeholderProjectScope}
                  required
                  aria-invalid={!!state?.fieldErrors?.projectScope}
                />
                {state?.fieldErrors?.projectScope && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.projectScope}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">{f.budget}</Label>
                <Input
                  id="budget"
                  name="budget"
                  placeholder={f.placeholderBudget}
                  required
                  aria-invalid={!!state?.fieldErrors?.budget}
                />
                {state?.fieldErrors?.budget && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.budget}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeline">{f.timeline}</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder={f.placeholderTimeline}
                  required
                  aria-invalid={!!state?.fieldErrors?.timeline}
                />
                {state?.fieldErrors?.timeline && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.timeline}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deliverables">{f.deliverables}</Label>
                <Textarea
                  id="deliverables"
                  name="deliverables"
                  placeholder={f.placeholderDeliverables}
                  required
                  aria-invalid={!!state?.fieldErrors?.deliverables}
                />
                {state?.fieldErrors?.deliverables && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.deliverables}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additionalNotes">{f.additionalNotes}</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  placeholder={f.placeholderAdditionalNotes}
                  required
                  aria-invalid={!!state?.fieldErrors?.additionalNotes}
                />
                {state?.fieldErrors?.additionalNotes && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.additionalNotes}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">{f.message}</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={f.placeholderMessage}
                  required
                  aria-invalid={!!state?.fieldErrors?.message}
                />
                {state?.fieldErrors?.message && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {pending ? (
                  f.submitting
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    {f.submit}
                  </>
                )}
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
