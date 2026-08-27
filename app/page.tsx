import { PortfolioNavbar } from "@/components/portfolio/navbar"
import { Hero } from "@/components/portfolio/hero"
import { Stats } from "@/components/portfolio/stats"
import { About } from "@/components/portfolio/about"
import { Projects } from "@/components/portfolio/projects"
import { TechStack } from "@/components/portfolio/tech-stack"
import { Experience } from "@/components/portfolio/experience"
import { Calendar } from "@/components/portfolio/calendar"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"

export default function Page() {
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      <PortfolioNavbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Projects />
        <TechStack />
        <Experience />
        <Calendar />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
