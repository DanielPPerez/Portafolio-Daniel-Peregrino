export type Project = {
  title: string
  description: string
  url: string
  tags: string[]
  type: "web" | "figma" | "game"
}
export const projects: Project[] = [
  {
    title: "Evaluador de Caligrafía IA",
    description:
      "Plataforma con Visión Artificial y backend asíncrono en FastAPI para evaluar trazos y caracteres manuscritos mediante YOLO, CLAHE y análisis morfológico.",
    url: "https://web-analizardor-caligrafico.onrender.com",
    tags: ["FastAPI", "Python", "OpenCV", "YOLO", "Computer Vision"],
    type: "web",
  },
  {
    title: "RPGLIFE — Prototipo Interactivo",
    description:
      "Prototipo interactivo y navegable de alta fidelidad para RPGLIFE, gamificando la productividad y hábitos con estética RPG y microinteracciones fluidas.",
    url: "https://www.figma.com/proto/TtKmuvMF31YPlod0Q6VH4h/RPGLIFE?node-id=0-1&t=ofxdNIryCZfUARQO-1",
    tags: ["Figma", "UI/UX", "Interactive Prototype", "Gamification", "Microinteractions"],
    type: "figma",
  },
  {
    title: "RPGLIFE — Sistema de Diseño & UI Specs",
    description:
      "Sistema de diseño integral en Figma basado en Atomic Design con tokens, tipografía, componentes interactivos y especificaciones para desarrollo.",
    url: "https://www.figma.com/design/TtKmuvMF31YPlod0Q6VH4h/RPGLIFE?node-id=0-1&m=dev&t=ofxdNIryCZfUARQO-1",
    tags: ["Figma", "Design System", "Atomic Design", "UI Tokens", "Dev Mode"],
    type: "figma",
  },
]

export const projectsEn: Project[] = [
  {
    title: "AI Calligraphy Evaluator",
    description:
      "Computer vision platform with an asynchronous FastAPI backend to evaluate handwritten strokes and characters using YOLO, CLAHE, and morphological analysis.",
    url: "https://web-analizardor-caligrafico.onrender.com",
    tags: ["FastAPI", "Python", "OpenCV", "YOLO", "Computer Vision"],
    type: "web",
  },
  {
    title: "RPGLIFE — Interactive Prototype",
    description:
      "High-fidelity interactive prototype for RPGLIFE, gamifying productivity and daily habits with an immersive RPG aesthetic and fluid micro-interactions.",
    url: "https://www.figma.com/proto/TtKmuvMF31YPlod0Q6VH4h/RPGLIFE?node-id=0-1&t=ofxdNIryCZfUARQO-1",
    tags: ["Figma", "UI/UX", "Interactive Prototype", "Gamification", "Microinteractions"],
    type: "figma",
  },
  {
    title: "RPGLIFE — Design System & UI Specs",
    description:
      "Comprehensive Figma design system based on Atomic Design with design tokens, typography, interactive component states, and dev mode specifications.",
    url: "https://www.figma.com/design/TtKmuvMF31YPlod0Q6VH4h/RPGLIFE?node-id=0-1&m=dev&t=ofxdNIryCZfUARQO-1",
    tags: ["Figma", "Design System", "Atomic Design", "UI Tokens", "Dev Mode"],
    type: "figma",
  },
]
