import { Switch, Route, useLocation } from "wouter";
import { useEffect, Component, type ReactNode } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { ScrollProgress } from "@/components/ScrollProgress";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace", background: "#fff1f0", minHeight: "100vh" }}>
          <h2 style={{ color: "#c00", marginBottom: 12 }}>Render Error</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "#333", fontSize: 13 }}>{this.state.error.message}\n\n{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Book from "@/pages/Book";
import Admin from "@/pages/Admin";
import Terms from "@/pages/Terms";
import Grants from "@/pages/Grants";
import Contact from "@/pages/Contact";
import Individuals from "@/pages/Individuals";
import Business from "@/pages/Business";
import Faq from "@/pages/Faq";

function useScrollReveal() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tagged: Element[] = [];
    let observer: IntersectionObserver;

    const timer = setTimeout(() => {
      const autoTag = (selector: string, type = "") => {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          if (el.closest("[data-hero]")) return;
          if (!el.hasAttribute("data-scroll")) {
            el.setAttribute("data-scroll", type);
            tagged.push(el);
          }
        });
      };

      const autoTagGrid = (selector: string) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
          if (el.closest("[data-hero]")) return;
          if (!el.hasAttribute("data-scroll")) {
            el.setAttribute("data-scroll", "scale");
            el.style.setProperty("--scroll-delay", `${Math.min(i % 4, 3) * 100}ms`);
            tagged.push(el);
          }
        });
      };

      autoTag("section > div > h2");
      autoTag("section > div > h3");
      autoTag("section > div > div > h2");
      autoTag("section > div > div > h3");
      autoTagGrid("section .grid > *");

      const all = document.querySelectorAll("[data-scroll]");

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
      );

      all.forEach((el) => observer.observe(el));
    }, 80);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      tagged.forEach((el) => {
        el.removeAttribute("data-scroll");
        el.classList.remove("in-view");
        el.style.removeProperty("--scroll-delay");
      });
    };
  }, [location]);
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  useScrollReveal();
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/individuals" component={Individuals} />
        <Route path="/business" component={Business} />
        <Route path="/book" component={Book} />
        <Route path="/admin" component={Admin} />
        <Route path="/terms" component={Terms} />
        <Route path="/grants" component={Grants} />
        <Route path="/faq" component={Faq} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <ScrollProgress />
            <Toaster />
            <Router />
            <PrivacyConsent />
          </ErrorBoundary>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
