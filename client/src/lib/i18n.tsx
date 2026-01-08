import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.about": "À propos",
    "nav.book": "Réserver",
    "nav.admin": "Admin",
    
    "hero.badge": "Conseillère en Relations Industrielles Agréée",
    "hero.title1": "Une experte CRIA",
    "hero.rotating.1": "avec vous",
    "hero.rotating.2": "pour vous",
    "hero.rotating.3": "à vos côtés",
    "hero.description": "Réalisons ensemble votre potentiel de carrière au Québec. Audrey Mondesir, votre partenaire de confiance pour naviguer le marché de l'emploi.",
    "hero.cta": "Prendre rendez-vous",
    "hero.services": "Découvrir mes services",
    
    "question.title": "Où en êtes-vous dans votre parcours professionnel ?",
    "question.text": "Beaucoup d'immigrants croient qu'un diplôme est la seule voie vers le succès. La réalité ? Le marché québécois recherche souvent des métiers spécialisés bien plus que des diplômes avancés.",
    "question.cta": "Découvrir comment je peux vous aider",
    
    "services.badge": "Services",
    "services.title": "Comment puis-je vous accompagner",
    "services.description": "Des services personnalisés pour maximiser vos chances de réussite professionnelle au Québec.",
    
    "services.strategy.title": "Analyse stratégique du marché",
    "services.strategy.desc": "Découvrez les secteurs qui recrutent activement et évitez les erreurs coûteuses d'orientation.",
    "services.strategy.cta": "En savoir plus",
    
    "services.credentials.title": "Reconnaissance des acquis",
    "services.credentials.desc": "Faites valoir vos diplômes et expériences étrangères auprès des employeurs québécois.",
    "services.credentials.cta": "En savoir plus",
    
    "services.employability.title": "Développement de l'employabilité",
    "services.employability.desc": "CV optimisé, préparation aux entrevues et stratégies de recherche d'emploi efficaces.",
    "services.employability.cta": "Réserver",
    
    "services.integration.title": "Intégration au marché",
    "services.integration.desc": "Comprenez les codes du marché québécois et positionnez-vous efficacement auprès des employeurs.",
    "services.integration.cta": "En savoir plus",
    
    "about.badge": "À propos",
    "about.title": "Mon engagement envers vous",
    "about.text1": "En tant que CRIA (Conseillère en relations industrielles agréée), je comprends les nuances du marché de l'emploi. Mon expérience dans les secteurs de la construction et de la fabrication me donne un aperçu unique pour vous guider efficacement.",
    "about.text2": "Avec 16 ans d'expérience, je sais ce que les employeurs recherchent. Je suis ici pour briser le mythe que le « prestige » est le seul chemin vers le succès.",
    "about.point1": "16 années d'expertise en relations industrielles",
    "about.point2": "Connaissance approfondie du marché québécois",
    "about.point3": "Accompagnement personnalisé et stratégique",
    
    "testimonials.badge": "Témoignages",
    "testimonials.title": "Ce que disent mes clients",
    
    "testimonial.1.text": "Avec 10 ans d'expérience bancaire en Côte d'Ivoire, je ne savais pas comment me positionner ici. Audrey m'a guidé vers les bonnes certifications et réseaux. Je suis maintenant directeur de succursale.",
    "testimonial.1.name": "Youssouf Keita",
    "testimonial.1.job": "Directeur de banque",
    
    "testimonial.2.text": "Audrey m'a convaincu de ne pas retourner aux études. Elle m'a montré comment faire reconnaître mon expérience de soudeur au Cameroun. En 4 mois, j'avais ma carte de compétence et un emploi stable.",
    "testimonial.2.name": "Jean-Baptiste Nkomo",
    "testimonial.2.job": "Soudeur",
    
    "testimonial.3.text": "Diplômée en finance au Sénégal, je doutais de mes chances. Audrey m'a aidée à cibler les bonnes entreprises et à adapter mon CV. Je suis maintenant analyste financière dans une grande firme.",
    "testimonial.3.name": "Aïssatou Sarr",
    "testimonial.3.job": "Analyste financière",
    
    "testimonial.4.text": "Je travaillais comme caissière depuis 2 ans sans voir d'issue. Audrey m'a aidée à valoriser mon expérience en service client et j'ai décroché un poste de réceptionniste dans une clinique.",
    "testimonial.4.name": "Fatou Diallo",
    "testimonial.4.job": "Réceptionniste",
    
    "testimonial.5.text": "Arrivé du Sénégal avec un diplôme en électricité, je ne savais pas comment m'y prendre. Audrey m'a guidé étape par étape. Maintenant je travaille comme électricien avec un bon salaire.",
    "testimonial.5.name": "Moussa Sow",
    "testimonial.5.job": "Électricien",
    
    "testimonial.6.text": "Je pensais devoir tout recommencer à zéro. Audrey m'a montré que mon expérience de chauffeur au Maroc pouvait être valorisée. J'ai obtenu mon permis classe 1 et je travaille comme camionneur.",
    "testimonial.6.name": "Karim Benali",
    "testimonial.6.job": "Camionneur",
    
    "quote.text": "Je vous aiderai à vous concentrer sur la reconnaissance de vos compétences pour que vous puissiez devenir contremaître et commencer à gagner plus tôt.",
    "quote.author": "— Audrey Mondesir, CRIA",
    
    "cta.title": "Prêt à définir votre stratégie ?",
    "cta.text": "Arrêtez de deviner et commencez à planifier. Réservez une consultation individuelle pour analyser votre profil et créer votre feuille de route.",
    "cta.button": "Réserver une consultation - 50$ USD",
    "cta.secure": "Paiement sécurisé via Stripe",
    
    "footer.tagline": "Votre partenaire de confiance pour réussir votre carrière au Québec.",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits réservés.",
    
    "book.title": "Réserver une consultation",
    "book.subtitle": "Choisissez un créneau disponible pour votre consultation personnalisée.",
    "book.price": "50$ USD",
    "book.duration": "Consultation de 60 minutes",
    "book.noSlots": "Aucun créneau disponible pour le moment",
    "book.checkBack": "Veuillez revenir plus tard pour voir les nouvelles disponibilités.",
    "book.selectSlot": "Sélectionner ce créneau",
    "book.yourInfo": "Vos informations",
    "book.firstName": "Prénom",
    "book.lastName": "Nom",
    "book.email": "Courriel",
    "book.phone": "Téléphone",
    "book.platform": "Plateforme de rencontre",
    "book.platformPlaceholder": "Choisir une plateforme",
    "book.zoom": "Zoom",
    "book.googleMeet": "Google Meet",
    "book.pay": "Payer 50$ USD",
    "book.processing": "Traitement en cours...",
    "book.secure": "Paiement sécurisé via Stripe",
    
    "admin.title": "Gestion des disponibilités",
    "admin.addSlot": "Ajouter une disponibilité",
    "admin.date": "Date",
    "admin.startTime": "Heure de début",
    "admin.endTime": "Heure de fin",
    "admin.add": "Ajouter",
    "admin.adding": "Ajout...",
    "admin.currentSlots": "Créneaux actuels",
    "admin.noSlots": "Aucun créneau disponible",
    "admin.available": "Disponible",
    "admin.booked": "Réservé",
    "admin.delete": "Supprimer",
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.book": "Book",
    "nav.admin": "Admin",
    
    "hero.badge": "Certified Industrial Relations Advisor",
    "hero.title1": "A CRIA expert",
    "hero.rotating.1": "with you",
    "hero.rotating.2": "for you",
    "hero.rotating.3": "by your side",
    "hero.description": "Let's achieve your career potential in Quebec together. Audrey Mondesir, your trusted partner to navigate the job market.",
    "hero.cta": "Book an appointment",
    "hero.services": "Discover my services",
    
    "question.title": "Where are you in your professional journey?",
    "question.text": "Many immigrants believe that a degree is the only path to success. The reality? The Quebec market often seeks specialized trades much more than advanced degrees.",
    "question.cta": "Discover how I can help you",
    
    "services.badge": "Services",
    "services.title": "How I can support you",
    "services.description": "Personalized services to maximize your chances of professional success in Quebec.",
    
    "services.strategy.title": "Strategic market analysis",
    "services.strategy.desc": "Discover sectors that are actively hiring and avoid costly career mistakes.",
    "services.strategy.cta": "Learn more",
    
    "services.credentials.title": "Credential recognition",
    "services.credentials.desc": "Leverage your foreign diplomas and experience with Quebec employers.",
    "services.credentials.cta": "Learn more",
    
    "services.employability.title": "Employability development",
    "services.employability.desc": "Optimized resume, interview preparation, and effective job search strategies.",
    "services.employability.cta": "Book",
    
    "services.integration.title": "Market integration",
    "services.integration.desc": "Understand Quebec market codes and position yourself effectively with employers.",
    "services.integration.cta": "Learn more",
    
    "about.badge": "About",
    "about.title": "My commitment to you",
    "about.text1": "As a CRIA (Certified Industrial Relations Advisor), I understand the nuances of the job market. My experience in the construction and manufacturing sectors gives me unique insights to guide you effectively.",
    "about.text2": "With 16 years of experience, I know what employers are looking for. I'm here to break the myth that \"prestige\" is the only path to success.",
    "about.point1": "16 years of expertise in industrial relations",
    "about.point2": "In-depth knowledge of the Quebec market",
    "about.point3": "Personalized and strategic support",
    
    "testimonials.badge": "Testimonials",
    "testimonials.title": "What my clients say",
    
    "testimonial.1.text": "With 10 years of banking experience in Ivory Coast, I didn't know how to position myself here. Audrey guided me to the right certifications and networks. I'm now a branch director.",
    "testimonial.1.name": "Youssouf Keita",
    "testimonial.1.job": "Bank Director",
    
    "testimonial.2.text": "Audrey convinced me not to go back to school. She showed me how to get my welding experience from Cameroon recognized. In 4 months, I had my competency card and a stable job.",
    "testimonial.2.name": "Jean-Baptiste Nkomo",
    "testimonial.2.job": "Welder",
    
    "testimonial.3.text": "With a finance degree from Senegal, I doubted my chances. Audrey helped me target the right companies and adapt my resume. I'm now a financial analyst at a major firm.",
    "testimonial.3.name": "Aïssatou Sarr",
    "testimonial.3.job": "Financial Analyst",
    
    "testimonial.4.text": "I had been working as a cashier for 2 years with no way out. Audrey helped me leverage my customer service experience and I landed a receptionist position at a clinic.",
    "testimonial.4.name": "Fatou Diallo",
    "testimonial.4.job": "Receptionist",
    
    "testimonial.5.text": "Coming from Senegal with an electrical diploma, I didn't know where to start. Audrey guided me step by step. Now I work as an electrician with a good salary.",
    "testimonial.5.name": "Moussa Sow",
    "testimonial.5.job": "Electrician",
    
    "testimonial.6.text": "I thought I had to start from scratch. Audrey showed me that my driving experience in Morocco could be valued. I got my class 1 license and now work as a truck driver.",
    "testimonial.6.name": "Karim Benali",
    "testimonial.6.job": "Truck Driver",
    
    "quote.text": "I will help you focus on getting your skills recognized so you can become a foreman and start earning sooner.",
    "quote.author": "— Audrey Mondesir, CRIA",
    
    "cta.title": "Ready to define your strategy?",
    "cta.text": "Stop guessing and start planning. Book a one-on-one consultation to analyze your profile and create your roadmap.",
    "cta.button": "Book a consultation - $50 USD",
    "cta.secure": "Secure payment via Stripe",
    
    "footer.tagline": "Your trusted partner for career success in Quebec.",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    
    "book.title": "Book a consultation",
    "book.subtitle": "Choose an available slot for your personalized consultation.",
    "book.price": "$50 USD",
    "book.duration": "60-minute consultation",
    "book.noSlots": "No slots available at the moment",
    "book.checkBack": "Please check back later for new availability.",
    "book.selectSlot": "Select this slot",
    "book.yourInfo": "Your information",
    "book.firstName": "First name",
    "book.lastName": "Last name",
    "book.email": "Email",
    "book.phone": "Phone",
    "book.platform": "Meeting platform",
    "book.platformPlaceholder": "Choose a platform",
    "book.zoom": "Zoom",
    "book.googleMeet": "Google Meet",
    "book.pay": "Pay $50 USD",
    "book.processing": "Processing...",
    "book.secure": "Secure payment via Stripe",
    
    "admin.title": "Availability Management",
    "admin.addSlot": "Add availability",
    "admin.date": "Date",
    "admin.startTime": "Start time",
    "admin.endTime": "End time",
    "admin.add": "Add",
    "admin.adding": "Adding...",
    "admin.currentSlots": "Current slots",
    "admin.noSlots": "No slots available",
    "admin.available": "Available",
    "admin.booked": "Booked",
    "admin.delete": "Delete",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      return (saved as Language) || "fr";
    }
    return "fr";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
