import { Link } from "wouter";
import { ArrowRight, CheckCircle, Award, Briefcase, Users, GraduationCap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import audreyPhoto from "@assets/FB_IMG_1767723555659_1767723948957.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden" data-testid="section-about-hero">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Award className="w-4 h-4" />
                À propos
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-about-title">
                Audrey Mondesir<span className="text-accent">.</span>{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">CRIA</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Conseillère en Relations Industrielles Agréée, votre partenaire de confiance pour naviguer le marché de l'emploi québécois.
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-20" data-testid="section-about-content">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
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
              
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Mon engagement envers vous
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  En tant que CRIA (Conseillère en relations industrielles agréée), je comprends les nuances du marché de l'emploi. 
                  Mon expérience dans les secteurs de la construction et de la fabrication me donne un aperçu unique pour vous guider efficacement.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Avec 16 ans d'expérience, je sais ce que les employeurs recherchent. Je suis ici pour briser le mythe que le « prestige » 
                  est le seul chemin vers le succès.
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
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20 bg-muted/30" data-testid="section-expertise">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mon expertise</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Des compétences spécialisées pour vous accompagner dans votre parcours professionnel
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Relations industrielles</h3>
                <p className="text-muted-foreground text-sm">Expertise approfondie des dynamiques employeur-employé</p>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Marché québécois</h3>
                <p className="text-muted-foreground text-sm">Connaissance des codes et attentes locales</p>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Reconnaissance des acquis</h3>
                <p className="text-muted-foreground text-sm">Valorisation de vos compétences internationales</p>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Construction et fabrication</h3>
                <p className="text-muted-foreground text-sm">Spécialisation dans les secteurs en demande</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20" data-testid="section-quote">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl text-primary/20 font-serif mb-4">"</div>
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-6">
                Je vous aiderai à vous concentrer sur la reconnaissance de vos compétences pour que vous puissiez devenir contremaître et commencer à gagner plus tôt.
              </blockquote>
              <p className="text-muted-foreground">— Audrey Mondesir, CRIA</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary" data-testid="section-about-cta">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Prêt à définir votre stratégie ?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Réservez une consultation pour discuter de votre parcours et créer un plan d'action personnalisé.
              </p>
              
              <div className="pt-4">
                <Link href="/book">
                  <Button size="lg" className="bg-accent text-primary font-bold px-10 h-14 text-lg shadow-xl" data-testid="button-about-cta">
                    Réserver une consultation - 50$ CAD
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
