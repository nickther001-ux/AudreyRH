export const botRules: { pattern: RegExp; response: string }[] = [
  {
    pattern: /\b(price|cost|combien|prix|tarif|combien ça coûte)\b/i,
    response: "Parce que chaque mandat est unique, nous n'avons pas de tarif fixe. Audrey offre une consultation gratuite de 15 min pour évaluer vos besoins et vous donner un devis exact : [audreyrh.com/book](https://audreyrh.com/book)",
  },
  {
    pattern: /\b(meeting|rendez-vous|book|calendrier|disponibilité|rdv)\b/i,
    response: "Je peux vous aider avec ça ! Voici le calendrier en direct d'Audrey pour choisir le moment qui vous convient : [audreyrh.com/book](https://audreyrh.com/book)",
  },
  {
    pattern: /\b(location|où|adresse|bureau|montreal|montréal)\b/i,
    response: "Nous sommes fiers d'être basés à Montréal ! Cependant, pour faciliter les choses, toutes les consultations initiales se font virtuellement (Google Meet / Zoom).",
  },
  {
    pattern: /\b(contact|email|téléphone|parler|appeler)\b/i,
    response: "Le moyen le plus rapide de parler directement à Audrey est de réserver 15 minutes sur son calendrier ici : [audreyrh.com/book](https://audreyrh.com/book)",
  },
  {
    pattern: /\b(visa|immigration|résidence|pr|citoyenneté)\b/i,
    response: "Audrey se spécialise dans l'employabilité et le marché du travail pour les nouveaux arrivants, mais nous ne traitons pas les visas d'immigration. Discutons de votre carrière : [audreyrh.com/book](https://audreyrh.com/book)",
  },
  {
    pattern: /\b(entreprise|startup|incorporation|business|compagnie|pme)\b/i,
    response: "Excellent. Audrey aide les entreprises à optimiser leurs RH et à obtenir du financement. Cherchez-vous de l'aide pour les **Subventions** ou les **Ressources Humaines** ?",
  },
  {
    pattern: /\b(individu|emploi|job|cv|immigrant|carrière|entrevue)\b/i,
    response: "Audrey se spécialise dans la stratégie d'employabilité au Québec. La façon la plus rapide de commencer est une consultation pour évaluer votre situation : [audreyrh.com/book](https://audreyrh.com/book)",
  },
  {
    pattern: /\b(subvention|funding|financement|bourse|argent)\b/i,
    response: "Des millions en subventions québécoises ne sont pas réclamés chaque année. Je peux planifier un audit gratuit de 15 min avec Audrey pour voir ce que vous pouvez réclamer : [audreyrh.com/book](https://audreyrh.com/book)",
  },
  {
    pattern: /\b(contrat|employé|rh|embauche|ressources humaines|manuel)\b/i,
    response: "Nous gérons tout, des contrats d'embauche à la conformité. Chaque équipe étant différente, faisons un appel de découverte rapide pour cibler vos besoins : [audreyrh.com/book](https://audreyrh.com/book)",
  },
  {
    pattern: /\b(hello|bonjour|hi|aide|start|salut|hey)\b/i,
    response: "Bonjour ! Je suis Amara, l'assistante virtuelle d'Audrey. Pour bien vous diriger, cherchez-vous de l'aide pour une **Entreprise** (RH, Subventions) ou en tant qu'**Individu** (Carrière) ?",
  },
];

export const fallbackResponse =
  "Je veux m'assurer que vous obtenez la meilleure réponse. Le plus simple est d'en discuter directement avec Audrey lors d'un appel gratuit de 15 minutes : [audreyrh.com/book](https://audreyrh.com/book)";

export function processChatInput(userInput: string): string {
  for (const rule of botRules) {
    if (rule.pattern.test(userInput)) return rule.response;
  }
  return fallbackResponse;
}
