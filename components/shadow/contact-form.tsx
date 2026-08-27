"use client"

import { useActionState, useState, startTransition } from "react"
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
import { z } from "zod"
import { submitContact, type ContactState } from "@/app/actions/contact"

export function ShadowContactForm() {
  const { t } = useLanguage()
  const f = t.shadow.contactForm
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, null)
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
    projectName: "",
    projectDescription: "",
    projectScope: "",
    budget: "",
    timeline: "",
    deliverables: "",
    additionalNotes: "",
  })
  const [phone, setPhone] = useState("")
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; value: string }>>([
    { platform: "whatsapp", value: "" },
  ])

  // Step 1 schema (excluding phone and socialLinks)
  const step1Schema = z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    message: z.string().trim().min(1),
    projectName: z.string().trim().min(1),
    projectDescription: z.string().trim().min(1),
    projectScope: z.string().trim().min(1),
    budget: z.string().trim().min(1),
    timeline: z.string().trim().min(1),
    deliverables: z.string().trim().min(1),
    additionalNotes: z.string().trim().min(1),
    projectType: z.string().trim().optional(),
  })

  const validateStep1 = () => {
    const result = step1Schema.safeParse(step1Data)
    return result.success
  }

  const handleStep1Change = (field: keyof typeof step1Data, value: string) => {
    setStep1Data((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
  }

  const handleSocialChange = (index: number, field: "platform" | "value", value: string) => {
    setSocialLinks((prev) => {
      const newLinks = [...prev]
      newLinks[index] = { ...newLinks[index], [field]: value }
      return newLinks
    })
  }

  const addSocialLink = () => {
    if (socialLinks.length < 3) {
      setSocialLinks((prev) => [...prev, { platform: "whatsapp", value: "" }])
    }
  }

  const removeSocialLink = (index: number) => {
    if (socialLinks.length > 1) {
      setSocialLinks((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Combine data
    const combined = {
      ...step1Data,
      phone: phone.trim(),
      socialLinks: socialLinks
        .filter((link) => link.value.trim() !== "")
        .map((link) => ({
          platform: link.platform,
          value: link.value.trim(),
        })),
    }
    // Validate full schema (optional, server will revalidate)
    // Build FormData
    const formData = new FormData()
    for (const [key, value] of Object.entries(combined)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // socialLinks array of objects -> JSON string
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value as string)
        }
      }
    }
    // Submit via action
    startTransition(() => {
      formAction(formData)
    })
    // Note: state will be updated by useActionState
  }

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
            <>
              {step === 1 ? (
                <>
                  <form className="mt-10 grid gap-5" noValidate>
                    <div className="grid gap-2">
                      <Label htmlFor="name">{f.name}</Label>
                      <Input
                        id="name"
                        value={step1Data.name}
                        onChange={(e) => handleStep1Change("name", e.target.value)}
                        placeholder={f.placeholderName}
                        required
                        aria-invalid={false} // we handle validation via step
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">{f.email}</Label>
                      <Input
                        id="email"
                        value={step1Data.email}
                        onChange={(e) => handleStep1Change("email", e.target.value)}
                        type="email"
                        placeholder={f.placeholderEmail}
                        required
                        aria-invalid={false}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="projectType">{f.projectType}</Label>
                      <Select
                        value={step1Data.projectType}
                        onValueChange={(value) => handleStep1Change("projectType", value ?? "")}
                      >
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

                    {/* Extended brief fields */}
                    <div className="grid gap-2">
                      <Label htmlFor="projectName">{f.projectName}</Label>
                      <Input
                        id="projectName"
                        value={step1Data.projectName}
                        onChange={(e) => handleStep1Change("projectName", e.target.value)}
                        placeholder={f.placeholderProjectName}
                        required
                        aria-invalid={false}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="projectDescription">{f.projectDescription}</Label>
                      <Textarea
                        id="projectDescription"
                        value={step1Data.projectDescription}
                        onChange={(e) => handleStep1Change("projectDescription", e.target.value)}
                        placeholder={f.placeholderProjectDescription}
                        required
                        aria-invalid={false}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="projectScope">{f.projectScope}</Label>
                      <Textarea
                        id="projectScope"
                        value={step1Data.projectScope}
                        onChange={(e) => handleStep1Change("projectScope", e.target.value)}
                        placeholder={f.placeholderProjectScope}
                        required
                        aria-invalid={false}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="budget">{f.budget}</Label>
                      <Input
                        id="budget"
                        value={step1Data.budget}
                        onChange={(e) => handleStep1Change("budget", e.target.value)}
                        placeholder={f.placeholderBudget}
                        required
                        aria-invalid={false}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="timeline">{f.timeline}</Label>
                      <Input
                        id="timeline"
                        value={step1Data.timeline}
                        onChange={(e) => handleStep1Change("timeline", e.target.value)}
                        placeholder={f.placeholderTimeline}
                        required
                        aria-invalid={false}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deliverables">{f.deliverables}</Label>
                      <Textarea
                        id="deliverables"
                        value={step1Data.deliverables}
                        onChange={(e) => handleStep1Change("deliverables", e.target.value)}
                        placeholder={f.placeholderDeliverables}
                        required
                        aria-invalid={false}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="additionalNotes">{f.additionalNotes}</Label>
                      <Textarea
                        id="additionalNotes"
                        value={step1Data.additionalNotes}
                        onChange={(e) => handleStep1Change("additionalNotes", e.target.value)}
                        placeholder={f.placeholderAdditionalNotes}
                        required
                        aria-invalid={false}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="message">{f.message}</Label>
                      <Textarea
                        id="message"
                        value={step1Data.message}
                        onChange={(e) => handleStep1Change("message", e.target.value)}
                        rows={5}
                        placeholder={f.placeholderMessage}
                        required
                        aria-invalid={false}
                      />
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => {
                          if (validateStep1()) {
                            setStep(2)
                          }
                        }}
                        disabled={pending}
                        className="bg-brand text-brand-foreground hover:bg-brand/90"
                      >
                        {f.submit}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <form className="mt-10 grid gap-5" noValidate>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">{f.phone ?? "Teléfono"}</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder={f.placeholderPhone ?? "Tu número de teléfono"}
                        required
                        aria-invalid={false}
                      />
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="socialLinks">{f.socialLinks ?? "Redes sociales"}</Label>
                      <div className="space-y-2">
                        {socialLinks.map((link, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:space-x-2 sm:items-end"
                          >
                            <Select
                              value={link.platform}
                              onValueChange={(value) =>
                                handleSocialChange(idx, "platform", value ?? "")
                              }
                            >
                              <SelectTrigger
                                id={`social-platform-${idx}`}
                                className="flex-1 sm:max-w-xs"
                              >
                                <SelectValue placeholder="Plataforma" />
                              </SelectTrigger>
                              <SelectContent>
                                {["whatsapp", "instagram", "linkedin", "other"].map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              value={link.value}
                              onChange={(e) => handleSocialChange(idx, "value", e.target.value)}
                              placeholder={f.socialLinksPlaceholder ?? "Valor o URL"}
                              className="flex-1"
                              required
                            />
                            {socialLinks.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSocialLink(idx)}
                                className="ml-2 self-end"
                              >
                                <Send className="size-3" aria-hidden="true" />{" "}
                                {/* placeholder, better use X from lucide */}
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          onClick={addSocialLink}
                          disabled={socialLinks.length >= 3}
                          className="mt-2 flex items-center gap-2 text-sm"
                        >
                          <Send className="size-3" aria-hidden="true" /> {/* plus icon */}
                          {f.submit ?? "Add otra red social"}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button onClick={() => setStep(1)} variant="ghost">
                        {f.backToPortfolio ?? "← Volver"}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        type="button"
                        disabled={pending}
                        className="bg-brand text-brand-foreground hover:bg-brand/90"
                      >
                        {pending ? f.submitting : f.submit}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </Reveal>
      </div>
    </section>
  )
}
