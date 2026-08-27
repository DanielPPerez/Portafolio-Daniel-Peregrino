"use client"

import { useActionState, useState, useEffect, startTransition } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { submitMeetingRequest, type MeetingRequestState } from "@/app/actions/meeting-request"
import type { MeetingRequestInput } from "@/lib/validation/meeting-request"

export function MeetingRequestForm({ onApproval }: { onApproval: (bookingUrl: string) => void }) {
  const { t } = useLanguage()
  const f = t.shadow.meetingRequest ?? {} // fallback if translations missing
  const [state, formAction, pending] = useActionState<MeetingRequestState, FormData>(
    submitMeetingRequest,
    null,
  )
  const [formData, setFormData] = useState<MeetingRequestInput>({
    name: "",
    email: "",
    phone: "",
    socialLinks: [] as Array<{
      platform: "whatsapp" | "instagram" | "linkedin" | "other"
      value: string
    }>,
    companyName: "",
    role: "",
    projectBudgetRange: "",
    honeypot: "",
  })

  // Handle changes for primitive fields
  const handleChange = (field: keyof MeetingRequestInput, value: string) => {
    setFormData((prev: MeetingRequestInput) => ({ ...prev, [field]: value }))
  }

  // Social links handling
  const handleSocialChange = (index: number, field: "platform" | "value", value: string) => {
    setFormData((prev: MeetingRequestInput) => {
      const currentLinks = prev.socialLinks || []
      const newLinks = [...currentLinks]
      if (newLinks[index]) {
        newLinks[index] = {
          ...newLinks[index],
          [field]: value,
        } as { platform: "whatsapp" | "instagram" | "linkedin" | "other"; value: string }
      }
      return { ...prev, socialLinks: newLinks }
    })
  }

  const addSocialLink = () => {
    const currentLinks = formData.socialLinks || []
    if (currentLinks.length < 3) {
      setFormData((prev: MeetingRequestInput) => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), { platform: "whatsapp", value: "" }],
      }))
    }
  }

  const removeSocialLink = (index: number) => {
    const currentLinks = formData.socialLinks || []
    if (currentLinks.length > 1) {
      setFormData((prev: MeetingRequestInput) => {
        const newLinks = [...(prev.socialLinks || [])]
        newLinks.splice(index, 1)
        return { ...prev, socialLinks: newLinks }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Build FormData from state
    const formDataObj = new FormData()
    // Primitive fields
    for (const [key, value] of Object.entries(formData)) {
      if (key !== "socialLinks") {
        formDataObj.append(key, value as string)
      }
    }
    // socialLinks as JSON string
    formDataObj.append("socialLinks", JSON.stringify(formData.socialLinks))
    startTransition(() => {
      formAction(formDataObj)
    })
    // state updated by useActionState
  }

  // When approval occurs, call the parent callback with bookingUrl
  useEffect(() => {
    if (state?.approved && state?.bookingUrl) {
      onApproval(state.bookingUrl)
    }
  }, [state?.approved, state?.bookingUrl, onApproval])

  return (
    <section id="solicitud-reunion" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {f.title ?? "Solicitud de reunión"}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {f.subtitle ??
                "Responde unas preguntas y te mostraremos nuestro calendario de disponibilidad"}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {state?.approved ? (
            <div
              role="status"
              className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 p-10 text-center"
            >
              <CheckCircle2 className="size-10 text-brand" aria-hidden="true" />
              <p className="text-pretty font-medium text-foreground">
                {f.success ??
                  "¡Gracias! Hemos recibido tu solicitud y te mostraremos el calendario."}
              </p>
            </div>
          ) : (
            <form className="mt-10 grid gap-5" noValidate onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="grid gap-2">
                <Label htmlFor="name">{f.name ?? "Nombre"}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder={f.placeholderName ?? "Tu nombre"}
                  required
                  aria-invalid={!!state?.fieldErrors?.name}
                />
                {state?.fieldErrors?.name && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors?.name ?? state.fieldErrors.name}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">{f.email ?? "Email"}</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  type="email"
                  placeholder={f.placeholderEmail ?? "tuemail@ejemplo.com"}
                  required
                  aria-invalid={!!state?.fieldErrors?.email}
                />
                {state?.fieldErrors?.email && (
                  <p role="alert" className="text-sm text-destructive">
                    {f.errors?.email ?? state.fieldErrors.email}
                  </p>
                )}
              </div>
              {/* Teléfono */}
              <div className="grid gap-2">
                <Label htmlFor="phone">{f.phone ?? "Teléfono"}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={f.placeholderPhone ?? "Tu número de teléfono"}
                  required
                  aria-invalid={false} // validation via refine
                />
              </div>
              {/* Redes sociales */}
              <div className="grid gap-2">
                <Label htmlFor="socialLinks">{f.socialLinks ?? "Redes sociales"}</Label>
                <div className="space-y-2">
                  {(formData.socialLinks || []).map((link, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:space-x-2 sm:items-end">
                      <Select
                        value={link.platform}
                        onValueChange={(v) => handleSocialChange(idx, "platform", v ?? "")}
                      >
                        <SelectTrigger id={`social-platform-${idx}`} className="flex-1 sm:max-w-xs">
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
                      {(formData.socialLinks || []).length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocialLink(idx)}
                          className="ml-2 self-end"
                        >
                          <Send className="size-3" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addSocialLink}
                    disabled={(formData.socialLinks || []).length >= 3}
                    className="mt-2 flex items-center gap-2 text-sm"
                  >
                    <Send className="size-3" aria-hidden="true" />
                    {f.addSocialLink ?? "Agregar otra red social"}
                  </Button>
                </div>
              </div>
              {/* Nombre de la empresa */}
              <div className="grid gap-2">
                <Label htmlFor="companyName">{f.companyName ?? "Nombre de la empresa"}</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder={f.placeholderCompanyName ?? "Nombre de tu empresa u organización"}
                  required
                  aria-invalid={false}
                />
              </div>
              {/* Rol */}
              <div className="grid gap-2">
                <Label htmlFor="role">{f.role ?? "Tu rol"}</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder={f.placeholderRole ?? "Ej. Gerente de Marketing, Director de TI"}
                  required
                  aria-invalid={false}
                />
              </div>
              {/* Rango de presupuesto del proyecto */}
              <div className="grid gap-2">
                <Label htmlFor="projectBudgetRange">
                  {f.projectBudgetRange ?? "Rango de presupuesto del proyecto"}
                </Label>
                <Select
                  value={formData.projectBudgetRange}
                  onValueChange={(v) => handleChange("projectBudgetRange", v ?? "")}
                >
                  <SelectTrigger id="projectBudgetRange">
                    <SelectValue placeholder={f.selectBudgetRange ?? "Selecciona un rango"} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Reutilizamos las mismas franjas del cotizador si existen; de lo contrario, valores de ejemplo */}
                    {["<$5,000", "$5,000 - $15,000", "$15,000 - $30,000", ">$30,000"].map(
                      (range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* Campo honeypot oculto */}
              <div style={{ position: "absolute", left: "-9999px" }}>
                <label htmlFor="honeypot">{f.honeypotLabel ?? "No llenar este campo"}</label>
                <Input
                  id="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => handleChange("honeypot", e.target.value)}
                  // No requerido, solo para bots
                />
              </div>

              {/* Botón de envío */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={pending}
                  className="bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {pending ? (f.submitting ?? "Enviando...") : (f.submit ?? "Enviar solicitud")}
                </Button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
