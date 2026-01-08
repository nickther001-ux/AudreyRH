import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      window.location.href = "/#" + sectionId;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { href: "/", label: "Accueil", isAnchor: false },
    { href: "services", label: "Méthode & Services", isAnchor: true },
    { href: "expertise", label: "À Propos", isAnchor: true },
    { href: "section-testimonials", label: "Témoignages", isAnchor: true },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border py-3" 
          : "bg-transparent py-5"
      )}
      data-testid="navbar"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            href="/"
            className="text-2xl font-bold text-foreground tracking-tight"
            data-testid="link-logo"
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Audrey</span> Mondesir<span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 flex-wrap">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <button 
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </button>
              ) : (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              )
            ))}
            
            <Link href="/book" data-testid="link-book-consultation">
              <Button className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 border-0">
                Réserver ma consultation
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-4 flex flex-col gap-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            link.isAnchor ? (
              <button 
                key={link.href}
                onClick={() => {
                  scrollToSection(link.href);
                  setMobileMenuOpen(false);
                }}
                className="block py-3 px-4 text-base font-medium rounded-lg transition-colors text-foreground hover:bg-muted text-left"
                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </button>
            ) : (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-3 px-4 text-base font-medium rounded-lg transition-colors",
                  location === link.href 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground hover:bg-muted"
                )}
                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            )
          ))}
          <div className="pt-2 border-t border-border mt-2">
            <Link 
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-book"
            >
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 border-0">
                Réserver ma consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
