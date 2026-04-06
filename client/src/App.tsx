import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
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

function Router() {
  return (
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
