import { Link } from "wouter";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users, CheckCircle, Target, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const services = [
  {
    id: "strategy",
    icon: TrendingUp,
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
  {
    id: "credentials",
    icon: GraduationCap,
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
  {
    id: "employability",
    icon: Briefcase,
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
  {
    id: "integration",
    icon: Users,
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
  },
  {
    id: "coaching",
    icon: Target,
    title: "Coaching de carrière",
    description: "Un accompagnement personnalisé pour définir et atteindre vos objectifs professionnels au Québec",
    content: [
      {
        heading: "Ce que je vous offre",
        points: [
          "Évaluation approfondie de votre profil et vos objectifs",
          "Création d'un plan d'action personnalisé",
          "Accompagnement continu dans votre progression",
          "Stratégies adaptées à votre situation unique"
        ]
      }
    ]
  },
  {
    id: "orientation",
    icon: Award,
    title: "Orientation professionnelle",
    description: "Identifiez le meilleur chemin vers une carrière épanouissante basée sur vos expériences et compétences",
    content: [
      {
        heading: "Mon approche",
        points: [
          "Analyse de vos compétences transférables",
          "Exploration des opportunités selon votre profil",
          "Recommandations basées sur les tendances du marché",
          "Accompagnement dans votre prise de décision"
        ]
      }
    ]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden" data-testid="section-services-hero">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Target className="w-4 h-4" />
                Services
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-services-title">
                Un accompagnement{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">sur mesure</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Des services adaptés à votre réalité et à vos objectifs de carrière au Québec
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16" data-testid="section-services-list">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-20">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={service.id} 
                    id={service.id}
                    className={`grid md:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    data-testid={`section-service-${service.id}`}
                  >
                    <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold">{service.title}</h2>
                      <p className="text-lg text-muted-foreground">{service.description}</p>
                      
                      {/* Statistics */}
                      {service.stats && (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          {service.stats.map((stat, idx) => (
                            <Card key={idx} className="p-4 bg-primary/5 border-primary/20">
                              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                              <div className="text-sm text-muted-foreground leading-tight">{stat.label}</div>
                              <div className="text-xs text-muted-foreground/70 mt-2 italic">Source: {stat.source}</div>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      <Link href="/book">
                        <Button className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20" data-testid={`button-book-${service.id}`}>
                          Réserver une consultation
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      {service.content.map((section, idx) => (
                        <Card key={idx} className="p-6">
                          <h3 className="font-bold text-lg mb-4 text-foreground">{section.heading}</h3>
                          {section.points ? (
                            <ul className="space-y-3">
                              {section.points.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary" data-testid="section-services-cta">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Prêt à passer à l'action ?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Réservez une consultation pour discuter de votre situation et créer votre plan de carrière personnalisé.
              </p>
              
              <div className="pt-4">
                <Link href="/book">
                  <Button size="lg" className="bg-accent text-primary font-bold px-10 h-14 text-lg shadow-xl" data-testid="button-services-cta">
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
