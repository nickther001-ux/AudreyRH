import { Link } from "wouter";
import { Linkedin, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/95 text-background pt-20 pb-10" data-testid="footer">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <h3 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Audrey</span> Mondesir<span className="text-accent">.</span>
            </h3>
            <p className="text-background/60 max-w-sm leading-relaxed text-lg">
              Conseillère en relations industrielles agréée (CRIA). Experte en stratégie d'employabilité pour les nouveaux arrivants au Québec.
            </p>
            <div className="flex gap-3 pt-2 flex-wrap">
              <a 
                href="#" 
                className="w-11 h-11 bg-background/10 rounded-xl flex items-center justify-center hover:bg-primary hover:scale-105 transition-all duration-300"
                data-testid="link-linkedin"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@audreymondesir.com" 
                className="w-11 h-11 bg-background/10 rounded-xl flex items-center justify-center hover:bg-primary hover:scale-105 transition-all duration-300"
                data-testid="link-email-icon"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-background/70 hover:text-primary transition-colors" data-testid="link-footer-home">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-background/70 hover:text-primary transition-colors" data-testid="link-footer-services">
                  Méthode & Services
                </Link>
              </li>
              <li>
                <Link href="/#expertise" className="text-background/70 hover:text-primary transition-colors" data-testid="link-footer-about">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/#section-testimonials" className="text-background/70 hover:text-primary transition-colors" data-testid="link-footer-testimonials">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-background/70 hover:text-primary transition-colors" data-testid="link-footer-book">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Contact</h4>
            <ul className="space-y-3 text-background/70">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="flex-shrink-0" />
                Montréal, Québec
              </li>
              <li>
                <a 
                  href="mailto:contact@audreymondesir.com" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-email"
                >
                  contact@audreymondesir.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <p data-testid="text-copyright">&copy; {new Date().getFullYear()} Audrey Mondesir<span className="text-accent">.</span> Tous droits réservés.</p>
          <p className="text-background/30">Consultation en relations industrielles</p>
        </div>
      </div>
    </footer>
  );
}
