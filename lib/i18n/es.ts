import { projects } from "../projects"

export const es = {
  nav: {
    home: "Inicio",
    about: "Acerca de",
    projects: "Proyectos",
    techStack: "Tech Stack",
    experience: "Experiencia",
    contact: "Contacto",
    shadowSolutions: "RedFox_Solutions",
    downloadCV: "Descargar CV",
    viewCV: "Ver CV",
    cvExpand: "Pantalla completa",
    cvCollapse: "Reducir",
    openInNewTab: "Abrir en pestaña",
    cvTitle: "Daniel Peregrino — CV",
  },
  hero: {
    greeting: "Hola, soy",
    name: "Daniel Peregrino Perez",
    role: "Ingeniero Full Stack | Especialista en Arquitectura de Software e Integración de IA",
    ctaProjects: "Ver proyectos",
    ctaCV: "Descargar CV",
  },
  stats: {
    title: "En números",
    items: [
      { value: 5, suffix: "+", label: "Años de experiencia" },
      { value: projects.length, suffix: "+", label: "Proyectos completados" },
      { value: 25, suffix: "+", label: "Tecnologías dominadas" },
      { value: 8, suffix: "", label: "Certificaciones" },
    ],
  },
  about: {
    title: "Acerca de mí",
    subtitle: "Ingeniero Full Stack & Arquitecto de Software",
    paragraphs: [
      "Soy ingeniero full stack con foco en arquitectura de software escalable e integración de inteligencia artificial. Diseño y construyo microservicios con Python y Nest.js, y desarrollo frontends modernos con React, Vite y Next.js.",
      "Aplico principios de Arquitectura Hexagonal y Atomic Design para crear sistemas mantenibles y desacoplados. Me apasiona la IA aplicada: desde pipelines de RAG y agentes con LangGraph hasta visión por computadora con YOLO y OpenCV.",
      "Disfruto convertir problemas complejos en productos simples, rápidos y confiables.",
    ],
    highlights: ["Arquitectura Hexagonal", "Atomic Design", "Microservicios", "IA Aplicada"],
  },
  projects: {
    title: "Proyectos",
    subtitle: "Una selección de trabajos recientes con previsualización en vivo",
    visit: "Ver sitio",
    items: projects,
  },
  techStack: {
    title: "Tech Stack",
    subtitle: "Herramientas y tecnologías que uso a diario",
    groups: [
      {
        name: "Frontend",
        techs: ["Next.js", "React", "Vite", "Flutter", "TypeScript", "Tailwind CSS"],
      },
      {
        name: "Backend & Arquitectura",
        techs: [
          "Python",
          "FastAPI",
          "Django",
          "Nest.js",
          "Arquitectura Hexagonal",
          "Microservicios",
        ],
      },
      {
        name: "Bases de datos & IA",
        techs: [
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "Supabase",
          "Firebase",
          "LangGraph",
          "RAG",
          "YOLO",
          "OpenCV",
        ],
      },
      {
        name: "Cloud & DevOps",
        techs: ["Docker", "AWS", "Railway", "Linux"],
      },
    ],
  },
  experience: {
    title: "Experiencia",
    subtitle: "Mi trayectoria profesional",
    items: [
      {
        role: "Full Stack AI Specialist",
        company: "Outlier AI",
        period: "Feb 2025 — Ene 2026",
        description:
          "Entrenamiento y evaluación de modelos de IA, desarrollo de herramientas internas y pipelines de datos para mejorar la calidad de los modelos.",
      },
      {
        role: "Ingeniero Full Stack",
        company: "Desarrollo de Soluciones Digitales",
        period: "Ene 2025 — Dic 2025",
        description:
          "Diseño e implementación de aplicaciones web y APIs con arquitectura de microservicios, enfocado en escalabilidad y rendimiento.",
      },
      {
        role: "Full Stack & AI Engineer",
        company: "Proyecto APrendIA",
        period: "Ene 2026 — Abr 2026",
        description:
          "Desarrollo de una plataforma educativa con tutor de IA, integrando modelos de lenguaje y sistemas de recomendación.",
      },
    ],
    certificationsTitle: "Certificaciones",
    viewCredential: "Ver credencial",
  },
  calendar: {
    title: "Mi disponibilidad",
    subtitle: "Revisa mi calendario y encuentra un hueco para conversar",
  },
  contact: {
    title: "Contacto",
    subtitle: "Hablemos sobre tu próximo proyecto",
    email: "danielperegrinoperez@gmail.com",
    emailCopied: "¡Correo copiado!",
    socials: "Redes sociales",
  },
  footer: {
    rights: "Todos los derechos reservados.",
    quickLinks: "Enlaces rápidos",
    builtWith: "Construido con Next.js, Tailwind CSS y Framer Motion.",
  },
  shadow: {
    nav: {
      services: "Servicios",
      process: "Proceso",
      testimonials: "Testimonios",
      quote: "Cotizar",
      faq: "FAQ",
      contact: "Contacto",
      backToPortfolio: "Volver al portafolio",
    },
    shadowSolutions: "RedFox_Solutions",
    hero: {
      name: "RedFox_Solutions",
      tagline: "Desarrollo de software a medida",
      description:
        "Somos un equipo freelance full stack que diseña, construye e integra inteligencia artificial en productos digitales que impulsan tu negocio.",
      ctaCall: "Agenda una llamada",
      ctaServices: "Ver servicios",
    },
    services: {
      title: "Servicios y tarifas",
      subtitle: "Soluciones claras con entregables concretos",
      from: "Desde",
      items: [
        {
          title: "Desarrollo Web Full Stack",
          description: "Aplicaciones web rápidas, seguras y escalables, a la medida de tu negocio.",
          deliverables: [
            "Diseño responsive",
            "Backend y API",
            "Panel de administración",
            "Despliegue y soporte",
          ],
          price: "$43,750 MXN",
        },
        {
          title: "Apps Multiplataforma",
          description: "Aplicaciones móviles para iOS y Android desde una sola base de código.",
          deliverables: [
            "App iOS y Android",
            "Integración de APIs",
            "Notificaciones push",
            "Publicación en stores",
          ],
          price: "$61,250 MXN",
        },
        {
          title: "Integración de IA / Automatización",
          description: "Automatiza procesos e integra IA para potenciar tu equipo.",
          deliverables: [
            "Chatbots y agentes",
            "Pipelines RAG",
            "Automatización de flujos",
            "Integraciones a medida",
          ],
          price: "$31,500 MXN",
        },
        {
          title: "Consultoría / Auditoría de código",
          description: "Revisamos tu código y arquitectura para mejorar calidad y rendimiento.",
          deliverables: [
            "Auditoría técnica",
            "Plan de mejora",
            "Refactorización",
            "Mentoría al equipo",
          ],
          price: "$2,100 MXN/h",
        },
      ],
    },
    process: {
      title: "Proceso de trabajo",
      subtitle: "Un camino claro de principio a fin",
      steps: [
        {
          title: "Descubrimiento",
          description: "Entendemos tus objetivos, usuarios y requisitos.",
        },
        { title: "Diseño", description: "Definimos la arquitectura, el flujo y la interfaz." },
        {
          title: "Desarrollo",
          description: "Construimos con entregas iterativas y feedback continuo.",
        },
        {
          title: "Entrega y Soporte",
          description: "Desplegamos, capacitamos y damos soporte continuo.",
        },
      ],
    },
    testimonials: {
      title: "Lo que dicen nuestros clientes",
      subtitle: "Confianza construida proyecto a proyecto",
      items: [
        {
          name: "María González",
          company: "Retail Nova",
          quote:
            "Transformaron nuestra idea en una plataforma sólida en tiempo récord. Comunicación impecable.",
        },
        {
          name: "Carlos Méndez",
          company: "FinTech Labs",
          quote:
            "La integración de IA superó nuestras expectativas. Recomiendo a RedFox_Solutions sin dudarlo.",
        },
        {
          name: "Laura Ramírez",
          company: "EduPlus",
          quote:
            "Profesionales, claros y muy técnicos. Entendieron nuestro negocio desde el primer día.",
        },
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      subtitle: "Resolvemos tus dudas antes de empezar",
      items: [
        {
          question: "¿Cuánto tarda un proyecto típico?",
          answer:
            "Depende del alcance, pero la mayoría de proyectos web toman entre 4 y 10 semanas. Te damos un cronograma claro tras la fase de descubrimiento.",
        },
        {
          question: "¿Necesito conocimientos técnicos para trabajar con ustedes?",
          answer:
            "Para nada. Traducimos todo a lenguaje sencillo y te acompañamos en cada decisión importante.",
        },
        {
          question: "¿Ofrecen soporte después del lanzamiento?",
          answer:
            "Sí. Ofrecemos planes de mantenimiento y soporte para que tu producto siga creciendo sin problemas.",
        },
        {
          question: "¿Cómo es la forma de pago?",
          answer:
            "Trabajamos con un anticipo inicial y pagos por hitos. Todo queda definido en el contrato antes de empezar.",
        },
      ],
    },
    quote: {
      badge: "Asistente IA",
      title: "Cotiza tu proyecto",
      subtitle: "Cuéntanos qué necesitas y obtén un estimado aproximado al instante.",
      inputPlaceholder: "Describe tu proyecto... (ej. una tienda online con pagos)",
      send: "Enviar",
      reset: "Reiniciar",
      thinking: "Escribiendo...",
      requirementsTitle: "Requisitos detectados",
      emptyRequirements: "Aún no hay requisitos. Empieza describiendo tu idea.",
      estimateTitle: "Estimado aproximado",
      negotiable: "Estimado orientativo, sujeto a negociación según el alcance final.",
      cta: "Agendar llamada para afinar el presupuesto",
      disclaimer:
        "Demo: las respuestas son de ejemplo. La cotización final se confirma tras una llamada.",
      greeting:
        "¡Hola! Soy el asistente de RedFox_Solutions. Cuéntame en una o dos frases qué proyecto tienes en mente y te ayudo a estimar alcance y costo.",
      suggestions: [
        "Tienda online con pagos",
        "App móvil iOS y Android",
        "Integrar un chatbot con IA",
        "Sitio web corporativo",
      ],
      script: {
        steps: [
          {
            reply:
              "¡Genial! Para afinar el alcance, ¿qué funciones clave necesitas? Por ejemplo: login, pagos, panel de administración o integración con otros servicios.",
            requirements: ["Proyecto web full stack", "Diseño responsive"],
          },
          {
            reply: "Entendido. ¿Tienes una fecha objetivo o un presupuesto aproximado en mente?",
            requirements: ["Autenticación de usuarios", "Panel de administración"],
          },
          {
            reply:
              "Perfecto, con esto puedo darte un estimado inicial. Aquí tienes el rango aproximado 👇",
            requirements: ["Integración de pagos", "Despliegue y soporte"],
            withEstimate: true,
          },
        ],
        fallback:
          "Lo anoto. Cuando quieras, agenda una llamada y afinamos el presupuesto al detalle.",
      },
    },
    contactForm: {
      title: "Cuéntanos sobre tu proyecto",
      subtitle: "Responde unos datos y te contactamos en menos de 24 horas",
      name: "Nombre",
      email: "Correo electrónico",
      projectType: "Tipo de proyecto",
      projectTypes: [
        "Desarrollo Web",
        "App Multiplataforma",
        "Integración de IA",
        "Consultoría",
        "Otro",
      ],
      projectName: "Nombre del proyecto",
      projectDescription: "Descripción del proyecto",
      projectScope: "Alcance / Módulos",
      budget: "Presupuesto aproximado",
      timeline: "Fecha de entrega deseada",
      deliverables: "Entregables esperados",
      additionalNotes: "Notas adicionales",
      message: "Mensaje",
      submit: "Enviar mensaje",
      submitting: "Enviando...",
      success: "¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.",
      placeholderName: "Tu nombre",
      placeholderEmail: "tucorreo@ejemplo.com",
      placeholderProjectName: "Nombre del proyecto",
      placeholderProjectDescription: "Describe tu proyecto en detalle",
      placeholderProjectScope: "Lista las funcionalidades o módulos principales",
      placeholderBudget: "Ej: $10,000 - $20,000 MXN",
      placeholderTimeline: "Fecha esperada de finalización",
      placeholderDeliverables: "Lista lo que esperas recibir",
      placeholderAdditionalNotes: "Cualquier otro detalle o restricción",
      placeholderMessage: "Cuéntanos qué necesitas...",
      selectType: "Selecciona una opción",
      errors: {
        name: "Por favor ingresa tu nombre",
        email: "Por favor ingresa un correo válido",
        projectName: "Por favor ingresa el nombre del proyecto",
        projectDescription: "Por favor describe tu proyecto",
        projectScope: "Por favor describe el alcance del proyecto",
        budget: "Por favor proporciona un presupuesto estimado",
        timeline: "Por favor proporciona una fecha de entrega estimada",
        deliverables: "Por favor lista los entregables esperados",
        additionalNotes: "Por favor proporciona notas adicionales si aplica",
        message: "Por favor escribe un mensaje",
      },
    },
    calendar: {
      title: "Agenda una reunión",
      subtitle: "Elige el momento que mejor te funcione",
    },
    contact: {
      title: "Contacto",
      subtitle: "Estamos a un mensaje de distancia",
      email: "hola@redfoxsolutions.dev",
      socials: "Síguenos",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      tagline: "Desarrollo de software a medida e integración de IA.",
    },
  },
}

export type Dictionary = typeof es
