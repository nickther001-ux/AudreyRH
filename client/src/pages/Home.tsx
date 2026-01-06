import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users, CheckCircle, Target, Award, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import audreyPhoto from "@assets/FB_IMG_1767723555659_1767723948957.jpg";

const rotatingWords = ["avec vous", "pour vous", "à vos côtés"];

type ServiceKey = "strategy" | "credentials" | "employability" | "integration" | null;

const serviceDetails = {
  strategy: {
    title: "Analyse stratégique du marché",
    description: "Évitez les erreurs coûteuses avec une analyse basée sur les données réelles",
    stats: [
      { value: "42,6%", label: "des immigrants sont surqualifiés pour leur emploi (vs 24,9% des natifs)", source: "MIFI 2020" },
      { value: "2x", label: "plus de chômage chez les immigrants (8%) vs natifs (4,1%)", source: "Institut du Québec 2024" },
    ],
    content: [
      {
        heading: "Le problème que je résous",
        points: [
          "Beaucoup d'immigrants investissent dans des maîtrises inutiles pour le marché local",
          "Les métiers spécialisés (construction, santé) recrutent plus que les postes de bureau",
          "Sans bonne analyse, vous risquez des années d'études pour un emploi surqualifié",
          "Je vous montre où sont les VRAIES opportunités selon votre profil"
        ]
      },
      {
        heading: "Secteurs qui recrutent activement",
        points: [
          "Santé : infirmiers, préposés - pénurie critique persistante",
          "Construction : 219 200 emplois à pourvoir à Montréal d'ici 2026",
          "Technologies : développeurs, cybersécurité - demande constante",
          "Transport : chauffeurs poids lourds - forte demande"
        ]
      },
      {
        heading: "Mon approche",
        text: "J'utilise les données officielles de quebec.ca/emploi et l'État d'équilibre du marché (516 professions analysées) pour vous donner des recommandations concrètes, pas des conseils génériques."
      }
    ]
  },
  credentials: {
    title: "Reconnaissance des acquis",
    description: "Ne repartez pas à zéro - faites valoir ce que vous savez déjà",
    stats: [
      { value: "10%", label: "des immigrants restent surqualifiés pendant 10+ ans", source: "Statistique Canada" },
      { value: "14%", label: "des diplômés étrangers subissent une surqualification persistante", source: "StatCan 2016-2021" },
    ],
    content: [
      {
        heading: "Pourquoi c'est crucial",
        points: [
          "Retourner aux études = années perdues si vos compétences sont déjà reconnues",
          "Le programme RAC peut vous donner un diplôme québécois SANS retourner à l'école",
          "L'évaluation comparative (138$ en 2025) n'est qu'un avis - pas une équivalence",
          "47,9% des immigrants parrainés sont surqualifiés - la bonne stratégie fait la différence"
        ]
      },
      {
        heading: "La RAC : votre raccourci vers le diplôme",
        points: [
          "Reconnaissance des Acquis et Compétences - gratuit ou faible coût",
          "Obtenez un DEP, AEP ou DEC en démontrant vos compétences existantes",
          "Processus : portfolio, évaluation pratique, formation ciblée si nécessaire",
          "Disponible dans les Centres de services scolaires partout au Québec"
        ]
      },
      {
        heading: "Les 46 ordres professionnels",
        text: "Médecin, ingénieur, comptable, infirmier... Je vous aide à naviguer les exigences spécifiques de chaque ordre via Qualifications Québec et à éviter les démarches inutiles."
      }
    ]
  },
  employability: {
    title: "Stratégie d'employabilité",
    description: "Décrochez votre première expérience canadienne - le plus grand défi",
    stats: [
      { value: "68%", label: "des nouveaux travailleurs en 2024 sont des immigrants", source: "Institut du Québec" },
      { value: "3x", label: "plus de chômage chez les immigrants temporaires (11,7%)", source: "StatCan 2024" },
    ],
    content: [
      {
        heading: "Le vrai obstacle",
        points: [
          "Sans expérience canadienne, votre CV est souvent ignoré",
          "Les employeurs cherchent des preuves que vous comprenez le marché local",
          "Les conseils génériques (refaire son CV) ne suffisent pas",
          "Il faut une stratégie ciblée selon votre secteur et votre statut"
        ]
      },
      {
        heading: "Programmes qui fonctionnent",
        points: [
          "PRIIME : subvention salariale pour votre première embauche (Services Québec)",
          "CITIM : ateliers intensifs CV québécois, entrevues, codes culturels",
          "Interconnexion : réseautage direct avec employeurs (Chambre de commerce)",
          "Mentorat professionnel : accès au réseau d'un professionnel établi"
        ]
      },
      {
        heading: "Ma valeur ajoutée",
        text: "Je vous aide à préparer un dossier PRIIME solide et à cibler les employeurs qui participent à ces programmes. Ensemble, on transforme votre expérience internationale en atout."
      }
    ]
  },
  integration: {
    title: "Intégration au marché",
    description: "Maîtrisez les codes invisibles qui font la différence",
    stats: [
      { value: "+3 pts", label: "hausse du chômage immigrant en 2 ans (5% à 8%)", source: "Institut du Québec" },
      { value: "4M$", label: "investis par Québec pour la reconnaissance des diplômes", source: "Radio-Canada 2021" },
    ],
    content: [
      {
        heading: "Ce que les employeurs ne disent pas",
        points: [
          "La culture du 'tu' et l'approche égalitaire au travail québécois",
          "L'importance du réseautage informel (5 à 7, événements)",
          "Les attentes en communication : direct mais diplomate",
          "L'équilibre travail-vie personnelle est valorisé ici"
        ]
      },
      {
        heading: "Programmes employeurs majeurs",
        points: [
          "Hydro-Québec : Programme d'intégration 30 semaines pour nouveaux arrivants",
          "Ville de Québec/Montréal : stages rémunérés pour immigrants",
          "Desjardins, Banque Nationale : programmes diversité active",
          "Emplois en régions : opportunités hors Montréal avec aide à l'installation"
        ]
      },
      {
        heading: "Changement 2025",
        text: "Depuis février 2025, les travailleurs étrangers temporaires ne sont plus admissibles à certains services d'emploi. Je vous aide à identifier les programmes auxquels VOUS avez droit selon votre statut."
      }
    ]
  }
};

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState<ServiceKey>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const renderServiceDialog = (key: ServiceKey) => {
    if (!key) return null;
    const service = serviceDetails[key];
    
    return (
      <Dialog open={openDialog === key} onOpenChange={(open) => setOpenDialog(open ? key : null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{service.title}</DialogTitle>
            <DialogDescription className="text-base">
              {service.description}
            </DialogDescription>
          </DialogHeader>
          
          {/* Statistics Cards */}
          {service.stats && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {service.stats.map((stat, idx) => (
                <div key={idx} className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground leading-tight">{stat.label}</div>
                  <div className="text-xs text-muted-foreground/70 mt-2 italic">Source: {stat.source}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="space-y-6 mt-6">
            {service.content.map((section, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-lg mb-3 text-foreground">{section.heading}</h4>
                {section.points ? (
                  <ul className="space-y-2">
                    {section.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Link href="/book">
              <Button className="w-full" size="lg">
                Réserver une consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Service Dialogs */}
      {renderServiceDialog("strategy")}
      {renderServiceDialog("credentials")}
      {renderServiceDialog("employability")}
      {renderServiceDialog("integration")}

      <main className="flex-grow">
        {/* Hero Section - gorh.co style */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 bg-gradient-to-br from-primary/5 via-background to-accent/5" data-testid="section-hero">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight" data-testid="text-hero-title">
                Une experte CRIA
                <br />
                <span className="text-primary relative inline-block min-w-[280px] md:min-w-[400px]">
                  <span 
                    key={wordIndex}
                    className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-300"
                  >
                    {rotatingWords[wordIndex]}
                  </span>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
                Réalisons ensemble votre potentiel de carrière au Québec. Audrey Mondesir, votre partenaire de confiance pour naviguer le marché de l'emploi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 flex-wrap">
                <Link href="/book">
                  <Button size="lg" className="bg-primary text-white px-8 h-14 text-base shadow-xl shadow-primary/20" data-testid="button-hero-book">
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#services">
                  <Button variant="outline" size="lg" className="px-8 h-14 text-base border-2" data-testid="button-hero-services">
                    Découvrir mes services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Question Section - like gorh.co */}
        <section className="py-20 bg-card border-y border-border" data-testid="section-question">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-question-title">
                Où en êtes-vous dans votre parcours professionnel ?
              </h2>
              <p className="text-lg text-muted-foreground">
                Beaucoup d'immigrants croient qu'un diplôme de maîtrise est la seule voie vers le succès. 
                La réalité ? Le marché québécois recherche souvent des métiers spécialisés bien plus que des diplômes avancés.
              </p>
              <Link href="/book">
                <Button variant="outline" size="lg" className="mt-4" data-testid="button-discover-services">
                  Découvrir comment je peux vous aider
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section - Grid like gorh.co */}
        <section id="services" className="py-20" data-testid="section-services">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Un accompagnement sur mesure selon vos besoins
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Des services adaptés à votre réalité et à vos objectifs de carrière
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Analyse stratégique - Has dialog */}
              <Card className="p-8 hover:shadow-lg transition-shadow border-border" data-testid="card-service-strategy">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Analyse stratégique du marché</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Comprenez quelles professions recrutent vraiment au Québec. Une analyse fine du marché pour orienter vos décisions.
                </p>
                <button 
                  onClick={() => setOpenDialog("strategy")}
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                  data-testid="button-learn-more-strategy"
                >
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              {/* Reconnaissance des acquis - Has dialog */}
              <Card className="p-8 hover:shadow-lg transition-shadow border-border" data-testid="card-service-credentials">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Reconnaissance des acquis</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Je vous aide à faire reconnaître vos compétences et à éviter les pièges des études inutiles.
                </p>
                <button 
                  onClick={() => setOpenDialog("credentials")}
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                  data-testid="button-learn-more-credentials"
                >
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              {/* Stratégie d'employabilité - Has dialog */}
              <Card className="p-8 hover:shadow-lg transition-shadow border-border" data-testid="card-service-employability">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Stratégie d'employabilité</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Oubliez les conseils génériques. Concentrons-nous sur les compétences pratiques qui mènent à l'emploi.
                </p>
                <button 
                  onClick={() => setOpenDialog("employability")}
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                  data-testid="button-learn-more-employability"
                >
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              {/* Coaching de carrière - Links to booking (no dialog) */}
              <Card className="p-8 hover:shadow-lg transition-shadow border-border" data-testid="card-service-coaching">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Coaching de carrière</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Un accompagnement personnalisé pour définir et atteindre vos objectifs professionnels au Québec.
                </p>
                <Link href="/book" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                  Réserver <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Orientation professionnelle - Links to booking (no dialog) */}
              <Card className="p-8 hover:shadow-lg transition-shadow border-border" data-testid="card-service-orientation">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Orientation professionnelle</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Identifiez le meilleur chemin vers une carrière épanouissante basée sur vos expériences et compétences.
                </p>
                <Link href="/book" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                  Réserver <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Intégration au marché - Has dialog */}
              <Card className="p-8 hover:shadow-lg transition-shadow border-border" data-testid="card-service-integration">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Intégration au marché</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Comprenez les codes du marché québécois et positionnez-vous efficacement auprès des employeurs.
                </p>
                <button 
                  onClick={() => setOpenDialog("integration")}
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                  data-testid="button-learn-more-integration"
                >
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </button>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section - Professional like gorh.co */}
        <section id="expertise" className="py-20 bg-card border-y border-border" data-testid="section-about">
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

        {/* Testimonial/Quote Section */}
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
                    Réserver une consultation - 50$ USD
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
