import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home"), isAnchor: false },
    { href: "/individuals", label: t("nav.individuals"), isAnchor: false },
    { href: "/business", label: t("nav.business"), isAnchor: false },
    { href: "/grants", label: t("nav.grants"), isAnchor: false },
    { href: "/contact", label: t("nav.contact"), isAnchor: false },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
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
            className="text-2xl font-bold text-foreground tracking-tight flex-shrink-0"
            data-testid="link-logo"
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Audrey</span>
            <span className={cn(isScrolled ? "text-foreground" : "text-white")}>RH</span>
            <span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5 flex-wrap">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href
                    ? "text-primary"
                    : isScrolled
                    ? "text-muted-foreground"
                    : "text-white/80"
                )}
                data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={cn(
                "flex items-center gap-2",
                !isScrolled && "text-white/80 hover:text-white hover:bg-white/10"
              )}
              data-testid="button-language-toggle"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-medium">{language === "fr" ? "EN" : "FR"}</span>
            </Button>

            <Link href="/book" data-testid="link-book-consultation">
              <Button className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 border-0">
                {t("nav.book")}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className={cn(!isScrolled && "text-white hover:bg-white/10")}
              data-testid="button-language-toggle-mobile"
            >
              <Globe className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(!isScrolled && "text-white hover:bg-white/10")}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-4 flex flex-col gap-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
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
              data-testid={`link-mobile-${link.href.replace("/", "") || "home"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            <Link href="/book" onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-book">
              <Button className="w-full bg-primary text-white">{t("nav.book")}</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
