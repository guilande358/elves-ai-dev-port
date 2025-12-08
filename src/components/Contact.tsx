import { Button } from "@/components/ui/button";
import { Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section Header */}
          <span className="text-primary font-mono text-sm">04. E agora?</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">Vamos Trabalhar Juntos</h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
            Estou sempre aberto para discutir novos projetos, ideias criativas ou oportunidades 
            de fazer parte da sua visão.
          </p>

          {/* Contact Card */}
          <div className="p-8 md:p-12 rounded-2xl bg-card border border-border shadow-card">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:elves.guilande@email.com" className="text-foreground hover:text-primary transition-colors">
                    elves.guilande@email.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <span className="text-foreground">Brasil</span>
                </div>
              </div>
            </div>

            <Button variant="hero" size="xl" className="w-full md:w-auto">
              <Send className="h-5 w-5 mr-2" />
              <a href="mailto:elves.guilande@email.com">Enviar Mensagem</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
