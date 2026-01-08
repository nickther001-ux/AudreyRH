import { Link } from "wouter";
import { useState } from "react";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users, CheckCircle, Target, Award, X, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import audreyPhoto from "@assets/FB_IMG_1767723555659_(1)_1767841722642.jpg";

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
          "Sans bonne analyse, vous risquez des années d'études pour un emploi dans lequel vous serez surqualifié",
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
  const [openDialog, setOpenDialog] = useState<ServiceKey>(null);

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
        {/* Hero Section - Modern elegant style */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden" data-testid="section-hero">
          {/* Background gradient */}
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
                Ne recommencez pas à zéro.
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Intégrez le marché efficacement
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
                Plus qu'un simple CV. Une stratégie ciblée pour valoriser vos compétences réelles et accéder rapidement aux emplois en demande au Canada.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 flex-wrap">
                <Link href="/book">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-white px-8 h-14 text-base shadow-xl shadow-primary/25 border-0" data-testid="button-hero-book">
                    Réserver ma consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#services">
                  <Button variant="outline" size="lg" className="px-8 h-14 text-base border-2 backdrop-blur-sm" data-testid="button-hero-services">
                    Découvrir mes services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Orientation Stratégique */}
        <section className="py-24 relative overflow-hidden" data-testid="section-orientation">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                Ma Valeur Ajoutée
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Orientation Stratégique & Marché de l'Emploi
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Évitez le piège de la surqualification et des années d'études inutiles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-border bg-card" data-testid="card-audit">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Audit de Compétences</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Analyse approfondie de votre parcours pour identifier les compétences transférables au marché canadien.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Cartographie de vos compétences techniques et comportementales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Identification des équivalences avec les standards canadiens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Valorisation de votre expérience internationale</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-border bg-card" data-testid="card-ciblage">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ciblage des Métiers en Pénurie</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Orientation stratégique vers les secteurs qui recrutent activement et valorisent votre profil.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Analyse des secteurs en demande au Québec et au Canada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Matching avec les postes correspondant à votre expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Accès aux opportunités du marché caché</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-border bg-card" data-testid="card-optimisation">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Optimisation du Parcours</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Plan d'action personnalisé pour combler les écarts sans repartir de zéro.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Micro-formations et certifications rapides ciblées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Reconnaissance des acquis et équivalences de diplômes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Stratégie d'insertion rapide sur le marché</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 3: Outils Opérationnels */}
        <section id="services" className="py-24 bg-muted/30" data-testid="section-services">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                Outils Concrets
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Des outils concrets pour décrocher l'entrevue
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Les services essentiels pour vous démarquer sur le marché canadien
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* CV */}
              <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-border bg-card" data-testid="card-service-cv">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Adaptation de CV</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  CV aux normes canadiennes, optimisé pour les systèmes ATS utilisés par les recruteurs.
                </p>
                <Link href="/book" className="text-primary font-medium inline-flex items-center gap-1" data-testid="button-learn-more-cv">
                  Réserver <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* LinkedIn */}
              <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-border bg-card" data-testid="card-service-linkedin">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Optimisation LinkedIn</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Profil LinkedIn optimisé pour attirer les recruteurs et élargir votre réseau professionnel.
                </p>
                <Link href="/book" className="text-primary font-medium inline-flex items-center gap-1" data-testid="button-learn-more-linkedin">
                  Réserver <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Entrevues */}
              <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-border bg-card" data-testid="card-service-interview">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Préparation aux entrevues</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Maîtrisez les codes culturels québécois et canadiens pour réussir vos entrevues.
                </p>
                <Link href="/book" className="text-primary font-medium inline-flex items-center gap-1" data-testid="button-learn-more-interview">
                  Réserver <ArrowRight className="w-4 h-4" />
                </Link>
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

        {/* Section Témoignages */}
        <section id="section-testimonials" className="py-20" data-testid="section-testimonials">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                Preuve Sociale
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Ils ont réussi leur intégration
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 bg-card border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  Grâce à Audrey, j'ai évité une maîtrise inutile et j'ai trouvé un poste de gestionnaire en 3 mois.
                </blockquote>
                <p className="text-muted-foreground text-sm font-medium">— M.K., Gestionnaire de projet</p>
              </Card>

              <Card className="p-8 bg-card border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  Son analyse du marché m'a permis de cibler les bons secteurs. J'ai décroché un emploi en construction en 6 semaines.
                </blockquote>
                <p className="text-muted-foreground text-sm font-medium">— J.P., Technicien en construction</p>
              </Card>

              <Card className="p-8 bg-card border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  L'optimisation de mon CV et LinkedIn a tout changé. Les recruteurs me contactent maintenant directement.
                </blockquote>
                <p className="text-muted-foreground text-sm font-medium">— S.L., Analyste financier</p>
              </Card>

              <Card className="p-8 bg-card border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  Audrey m'a aidé à comprendre le marché québécois et à adapter mon approche. Résultat: CDI en 2 mois!
                </blockquote>
                <p className="text-muted-foreground text-sm font-medium">— A.B., Ingénieur logiciel</p>
              </Card>

              <Card className="p-8 bg-card border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  La préparation aux entrevues était exceptionnelle. J'ai pu décoder les attentes culturelles et réussir mes entretiens.
                </blockquote>
                <p className="text-muted-foreground text-sm font-medium">— F.M., Comptable CPA</p>
              </Card>

              <Card className="p-8 bg-card border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  Investissement rentabilisé dès le premier mois. Ma nouvelle carrière au Canada a enfin démarré grâce à ses conseils.
                </blockquote>
                <p className="text-muted-foreground text-sm font-medium">— R.T., Directeur marketing</p>
              </Card>
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
