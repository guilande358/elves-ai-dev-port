import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import projectEduki from "@/assets/project-eduki.png";
import projectCode1 from "@/assets/project-code-1.png";
import projectCode2 from "@/assets/project-code-2.png";
import projectLovable from "@/assets/project-lovable.png";

const projects = [
  {
    title: "Tutor EduKI",
    description: "Plataforma de tutor de IA personalizado para aprendizado interativo. Sistema completo com autenticação e experiência educacional adaptativa.",
    tags: ["Lovable", "IA", "Educação", "React"],
    image: projectEduki,
    liveUrl: "https://tutor-eduki358.lovable.app",
    githubUrl: null,
  },
  {
    title: "E-commerce Dashboard",
    description: "Dashboard administrativo para loja virtual construído com ferramentas no-code e integração com IA para análise de dados.",
    tags: ["Webflow", "Airtable", "ChatGPT"],
    image: projectCode1,
    liveUrl: "https://bit.ly/4pGhWzm",
    githubUrl: null,
  },
  {
    title: "Portfolio Interativo",
    description: "Site portfolio com animações avançadas e design responsivo, desenvolvido com HTML, CSS e Framer.",
    tags: ["HTML", "CSS", "Framer"],
    image: projectCode2,
    liveUrl: "https://bit.ly/4pGhWzm",
    githubUrl: null,
  },
  {
    title: "App de Gestão de Tarefas",
    description: "Aplicativo de produtividade criado com plataforma low-code, incluindo automações inteligentes com IA.",
    tags: ["Bubble", "Zapier", "Claude"],
    image: projectLovable,
    liveUrl: "https://bit.ly/4pGhWzm",
    githubUrl: null,
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-12">
            <span className="text-primary font-mono text-sm">03.</span>
            <h2 className="text-3xl md:text-4xl font-bold">Projetos em Destaque</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Projects Grid */}
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`group grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden rounded-xl ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className={`space-y-4 ${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}>
                  <span className="text-primary font-mono text-sm">Projeto {String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  
                  {/* Tags */}
                  <div className={`flex flex-wrap gap-2 ${index % 2 === 1 ? "md:justify-end" : ""}`}>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className={`flex gap-4 pt-2 ${index % 2 === 1 ? "md:justify-end" : ""}`}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-16">
            <Button variant="outline" size="lg">
              Ver Todos os Projetos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
