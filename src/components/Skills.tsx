import { Bot, Code, Layout, Palette, Zap, Workflow } from "lucide-react";

const skills = [
  {
    icon: Code,
    title: "HTML5",
    description: "Estruturação semântica e acessível para web",
    level: 95,
  },
  {
    icon: Palette,
    title: "CSS3",
    description: "Estilização avançada, animações e responsividade",
    level: 90,
  },
  {
    icon: Layout,
    title: "Flexbox & Grid",
    description: "Layouts modernos e flexíveis",
    level: 88,
  },
  {
    icon: Bot,
    title: "IA Tools",
    description: "ChatGPT, Midjourney, Claude e mais",
    level: 85,
  },
  {
    icon: Zap,
    title: "No-Code",
    description: "Webflow, Framer, Bubble",
    level: 82,
  },
  {
    icon: Workflow,
    title: "Low-Code",
    description: "Retool, Airtable, Zapier",
    level: 80,
  },
];

const Skills = () => {
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

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div
                key={skill.title}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <skill.icon className="h-6 w-6 text-primary" />
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
                      width: `${skill.level}%`,
                      background: 'var(--gradient-primary)',
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2 block text-right font-mono">
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>

          {/* Tools Section */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6 text-center">Ferramentas que utilizo</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "VS Code", "Figma", "Git", "Webflow", "Framer", 
                "Lovable", "ChatGPT", "Claude", "Notion", "Zapier"
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
