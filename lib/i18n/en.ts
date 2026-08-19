import type { Dictionary } from "./es"
import { projects } from "../projects"

export const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    techStack: "Tech Stack",
    experience: "Experience",
    contact: "Contact",
    shadowSolutions: "RedFox_Solutions",
    downloadCV: "Download CV",
    viewCV: "View CV",
    cvExpand: "Fullscreen",
    cvCollapse: "Reduce",
    openInNewTab: "Open in new tab",
    cvTitle: "Daniel Peregrino — CV",
  },
  hero: {
    greeting: "Hi, I'm",
    name: "Daniel Peregrino Perez",
    role: "Full Stack Engineer | Software Architecture & AI Integration Specialist",
    ctaProjects: "View projects",
    ctaCV: "Download CV",
  },
  stats: {
    title: "By the numbers",
    items: [
      { value: 5, suffix: "+", label: "Years of experience" },
      { value: projects.length, suffix: "+", label: "Completed projects" },
      { value: 25, suffix: "+", label: "Technologies mastered" },
      { value: 8, suffix: "", label: "Certifications" },
    ],
  },
  about: {
    title: "About me",
    subtitle: "Full Stack Engineer & Software Architect",
    paragraphs: [
      "I'm a full stack engineer focused on scalable software architecture and AI integration. I design and build microservices with Python and Nest.js, and develop modern frontends with React, Vite and Next.js.",
      "I apply Hexagonal Architecture and Atomic Design principles to create maintainable, decoupled systems. I'm passionate about applied AI: from RAG pipelines and agents with LangGraph to computer vision with YOLO and OpenCV.",
      "I enjoy turning complex problems into simple, fast and reliable products.",
    ],
    highlights: ["Hexagonal Architecture", "Atomic Design", "Microservices", "Applied AI"],
  },
  projects: {
    title: "Projects",
    subtitle: "A selection of recent work with live preview",
    visit: "Visit site",
    items: projects,
  },
  techStack: {
    title: "Tech Stack",
    subtitle: "Tools and technologies I use daily",
    groups: [
      {
        name: "Frontend",
        techs: ["Next.js", "React", "Vite", "Flutter", "TypeScript", "Tailwind CSS"],
      },
      {
        name: "Backend & Architecture",
        techs: [
          "Python",
          "FastAPI",
          "Django",
          "Nest.js",
          "Hexagonal Architecture",
          "Microservices",
        ],
      },
      {
        name: "Databases & AI",
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
    title: "Experience",
    subtitle: "My professional journey",
    items: [
      {
        role: "Full Stack AI Specialist",
        company: "Outlier AI",
        period: "Feb 2025 — Jan 2026",
        description:
          "Training and evaluating AI models, building internal tools and data pipelines to improve model quality.",
      },
      {
        role: "Full Stack Engineer",
        company: "Digital Solutions Development",
        period: "Jan 2025 — Dec 2025",
        description:
          "Design and implementation of web applications and APIs with microservices architecture, focused on scalability and performance.",
      },
      {
        role: "Full Stack & AI Engineer",
        company: "APrendIA Project",
        period: "Jan 2026 — Apr 2026",
        description:
          "Development of an educational platform with an AI tutor, integrating language models and recommendation systems.",
      },
    ],
    certificationsTitle: "Certifications",
    viewCredential: "View credential",
  },
  calendar: {
    title: "My availability",
    subtitle: "Check my calendar and find a time to chat",
  },
  contact: {
    title: "Contact",
    subtitle: "Let's talk about your next project",
    email: "danielperegrinoperez@gmail.com",
    emailCopied: "Email copied!",
    socials: "Social media",
  },
  footer: {
    rights: "All rights reserved.",
    quickLinks: "Quick links",
    builtWith: "Built with Next.js, Tailwind CSS and Framer Motion.",
  },
  shadow: {
    nav: {
      services: "Services",
      process: "Process",
      testimonials: "Testimonials",
      quote: "Get a quote",
      faq: "FAQ",
      contact: "Contact",
      backToPortfolio: "Back to portfolio",
    },
    shadowSolutions: "RedFox_Solutions",
    hero: {
      name: "RedFox_Solutions",
      tagline: "Custom software development",
      description:
        "We're a full stack freelance team that designs, builds and integrates artificial intelligence into digital products that drive your business forward.",
      ctaCall: "Schedule a call",
      ctaServices: "View services",
    },
    services: {
      title: "Services and pricing",
      subtitle: "Clear solutions with concrete deliverables",
      from: "From",
      items: [
        {
          title: "Full Stack Web Development",
          description: "Fast, secure and scalable web applications, tailored to your business.",
          deliverables: [
            "Responsive design",
            "Backend and API",
            "Admin panel",
            "Deployment and support",
          ],
          price: "$2,500 USD",
        },
        {
          title: "Cross-platform Apps",
          description: "Mobile apps for iOS and Android from a single codebase.",
          deliverables: [
            "iOS and Android app",
            "API integration",
            "Push notifications",
            "Store publishing",
          ],
          price: "$3,500 USD",
        },
        {
          title: "AI Integration / Automation",
          description: "Automate processes and integrate AI to empower your team.",
          deliverables: [
            "Chatbots and agents",
            "RAG pipelines",
            "Workflow automation",
            "Custom integrations",
          ],
          price: "$1,800 USD",
        },
        {
          title: "Consulting / Code Audit",
          description: "We review your code and architecture to improve quality and performance.",
          deliverables: ["Technical audit", "Improvement plan", "Refactoring", "Team mentoring"],
          price: "$120 USD/h",
        },
      ],
    },
    process: {
      title: "Our process",
      subtitle: "A clear path from start to finish",
      steps: [
        { title: "Discovery", description: "We understand your goals, users and requirements." },
        { title: "Design", description: "We define the architecture, flow and interface." },
        {
          title: "Development",
          description: "We build with iterative deliveries and continuous feedback.",
        },
        {
          title: "Delivery & Support",
          description: "We deploy, train and provide ongoing support.",
        },
      ],
    },
    testimonials: {
      title: "What our clients say",
      subtitle: "Trust built project by project",
      items: [
        {
          name: "María González",
          company: "Retail Nova",
          quote:
            "They turned our idea into a solid platform in record time. Flawless communication.",
        },
        {
          name: "Carlos Méndez",
          company: "FinTech Labs",
          quote:
            "The AI integration exceeded our expectations. I recommend RedFox_Solutions without hesitation.",
        },
        {
          name: "Laura Ramírez",
          company: "EduPlus",
          quote:
            "Professional, clear and very technical. They understood our business from day one.",
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      subtitle: "We answer your questions before we start",
      items: [
        {
          question: "How long does a typical project take?",
          answer:
            "It depends on the scope, but most web projects take between 4 and 10 weeks. We give you a clear timeline after the discovery phase.",
        },
        {
          question: "Do I need technical knowledge to work with you?",
          answer:
            "Not at all. We translate everything into plain language and guide you through every important decision.",
        },
        {
          question: "Do you offer support after launch?",
          answer:
            "Yes. We offer maintenance and support plans so your product keeps growing smoothly.",
        },
        {
          question: "How does payment work?",
          answer:
            "We work with an initial deposit and milestone payments. Everything is defined in the contract before we start.",
        },
      ],
    },
    quote: {
      badge: "AI Assistant",
      title: "Get a quote for your project",
      subtitle: "Tell us what you need and get a ballpark estimate instantly.",
      inputPlaceholder: "Describe your project... (e.g. an online store with payments)",
      send: "Send",
      reset: "Reset",
      thinking: "Typing...",
      requirementsTitle: "Detected requirements",
      emptyRequirements: "No requirements yet. Start by describing your idea.",
      estimateTitle: "Ballpark estimate",
      negotiable: "Indicative estimate, subject to negotiation based on the final scope.",
      cta: "Book a call to refine the budget",
      disclaimer: "Demo: replies are sample responses. The final quote is confirmed after a call.",
      greeting:
        "Hi! I'm the RedFox_Solutions assistant. Tell me in a sentence or two what project you have in mind and I'll help you estimate scope and cost.",
      suggestions: [
        "Online store with payments",
        "iOS and Android mobile app",
        "Integrate an AI chatbot",
        "Corporate website",
      ],
      script: {
        steps: [
          {
            reply:
              "Great! To narrow down the scope, what key features do you need? For example: login, payments, an admin panel or integrations with other services.",
            requirements: ["Full stack web project", "Responsive design"],
          },
          {
            reply: "Got it. Do you have a target date or an approximate budget in mind?",
            requirements: ["User authentication", "Admin panel"],
          },
          {
            reply:
              "Perfect, with this I can give you an initial estimate. Here's the approximate range 👇",
            requirements: ["Payment integration", "Deployment and support"],
            withEstimate: true,
          },
        ],
        fallback:
          "Noted. Whenever you're ready, book a call and we'll refine the budget in detail.",
      },
    },
    contactForm: {
      title: "Tell us about your project",
      subtitle: "Answer a few questions and we'll contact you within 24 hours",
      name: "Name",
      email: "Email",
      projectType: "Project type",
      projectTypes: [
        "Web Development",
        "Cross-platform App",
        "AI Integration",
        "Consulting",
        "Other",
      ],
      projectName: "Project Name",
      projectDescription: "Project Description",
      projectScope: "Scope / Modules",
      budget: "Budget",
      timeline: "Timeline",
      deliverables: "Deliverables",
      additionalNotes: "Additional Notes",
      message: "Message",
      submit: "Send message",
      submitting: "Sending...",
      success: "Thank you! We've received your message and will contact you soon.",
      placeholderName: "Your name",
      placeholderEmail: "youremail@example.com",
      placeholderProjectName: "Project name",
      placeholderProjectDescription: "Describe your project",
      placeholderProjectScope: "List main features or modules",
      placeholderBudget: "e.g., $10,000 - $20,000",
      placeholderTimeline: "Desired completion date",
      placeholderDeliverables: "List expected deliverables",
      placeholderAdditionalNotes: "Any other details or constraints",
      placeholderMessage: "Tell us what you need...",
      selectType: "Select an option",
      errors: {
        name: "Please enter your name",
        email: "Please enter a valid email",
        projectName: "Please enter your project name",
        projectDescription: "Please describe your project",
        projectScope: "Please outline the scope",
        budget: "Please provide a budget estimate",
        timeline: "Please provide a timeline",
        deliverables: "Please list expected deliverables",
        message: "Please write a message",
      },
    },
    calendar: {
      title: "Schedule a meeting",
      subtitle: "Pick the time that works best for you",
    },
    contact: {
      title: "Contact",
      subtitle: "We're just one message away",
      email: "hello@redfoxsolutions.dev",
      socials: "Follow us",
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "Custom software development and AI integration.",
    },
  },
}
