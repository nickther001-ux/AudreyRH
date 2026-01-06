import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#expertise", label: "Expertise" },
    { href: "/#services", label: "Services" },
    { href: "/book", label: "Book Consultation", isPrimary: true },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled 
          ? "bg-white/90 dark:bg-background/90 backdrop-blur-md shadow-sm border-border/40 py-3" 
          : "bg-transparent py-5"
      )}
      data-testid="navbar"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link 
            href="/"
            className="font-display text-2xl font-bold text-primary tracking-tight"
            data-testid="link-logo"
          >
            Audrey Mondesir<span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 flex-wrap">
            {navLinks.map((link) => (
              link.isPrimary ? (
                <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button className="bg-primary text-white shadow-lg shadow-primary/20 transition-all">
                    {link.label}
                  </Button>
                </Link>
              ) : (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent",
                    location === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              )
            ))}
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-card border-b border-border shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-3 text-base font-medium border-b border-border/50 last:border-0",
                link.isPrimary 
                  ? "text-primary font-bold text-center bg-accent/10 rounded-lg border-0" 
                  : "text-foreground"
              )}
              data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
