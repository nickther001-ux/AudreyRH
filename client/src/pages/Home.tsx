import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users, CheckCircle, Target, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import audreyPhoto from "@assets/FB_IMG_1767723555659_1767723948957.jpg";

const rotatingWords = ["avec vous", "pour vous", "à vos côtés"];

const services = [
  { icon: TrendingUp, title: "Analyse stratégique", description: "Comprenez quelles professions recrutent vraiment au Québec.", href: "/services#strategy" },
  { icon: GraduationCap, title: "Reconnaissance des acquis", description: "Faites reconnaître vos compétences sans retourner à l'école.", href: "/services#credentials" },
  { icon: Briefcase, title: "Stratégie d'employabilité", description: "Décrochez votre première expérience canadienne.", href: "/services#employability" },
  { icon: Target, title: "Coaching de carrière", description: "Accompagnement personnalisé pour atteindre vos objectifs.", href: "/services#coaching" },
  { icon: Award, title: "Orientation professionnelle", description: "Identifiez le meilleur chemin vers une carrière épanouissante.", href: "/services#orientation" },
  { icon: Users, title: "Intégration au marché", description: "Maîtrisez les codes invisibles du marché québécois.", href: "/services#integration" },
];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden" data-testid="section-hero">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Conseillère en Relations Industrielles Agréée
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight" data-testid="text-hero-title">
                Une experte CRIA
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent relative inline-block min-w-[280px] md:min-w-[400px]">
                  <span 
                    key={wordIndex}
                    className="inline-block animate-in fade-in slide-in-from-bottom-2 duration-200"
                  >
                    {rotatingWords[wordIndex]}
                  </span>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
                Réalisons ensemble votre potentiel de carrière au Québec. Audrey Mondesir, votre partenaire de confiance pour naviguer le marché de l'emploi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 flex-wrap">
                <Link href="/book">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-white px-8 h-14 text-base shadow-xl shadow-primary/25 border-0" data-testid="button-hero-book">
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg" className="px-8 h-14 text-base border-2 backdrop-blur-sm" data-testid="button-hero-services">
                    Découvrir mes services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Question Section */}
        <section className="py-24 relative overflow-hidden" data-testid="section-question">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <Card className="p-10 md:p-14 text-center bg-card/80 backdrop-blur-sm shadow-xl border-primary/10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-question-title">
                  Où en êtes-vous dans votre parcours professionnel ?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Beaucoup d'immigrants croient qu'un diplôme de maîtrise est la seule voie vers le succès. 
                  La réalité ? Le marché québécois recherche souvent des métiers spécialisés bien plus que des diplômes avancés.
                </p>
                <Link href="/services">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20" data-testid="button-discover-services">
                    Découvrir comment je peux vous aider
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-24 bg-muted/30" data-testid="section-services-preview">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Services
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Un accompagnement sur mesure
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Des services adaptés à votre réalité et à vos objectifs de carrière
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link key={service.href} href={service.href}>
                    <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border-border bg-card h-full cursor-pointer" data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                    </Card>
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="outline" size="lg" className="px-8" data-testid="button-view-all-services">
                  Voir tous les services
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-20 bg-card border-y border-border" data-testid="section-about-preview">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  À propos
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-about-title">
                  Mon engagement envers vous
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  En tant que CRIA (Conseillère en relations industrielles agréée), je comprends les nuances du marché de l'emploi. 
                  Mon expérience dans les secteurs de la construction et de la fabrication me donne un aperçu unique pour vous guider efficacement.
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">16 années d'expertise en relations industrielles</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Connaissance approfondie du marché québécois</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Accompagnement personnalisé et stratégique</span>
                  </div>
                </div>
                
                <Link href="/about">
                  <Button variant="outline" className="mt-4" data-testid="button-learn-more-about">
                    En savoir plus
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="relative">
                <div className="rounded-2xl shadow-2xl overflow-hidden">
                  <img 
                    src={audreyPhoto} 
                    alt="Audrey Mondesir - CRIA" 
                    className="w-full object-cover object-top"
                    style={{ marginBottom: '-15%' }}
                    data-testid="img-about"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-xl -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-primary/20 rounded-xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20" data-testid="section-quote">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl text-primary/20 font-serif mb-4">"</div>
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-6" data-testid="text-quote">
                Je vous aiderai à vous concentrer sur la reconnaissance de vos compétences pour que vous puissiez devenir contremaître et commencer à gagner plus tôt.
              </blockquote>
              <p className="text-muted-foreground">— Audrey Mondesir, CRIA</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary" data-testid="section-cta">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white" data-testid="text-cta-title">
                Prêt à définir votre stratégie ?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Arrêtez de deviner et commencez à planifier. Réservez une consultation individuelle pour analyser votre profil et créer votre feuille de route.
              </p>
              
              <div className="pt-4">
                <Link href="/book">
                  <Button size="lg" className="bg-accent text-primary font-bold px-10 h-14 text-lg shadow-xl" data-testid="button-cta-book">
                    Réserver une consultation - 50$ CAD
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-primary-foreground/60">
                  Paiement sécurisé via Stripe
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
