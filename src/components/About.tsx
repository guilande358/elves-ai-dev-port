import { Briefcase, Calendar, Sparkles } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-12">
            <span className="text-primary font-mono text-sm">01.</span>
            <h2 className="text-3xl md:text-4xl font-bold">Sobre Mim</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Sou um desenvolvedor apaixonado por criar experiências digitais que combinam 
                design elegante com funcionalidade intuitiva. Com <span className="text-foreground font-semibold">3 anos de experiência</span>, 
                me especializei em desenvolvimento front-end e na utilização de ferramentas modernas.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Minha jornada começou com <span className="text-primary font-mono">HTML</span> e <span className="text-primary font-mono">CSS</span>, 
                e evoluiu para o uso estratégico de plataformas <span className="text-foreground font-semibold">No-Code/Low-Code</span> potencializadas 
                por <span className="text-foreground font-semibold">Inteligência Artificial</span>. Isso me permite entregar projetos 
                de alta qualidade com maior velocidade e eficiência.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Acredito que a tecnologia deve simplificar a vida das pessoas, e é isso que busco 
                em cada projeto que desenvolvo.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">3+</h3>
                    <p className="text-muted-foreground text-sm">Anos de Experiência</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">20+</h3>
                    <p className="text-muted-foreground text-sm">Projetos Entregues</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">IA</h3>
                    <p className="text-muted-foreground text-sm">Especialista No-Code/Low-Code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
