"use client"
import { TechCarousel } from "@/components/portfolio/tech-carousel"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  Code,
  Database,
  Cloud,
  Package,
  Brain,
  Server,
  Network,
  Layers,
  GitBranch,
  Share2,
  Zap,
  Cpu,
  Grid,
  Boxes,
  Workflow,
  Link,
  Activity,
} from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMicrosoft,
  faAws,
  faGoogle,
  faGitAlt,
  faGithub,
} from "@fortawesome/free-brands-svg-icons"

// Simple Icons
import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiKeras,
  SiOpencv,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiDocker,
  SiKubernetes,
  SiLinux,
  SiJsonwebtokens,
  SiGithubactions,
  SiJunit5,
  SiUnity,
  SiPytest,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiBootstrap,
  SiMui,
  SiStyledcomponents,
  SiNextdotjs,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiRedux,
  SiVite,
  SiPostgresql,
  SiMysql,
  SiMariadb,
  SiSqlite,
  SiMongodb,
  SiApachecassandra,
  SiRedis,
  SiGooglebigquery,
  SiSequelize,
  SiTypeorm,
  SiPostman,
  SiVercel,
  SiNetlify,
  SiFirebase,
  SiSupabase,
  SiCloudflare,
  SiSocketdotio,
  SiGrafana,
} from "@icons-pack/react-simple-icons"

// Componentes personalizados SVG
const SiDynamodb = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.5 2h-19C1.67 2 1 2.67 1 3.5v17c0 .83.67 1.5 1.5 1.5h19c.83 0 1.5-.67 1.5-1.5v-17c0-.83-.67-1.5-1.5-1.5zm-9 18h-1.5v-1.5h1.5V20zm0-3.5h-1.5V15h1.5v1.5zm0-3.5h-1.5V11.5h1.5V13zm0-3.5h-1.5V8h1.5v1.5zm0-3.5h-1.5V4.5h1.5V6zm3.5 11h-1.5V15h1.5v1.5zm0-3.5h-1.5V11.5h1.5V13zm0-3.5h-1.5V8h1.5v1.5zm0-3.5h-1.5V4.5h1.5V6zm-7 11h-1.5V15h1.5v1.5zm0-3.5h-1.5V11.5h1.5V13zm0-3.5h-1.5V8h1.5v1.5zm0-3.5h-1.5V4.5h1.5V6z" />
  </svg>
)

const SiAmazonS3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L2.5 7.5v9L12 22l9.5-5.5v-9L12 2zm0 2.7l5.7 3.3-5.7 3.3L6.3 8 12 4.7zM4.5 8.8l7 4.1v7.4l-7-4.1V8.8zm15 0v7.4l-7 4.1v-7.4l7-4.1z" />
  </svg>
)

const SiPowerbi = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V6h2v10zm4 0h-2v-4h2v4z" />
  </svg>
)

const SiMicrosoftsqlserver = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
)

const SiOracle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.253 9.516c-1.536 0-2.389 1.108-2.389 2.484 0 1.376.853 2.484 2.389 2.484 1.536 0 2.389-1.108 2.389-2.484 0-1.376-.853-2.484-2.389-2.484zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.253 7.032c1.96 0 3.438 1.48 3.438 3.432 0 1.952-1.478 3.432-3.438 3.432-1.96 0-3.438-1.48-3.438-3.432 0-1.952 1.478-3.432 3.438-3.432z" />
  </svg>
)

// Mapeo completo de íconos - TODOS los íconos mapeados
const getTechIcon = (tech: string) => {
  // Mapeo exacto por nombre de tecnología
  const iconMap: Record<string, React.ReactNode> = {
    // IA y Automatización
    Python: <SiPython className="h-6 w-6 text-[#3776AB]" />,
    TensorFlow: <SiTensorflow className="h-6 w-6 text-[#FF6F00]" />,
    PyTorch: <SiPytorch className="h-6 w-6 text-[#EE4C2C]" />,
    Keras: <SiKeras className="h-6 w-6 text-[#D00000]" />,
    OpenCV: <SiOpencv className="h-6 w-6 text-[#5C3EE8]" />,
    LangGraph: <Workflow className="h-6 w-6 text-purple-500" />,
    RAG: <Link className="h-6 w-6 text-blue-400" />,
    YOLO: <Cpu className="h-6 w-6 text-red-500" />,
    "Function Calling": <Zap className="h-6 w-6 text-yellow-500" />,
    "Structured Outputs": <Grid className="h-6 w-6 text-green-400" />,
    RLHF: <Brain className="h-6 w-6 text-pink-500" />,

    // Backend
    "Node.js": <SiNodedotjs className="h-6 w-6 text-[#339933]" />,
    Express: <SiExpress className="h-6 w-6 text-white" />,
    NestJS: <SiNestjs className="h-6 w-6 text-[#E0234E]" />,
    FastAPI: <SiFastapi className="h-6 w-6 text-[#009688]" />,
    Django: <SiDjango className="h-6 w-6 text-[#092E20]" />,
    Flask: <SiFlask className="h-6 w-6 text-white" />,
    "REST API": <Share2 className="h-6 w-6 text-blue-400" />,
    WebSockets: <Network className="h-6 w-6 text-green-400" />,
    "AWS SQS": <Boxes className="h-6 w-6 text-[#FF9900]" />,
    "Arquitectura Hexagonal": <Layers className="h-6 w-6 text-purple-400" />,
    Microservicios: <Boxes className="h-6 w-6 text-blue-400" />,
    SOLID: <GitBranch className="h-6 w-6 text-green-400" />,

    // DevOps
    Docker: <SiDocker className="h-6 w-6 text-[#2496ED]" />,
    Kubernetes: <SiKubernetes className="h-6 w-6 text-[#326CE5]" />,
    Linux: <SiLinux className="h-6 w-6 text-[#FCC624]" />,
    "OAuth2/JWT": <SiJsonwebtokens className="h-6 w-6 text-pink-500" />,
    "GitHub Actions": <SiGithubactions className="h-6 w-6 text-white" />,
    Git: <FontAwesomeIcon icon={faGitAlt} className="h-6 w-6 text-[#F05032]" />,
    GitHub: <FontAwesomeIcon icon={faGithub} className="h-6 w-6 text-white" />,

    // Testing
    JUnit: <SiJunit5 className="h-6 w-6 text-[#25A162]" />,
    Unity: <SiUnity className="h-6 w-6 text-white" />,
    PyTest: <SiPytest className="h-6 w-6 text-[#0A9EDC]" />,
    NUnit: <Code className="h-6 w-6 text-purple-500" />,
    xUnit: <Code className="h-6 w-6 text-blue-500" />,

    // Frontend
    HTML5: <SiHtml5 className="h-6 w-6 text-[#E34F26]" />,
    CSS: <SiCss className="h-6 w-6 text-[#1572B6]" />,
    "Tailwind CSS": <SiTailwindcss className="h-6 w-6 text-[#06B6D4]" />,
    Bootstrap: <SiBootstrap className="h-6 w-6 text-[#7952B3]" />,
    "Material-UI": <SiMui className="h-6 w-6 text-[#007FFF]" />,
    "Styled Components": <SiStyledcomponents className="h-6 w-6 text-[#DB7093]" />,
    "Next.js": <SiNextdotjs className="h-6 w-6 text-white" />,
    React: <SiReact className="h-6 w-6 text-[#61DAFB]" />,
    "Vue.js": <SiVuedotjs className="h-6 w-6 text-[#4FC08D]" />,
    Angular: <SiAngular className="h-6 w-6 text-[#DD0031]" />,
    TypeScript: <SiTypescript className="h-6 w-6 text-[#3178C6]" />,
    JavaScript: <SiJavascript className="h-6 w-6 text-[#F7DF1E]" />,
    Redux: <SiRedux className="h-6 w-6 text-[#764ABC]" />,
    Vite: <SiVite className="h-6 w-6 text-[#646CFF]" />,
    "react-i18next": <Zap className="h-6 w-6 text-blue-400" />,

    // Bases de Datos SQL
    PostgreSQL: <SiPostgresql className="h-6 w-6 text-[#4169E1]" />,
    MySQL: <SiMysql className="h-6 w-6 text-[#4479A1]" />,
    MariaDB: <SiMariadb className="h-6 w-6 text-[#003545]" />,
    SQLite: <SiSqlite className="h-6 w-6 text-[#003B57]" />,
    SQL: <Database className="h-6 w-6 text-blue-400" />,
    "Microsoft SQL Server": <SiMicrosoftsqlserver className="h-6 w-6 text-[#CC2927]" />,
    Oracle: <SiOracle className="h-6 w-6 text-[#F80000]" />,

    // Bases de Datos NoSQL
    MongoDB: <SiMongodb className="h-6 w-6 text-[#47A248]" />,
    Cassandra: <SiApachecassandra className="h-6 w-6 text-[#1287B1]" />,
    Redis: <SiRedis className="h-6 w-6 text-[#DC382D]" />,
    DynamoDB: <SiDynamodb className="h-6 w-6 text-[#4053D6]" />,
    NoSQL: <Database className="h-6 w-6 text-green-400" />,

    // Cloud y Almacenamiento
    BigQuery: <SiGooglebigquery className="h-6 w-6 text-[#4285F4]" />,
    "Amazon S3": <SiAmazonS3 className="h-6 w-6 text-[#569A31]" />,
    "Azure Blob Storage": <FontAwesomeIcon icon={faMicrosoft} className="h-6 w-6 text-[#0078D4]" />,
    "Google Cloud Storage": <FontAwesomeIcon icon={faGoogle} className="h-6 w-6 text-[#4285F4]" />,
    AWS: <FontAwesomeIcon icon={faAws} className="h-6 w-6 text-[#FF9900]" />,
    Azure: <FontAwesomeIcon icon={faMicrosoft} className="h-6 w-6 text-[#0078D4]" />,
    "Amazon Web Services": <FontAwesomeIcon icon={faAws} className="h-6 w-6 text-[#FF9900]" />,
    "Google Cloud": <FontAwesomeIcon icon={faGoogle} className="h-6 w-6 text-[#4285F4]" />,

    // ORMs
    Sequelize: <SiSequelize className="h-6 w-6 text-[#52B0E7]" />,
    TypeORM: <SiTypeorm className="h-6 w-6 text-[#262627]" />,

    // Plataformas
    Vercel: <SiVercel className="h-6 w-6 text-white" />,
    Netlify: <SiNetlify className="h-6 w-6 text-[#00C7B7]" />,
    Firebase: <SiFirebase className="h-6 w-6 text-[#FFCA28]" />,
    Supabase: <SiSupabase className="h-6 w-6 text-[#3ECF8E]" />,
    "Cloudflare Workers": <SiCloudflare className="h-6 w-6 text-[#F38020]" />,
    "Power BI": <SiPowerbi className="h-6 w-6 text-[#F2C811]" />,

    // Otros
    "Socket.io": <SiSocketdotio className="h-6 w-6 text-white" />,
    Grafana: <SiGrafana className="h-6 w-6 text-[#F46800]" />,
    Postman: <SiPostman className="h-6 w-6 text-[#FF6C37]" />,
    "Redis Streams": <Activity className="h-6 w-6 text-red-400" />,
  }

  // Buscar el ícono en el mapa
  const icon = iconMap[tech]

  if (icon) {
    return icon
  }

  // Si no encuentra el ícono, mostrar uno genérico basado en categoría
  console.warn(`Icono no encontrado para: ${tech}`)

  const lower = tech.toLowerCase()
  if (
    lower.includes("ai") ||
    lower.includes("machine") ||
    lower.includes("deep") ||
    lower.includes("neural")
  ) {
    return <Brain className="h-6 w-6 text-purple-400" />
  }
  if (lower.includes("api") || lower.includes("rest") || lower.includes("graphql")) {
    return <Share2 className="h-6 w-6 text-blue-400" />
  }
  if (
    lower.includes("db") ||
    lower.includes("database") ||
    lower.includes("sql") ||
    lower.includes("nosql")
  ) {
    return <Database className="h-6 w-6 text-green-400" />
  }
  if (
    lower.includes("cloud") ||
    lower.includes("aws") ||
    lower.includes("azure") ||
    lower.includes("gcp")
  ) {
    return <Cloud className="h-6 w-6 text-cyan-400" />
  }
  if (lower.includes("docker") || lower.includes("kubernetes") || lower.includes("devops")) {
    return <Package className="h-6 w-6 text-blue-400" />
  }
  if (lower.includes("test") || lower.includes("junit") || lower.includes("pytest")) {
    return <Code className="h-6 w-6 text-yellow-400" />
  }
  if (
    lower.includes("front") ||
    lower.includes("react") ||
    lower.includes("vue") ||
    lower.includes("angular")
  ) {
    return <Code className="h-6 w-6 text-cyan-400" />
  }
  if (
    lower.includes("back") ||
    lower.includes("node") ||
    lower.includes("express") ||
    lower.includes("django")
  ) {
    return <Server className="h-6 w-6 text-green-400" />
  }

  return <Code className="h-6 w-6 text-foreground/70" />
}

export function TechStack() {
  const { t } = useLanguage()

  return (
    <section
      id="stack"
      className="border-y border-border bg-gradient-to-b from-[#0a0a12] to-[#0d0d15] py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">
            {"// "}
            {t.techStack.title}
          </p>
          <h2 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">
            {t.techStack.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-foreground/60">{t.techStack.subtitle}</p>
        </Reveal>

        <div className="mt-14">
          <TechCarousel>
            {t.techStack.groups.map((group) => (
              <div key={group.name} className="w-full">
                <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#12121e] to-[#0a0a12] p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-neon-purple/40 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <h3 className="relative mb-8 text-base sm:text-lg font-bold uppercase tracking-widest text-neon-purple">
                    {group.name}
                  </h3>

                  <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {group.techs.map((tech) => (
                      <div
                        key={`${group.name}-${tech}`}
                        className="group/tech flex h-28 flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center transition-all duration-300 hover:border-neon-purple/40 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:-translate-y-1"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 shadow-md transition-all duration-300 group-hover/tech:scale-110 group-hover/tech:bg-white/20">
                          <div className="transition-colors duration-300 group-hover/tech:text-neon-purple">
                            {getTechIcon(tech)}
                          </div>
                        </div>
                        <span className="line-clamp-2 text-xs sm:text-sm font-semibold leading-tight text-foreground/70 transition-colors duration-300 group-hover/tech:text-foreground/90">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </TechCarousel>
        </div>
      </div>
    </section>
  )
}
