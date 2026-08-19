export type Project = {
  title: string
  description: string
  url: string
  tags: string[]
  type: "web" | "figma" | "game"
}

export const projects: Project[] = [
  {
    title: "Corporate Web Platform",
    description:
      "Full stack website with admin panel, blog and authentication. Built with Next.js and a microservices backend.",
    url: "https://vercel.com",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    type: "web",
  },
  {
    title: "Figma Design System",
    description:
      "Complete design system based on Atomic Design with tokens, components and interactive documentation.",
    url: "https://www.figma.com/community",
    tags: ["Figma", "Design System", "Atomic Design"],
    type: "figma",
  },
  {
    title: "Indie Game on Itch.io",
    description:
      "2D game prototype with platformer mechanics, published on Itch.io for community feedback.",
    url: "https://itch.io",
    tags: ["GameDev", "Pixel Art", "WebGL"],
    type: "game",
  },
]
