import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.jpg";
import { useSecretGesture } from "@/hooks/useSecretGesture";

const Hero = () => {
  const navigate = useNavigate();
  
  const { handlers, isDragging, progress } = useSecretGesture({
    threshold: 100,
    onActivate: () => navigate('/dev'),
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-glow" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Photo with Secret Gesture */}
          <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div 
              className="relative inline-block select-none"
              {...handlers}
              style={{ 
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
            >
              <div 
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-spin-slow blur-sm transition-opacity duration-200"
                style={{ opacity: isDragging ? 0.9 + progress * 0.1 : 0.75 }}
              />
              <div 
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-primary/50 shadow-glow transition-all duration-200"
                style={{ 
                  transform: isDragging ? `translateY(${-progress * 20}px) scale(${1 + progress * 0.05})` : 'none',
                }}
              >
                <img
                  src={profilePhoto}
                  alt="Elves Guilande - Desenvolvedor Web"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Code Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">
              Disponível para novos projetos
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Olá, eu sou{" "}
            <span className="text-gradient">Elves Guilande</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Desenvolvedor Web com <span className="text-foreground font-semibold">3 anos de experiência</span>
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Especializado em <span className="text-primary font-mono">HTML</span> + <span className="text-primary font-mono">CSS</span> e plataformas{" "}
            <span className="text-foreground font-semibold">No-Code/Low-Code com IA</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button variant="hero" size="lg">
              <a href="#projects">Ver Projetos</a>
            </Button>
            <Button variant="heroOutline" size="lg">
              <a href="#contact">Entrar em Contato</a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-secondary hover:bg-muted border border-border hover:border-primary/50 transition-all duration-300"
            >
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-secondary hover:bg-muted border border-border hover:border-primary/50 transition-all duration-300"
            >
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </a>
            <a
              href="mailto:elves@email.com"
              className="p-3 rounded-lg bg-secondary hover:bg-muted border border-border hover:border-primary/50 transition-all duration-300"
            >
              <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <span className="text-xs font-mono">scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
