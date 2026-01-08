import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, TrendingUp, GraduationCap, Briefcase, Users, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceLinks = [
  { href: "/services#strategy", label: "Analyse stratégique du marché", icon: TrendingUp },
  { href: "/services#credentials", label: "Reconnaissance des acquis", icon: GraduationCap },
  { href: "/services#employability", label: "Stratégie d'employabilité", icon: Briefcase },
  { href: "/services#integration", label: "Intégration au marché", icon: Users },
  { href: "/services#coaching", label: "Coaching de carrière", icon: Target },
  { href: "/services#orientation", label: "Orientation professionnelle", icon: Award },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceClick = (href: string) => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    const [path, hash] = href.split('#');
    if (hash) {
      window.location.href = href;
    }
  };

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
            <Link 
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/" ? "text-primary" : "text-muted-foreground"
              )}
              data-testid="link-accueil"
            >
              Accueil
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary inline-flex items-center gap-1",
                  location.startsWith("/services") ? "text-primary" : "text-muted-foreground"
                )}
                data-testid="link-services-dropdown"
              >
                Services
                <ChevronDown className={cn("w-4 h-4 transition-transform", servicesDropdownOpen && "rotate-180")} />
              </button>
              
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-lg shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    href="/services"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="block px-4 py-3 rounded-md hover:bg-muted transition-colors font-medium text-foreground border-b border-border mb-2"
                    data-testid="link-services-all"
                  >
                    Tous les services
                  </Link>
                  {serviceLinks.map((service) => {
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.href}
                        onClick={() => handleServiceClick(service.href)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors text-left"
                        data-testid={`link-service-${service.href.split('#')[1]}`}
                      >
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{service.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <Link 
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/about" ? "text-primary" : "text-muted-foreground"
              )}
              data-testid="link-about"
            >
              À propos
            </Link>
            
            <Link href="/book" data-testid="link-book-consultation">
              <Button className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 border-0">
                Prendre rendez-vous
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
          <Link 
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block py-3 px-4 text-base font-medium rounded-lg transition-colors",
              location === "/" 
                ? "text-primary bg-primary/5" 
                : "text-foreground hover:bg-muted"
            )}
            data-testid="link-mobile-accueil"
          >
            Accueil
          </Link>
          
          {/* Mobile Services Accordion */}
          <div>
            <button 
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className={cn(
                "w-full flex items-center justify-between py-3 px-4 text-base font-medium rounded-lg transition-colors text-left",
                location.startsWith("/services") 
                  ? "text-primary bg-primary/5" 
                  : "text-foreground hover:bg-muted"
              )}
              data-testid="link-mobile-services-toggle"
            >
              Services
              <ChevronDown className={cn("w-5 h-5 transition-transform", mobileServicesOpen && "rotate-180")} />
            </button>
            
            {mobileServicesOpen && (
              <div className="ml-4 mt-1 space-y-1 animate-in fade-in duration-200">
                <Link 
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 text-sm font-medium rounded-md text-primary hover:bg-muted"
                  data-testid="link-mobile-services-all"
                >
                  Tous les services
                </Link>
                {serviceLinks.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.href}
                      onClick={() => handleServiceClick(service.href)}
                      className="w-full flex items-center gap-3 py-2 px-4 text-sm rounded-md text-muted-foreground hover:bg-muted text-left"
                      data-testid={`link-mobile-service-${service.href.split('#')[1]}`}
                    >
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      {service.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <Link 
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block py-3 px-4 text-base font-medium rounded-lg transition-colors",
              location === "/about" 
                ? "text-primary bg-primary/5" 
                : "text-foreground hover:bg-muted"
            )}
            data-testid="link-mobile-about"
          >
            À propos
          </Link>
          
          <div className="pt-2 border-t border-border mt-2">
            <Link 
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-book"
            >
              <Button className="w-full bg-primary text-white">
                Prendre rendez-vous
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
