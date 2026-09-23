export type Project = {
  title: string
  description: string
  url: string
  tags: string[]
  type: "web" | "figma" | "game" | "pdf"
  thumbnail?: string
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
    title: "Segmentación y Clustering con ML No Supervisado",
    description:
      "Investigación y modelado con K-Means, Gaussian Mixture Models (GMM) y DBSCAN sobre macrodatos nacionales de salud pública (DGIS México 2024), descubriendo perfiles clínicos y estratificación de riesgo neonatal.",
    url: "/documentos/REPORTE_DE_IMPLEMENTACI%C3%93N_ML_NO_SUPERVISADO_PARA_CLUSTERING.pdf",
    tags: ["Machine Learning", "Clustering", "Python", "K-Means", "GMM", "Data Mining"],
    type: "pdf",
    thumbnail: "/images/project-clustering.png",
  },
  {
    title: "Análisis Exploratorio y Descriptivo de Datos (EDA)",
    description:
      "Estudio analítico riguroso y minería de datos aplicado a la adopción y necesidades tecnológicas en lectoescritura. Incluye preprocesamiento, estadística descriptiva, relaciones bivariadas con heatmaps y tablas de contingencia.",
    url: "/documentos/AN%C3%81LISIS_EXPLORATORIO_Y_DESCRIPTIVO_DE_DATOS.pdf",
    tags: ["Data Analysis", "EDA", "Python", "Statistics", "Heatmaps", "User Research"],
    type: "pdf",
    thumbnail: "/images/project-eda.png",
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
    title: "Unsupervised Machine Learning for Clustering",
    description:
      "Unsupervised Machine Learning research and modeling (K-Means, GMM, DBSCAN) applied to national public health big data (DGIS Mexico 2024), discovering clinical risk profiles and neonatal stratification.",
    url: "/documentos/REPORTE_DE_IMPLEMENTACI%C3%93N_ML_NO_SUPERVISADO_PARA_CLUSTERING.pdf",
    tags: ["Machine Learning", "Clustering", "Python", "K-Means", "GMM", "Data Mining"],
    type: "pdf",
    thumbnail: "/images/project-clustering.png",
  },
  {
    title: "Exploratory & Descriptive Data Analysis (EDA)",
    description:
      "Rigorous analytical report and data mining exploring technological adoption and user needs in literacy education. Features preprocessing, descriptive statistics, and bivariate correlations with heatmaps.",
    url: "/documentos/AN%C3%81LISIS_EXPLORATORIO_Y_DESCRIPTIVO_DE_DATOS.pdf",
    tags: ["Data Analysis", "EDA", "Python", "Statistics", "Heatmaps", "User Research"],
    type: "pdf",
    thumbnail: "/images/project-eda.png",
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
