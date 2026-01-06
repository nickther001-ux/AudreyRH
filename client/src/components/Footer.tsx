import { Link } from "wouter";
import { Linkedin, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-10" data-testid="footer">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-3xl font-bold text-white">Audrey Mondesir<span className="text-accent">.</span></h3>
            <p className="text-primary-foreground/80 max-w-sm leading-relaxed">
              Expert guidance on industrial relations and employability strategy for newcomers in Quebec.
              Navigating your career path with clarity and purpose.
            </p>
            <div className="flex gap-4 pt-2 flex-wrap">
              <a 
                href="#" 
                className="p-2 bg-white/10 rounded-full hover:bg-accent hover:text-primary transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@audreymondesir.com" 
                className="p-2 bg-white/10 rounded-full hover:bg-accent hover:text-primary transition-colors"
                data-testid="link-email-icon"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-lg font-semibold mb-6 text-white">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="hover:text-accent transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#expertise" className="hover:text-accent transition-colors" data-testid="link-footer-expertise">
                  My Expertise
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-accent transition-colors" data-testid="link-footer-services">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-accent transition-colors" data-testid="link-footer-book">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-primary-foreground/80">
              <li>Montreal, Quebec</li>
              <li>
                <a 
                  href="mailto:contact@audreymondesir.com" 
                  className="hover:text-accent transition-colors flex items-center gap-2 flex-wrap"
                  data-testid="link-footer-email"
                >
                  contact@audreymondesir.com <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p data-testid="text-copyright">&copy; {new Date().getFullYear()} Audrey Mondesir. All rights reserved.</p>
          <p>Designed with professional intent.</p>
        </div>
      </div>
    </footer>
  );
}
