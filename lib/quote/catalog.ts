/**
 * Catálogo de dominio de la línea software/desarrollo (tipos + datos puros).
 * No depende de i18n, UI ni del puerto QuoteEngine (ADR-0004). Los precios viven aquí;
 * los diccionarios solo traducen nameKey / labelKey / exclusionKeys.
 *
 * El mismo estilo (tipos + constantes, sin I/O) se puede clonar para un catálogo de
 * refacciones en una fase posterior.
 */

export type ComplexityTier = "simple" | "medium" | "complex"

export type SoftwareModule = {
  id: string
  nameKey: string
  complexity: ComplexityTier
}

export type SoftwareServiceCatalog = {
  /** Precio base MXN de un módulo de complejidad "medium", calibrado del proyecto de referencia. */
  baseModulePriceMXN: number
  /** Multiplicador aplicado sobre baseModulePriceMXN según complejidad del módulo. */
  complexityMultiplier: Record<ComplexityTier, number>
  modules: SoftwareModule[]
}

export type PaymentMilestone = {
  labelKey: string
  percentage: number
}

export type CommercialTerms = {
  paymentSchedule: PaymentMilestone[]
  warrantyDays: number
  proposalValidityDays: number
  exclusionKeys: string[]
}

/**
 * Ancla de un módulo medium.
 * Proyecto ERP de referencia interno: 150_000 MXN / 13 módulos = 11_538.46 → 11_538 MXN.
 */
const BASE_MODULE_PRICE_MXN = 11_538

/**
 * simple 0.5: CRUD acotado, poco acoplamiento.
 * medium 1.0: módulo de negocio estándar (el ancla).
 * complex 1.8: flujos, estado financiero o inventario en tiempo real; tope bajo de 1.8–2x
 * para no inflar un precio ya calibrado con todas las fases del proyecto de referencia.
 */
export const softwareServiceCatalog: SoftwareServiceCatalog = {
  baseModulePriceMXN: BASE_MODULE_PRICE_MXN,
  complexityMultiplier: {
    simple: 0.5,
    medium: 1,
    complex: 1.8,
  },
  modules: [
    { id: "authentication", nameKey: "quoteCatalog.modules.authentication", complexity: "medium" },
    { id: "users", nameKey: "quoteCatalog.modules.users", complexity: "simple" },
    {
      id: "roles-permissions",
      nameKey: "quoteCatalog.modules.rolesPermissions",
      complexity: "medium",
    },
    { id: "products", nameKey: "quoteCatalog.modules.products", complexity: "medium" },
    { id: "inventory", nameKey: "quoteCatalog.modules.inventory", complexity: "complex" },
    { id: "customers", nameKey: "quoteCatalog.modules.customers", complexity: "medium" },
    { id: "suppliers", nameKey: "quoteCatalog.modules.suppliers", complexity: "medium" },
    { id: "purchases", nameKey: "quoteCatalog.modules.purchases", complexity: "complex" },
    { id: "sales", nameKey: "quoteCatalog.modules.sales", complexity: "complex" },
    {
      id: "accounts-receivable",
      nameKey: "quoteCatalog.modules.accountsReceivable",
      complexity: "complex",
    },
    {
      id: "accounts-payable",
      nameKey: "quoteCatalog.modules.accountsPayable",
      complexity: "complex",
    },
    {
      id: "commercial-documents",
      nameKey: "quoteCatalog.modules.commercialDocuments",
      complexity: "medium",
    },
    { id: "reports", nameKey: "quoteCatalog.modules.reports", complexity: "medium" },
    { id: "dashboard", nameKey: "quoteCatalog.modules.dashboard", complexity: "medium" },
    { id: "settings", nameKey: "quoteCatalog.modules.settings", complexity: "simple" },
  ],
}

/** Defaults reutilizables; una cotización concreta puede ajustarlos más adelante. */
export const defaultCommercialTerms: CommercialTerms = {
  paymentSchedule: [
    { labelKey: "quoteCatalog.milestones.projectStart", percentage: 40 },
    { labelKey: "quoteCatalog.milestones.developmentComplete", percentage: 30 },
    { labelKey: "quoteCatalog.milestones.deliveryAcceptance", percentage: 30 },
  ],
  warrantyDays: 90,
  proposalValidityDays: 15,
  exclusionKeys: [
    "quoteCatalog.exclusions.hardware",
    "quoteCatalog.exclusions.thirdPartyLicenses",
    "quoteCatalog.exclusions.hosting",
    "quoteCatalog.exclusions.domains",
    "quoteCatalog.exclusions.certifications",
    "quoteCatalog.exclusions.outOfScope",
  ],
}

const paymentScheduleTotal = defaultCommercialTerms.paymentSchedule.reduce(
  (sum, milestone) => sum + milestone.percentage,
  0,
)

if (paymentScheduleTotal !== 100) {
  throw new Error(
    `defaultCommercialTerms.paymentSchedule must sum to 100, got ${paymentScheduleTotal}`,
  )
}
