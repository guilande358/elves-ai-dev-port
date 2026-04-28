import {
  Bot,
  Code,
  Layout,
  Palette,
  Zap,
  Workflow,
  Database,
  Globe,
  Smartphone,
  Cpu,
  Cloud,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSkills } from "@/hooks/usePortfolioData";

const iconMap: Record<string, LucideIcon> = {
  Code,
  Palette,
  Layout,
  Bot,
  Zap,
  Workflow,
  Database,
  Globe,
  Smartphone,
  Cpu,
  Cloud,
  GitBranch,
};

const Skills = () => {
  const { data: skills, loading } = useSkills();

  return (
    <section id="skills" className="py-24 bg-secondary/30 relative">
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-12">
            <span className="text-primary font-mono text-sm">02.</span>
            <h2 className="text-3xl md:text-4xl font-bold">Skills & Tecnologias</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && skills.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-mono text-sm">
              Nenhuma skill disponível ainda.
            </div>
          )}

          {/* Skills Grid */}
          {!loading && skills.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => {
                const Icon = iconMap[skill.icon ?? "Code"] ?? Code;
                const level = skill.level ?? 0;
                return (
                  <div
                    key={skill.id}
                    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{skill.title}</h3>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      </div>
                    </div>

                    {/* Skill Bar */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${level}%`,
                          background: "var(--gradient-primary)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 block text-right font-mono">
                      {level}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tools Section */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6 text-center">Ferramentas que utilizo</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "VS Code", "Figma", "Git", "Webflow", "Framer",
                "Lovable", "ChatGPT", "Claude", "Notion", "Zapier",
              ].map((tool) => (
                <span
                  key={tool}
                  className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 cursor-default"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
