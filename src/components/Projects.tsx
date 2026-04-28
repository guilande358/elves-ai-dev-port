import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Github } from "lucide-react";
import { useProjects } from "@/hooks/usePortfolioData";

const Projects = () => {
  const { data: projects, loading } = useProjects();

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

          {/* Loading state */}
          {loading && (
            <div className="space-y-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-8 items-center">
                  <Skeleton className="w-full h-64 md:h-80 rounded-xl" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-mono text-sm">
              Nenhum projeto disponível ainda.
            </div>
          )}

          {/* Projects Grid */}
          {!loading && projects.length > 0 && (
            <div className="space-y-12">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`group grid md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden rounded-xl ${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className={`space-y-4 ${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}>
                    <span className="text-primary font-mono text-sm">
                      Projeto {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
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
                    )}

                    {/* Links */}
                    {(project.github_url || project.live_url) && (
                      <div className={`flex gap-4 pt-2 ${index % 2 === 1 ? "md:justify-end" : ""}`}>
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`GitHub de ${project.title}`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Ver ${project.title} ao vivo`}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View More Button */}
          {!loading && projects.length > 0 && (
            <div className="text-center mt-16">
              <Button variant="outline" size="lg">
                Ver Todos os Projetos
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
