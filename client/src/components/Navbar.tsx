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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/individuals", label: t("nav.individuals") },
    { href: "/business",   label: t("nav.business") },
    { href: "/grants",     label: t("nav.grants") },
    { href: "/contact",    label: t("nav.contact") },
  ];

  const toggleLanguage = () => setLanguage(language === "fr" ? "en" : "fr");

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300",
        isScrolled ? "shadow-[0_1px_0_0_hsl(var(--border))]" : ""
      )}
      data-testid="navbar"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="text-[1.3rem] font-bold tracking-tight flex-shrink-0"
            data-testid="link-logo"
          >
            <span style={{ color: "#1e3a5f" }}>Audrey</span><span className="text-foreground">RH</span><span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[13px] font-medium transition-colors duration-150",
                  location === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: language + CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-transparent px-2"
              data-testid="button-language-toggle"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language === "fr" ? "EN" : "FR"}</span>
            </Button>

            <Link href="/book" data-testid="link-book-consultation">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-none px-5 h-9 text-[13px] font-medium">
                {t("nav.book")}
              </Button>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-language-toggle-mobile"
            >
              <Globe className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-border shadow-lg py-3 flex flex-col animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-3 px-6 text-[14px] font-medium transition-colors",
                location === link.href
                  ? "text-foreground bg-muted/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
              data-testid={`link-mobile-${link.href.replace("/", "") || "home"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-4 pb-3 border-t border-border mt-2">
            <Link href="/book" onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-book">
              <Button className="w-full bg-primary text-white rounded-none font-medium text-[13px] h-10">
                {t("nav.book")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
