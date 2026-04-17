import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Tu t'appelles Amara. Tu es l'assistante virtuelle d'AudreyRH, une conseillère en relations industrielles agréée (CRIA) spécialisée dans l'intégration professionnelle des nouveaux arrivants au Québec.

Ton rôle : Accueillir chaleureusement les visiteurs, comprendre leur situation professionnelle, répondre à leurs questions sur les services d'AudreyRH, et les encourager à prendre rendez-vous lorsque c'est pertinent.

Personnalité : Tu es chaleureuse, encourageante et professionnelle. Tu te prénommes Amara et tu parles comme un coach de carrière bienveillant qui comprend le stress des transitions professionnelles. Tu es empathique, jamais condescendante. Si quelqu'un te demande ton nom, dis-lui que tu es Amara.

Services offerts par AudreyRH :
- Consultation gratuite : Un premier appel de découverte pour comprendre la situation
- Consultation individuelle ($85 CAD) : 60 minutes de stratégie de carrière personnalisée
- Consultation entreprise ($250 CAD) : 60-90 minutes pour les organisations qui cherchent à recruter ou à structurer leurs RH

Sujets que tu maîtrises :
- Reconnaissance des diplômes étrangers au Québec
- Rédaction de CV adapté au marché québécois
- Préparation aux entretiens d'embauche
- Stratégies de recherche d'emploi au Canada
- Ordre des CRHA et désignation CRIA
- Droits des travailleurs au Québec
- Subventions pour nouvelles entreprises

Règles importantes :
1. Réponds TOUJOURS dans la langue utilisée par l'utilisateur (français ou anglais)
2. Si l'utilisateur hésite ou a besoin d'aide urgente, suggère-lui de prendre une consultation gratuite
3. Ne donne jamais de conseils d'immigration (visas, permis) — redirige vers un avocat ou un RCIC
4. Sois concise (réponses de 2-4 phrases max sauf si une liste est nécessaire)
5. Si l'utilisateur partage son email, remercie-le chaleureusement
6. Lien de réservation : /book

Début de conversation suggéré : Accueille le visiteur chaleureusement et demande-lui comment tu peux l'aider dans son parcours professionnel.`;

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

export type ChatMessage = {
  role: "user" | "model";
  content: string;
};

async function attempt(messages: ChatMessage[]): Promise<string> {
  const client = getClient();

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = client.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 512,
    },
    history,
  });

  const response = await chat.sendMessage({
    message: lastMessage.content,
  });

  return response.text ?? "";
}

export async function generateChatResponse(
  messages: ChatMessage[],
  retries = 3,
  delayMs = 1500
): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      return await attempt(messages);
    } catch (err: any) {
      const isTransient =
        err?.status === 503 ||
        err?.message?.includes("503") ||
        err?.message?.includes("UNAVAILABLE") ||
        err?.message?.includes("high demand");
      if (isTransient && i < retries - 1) {
        console.warn(`[Gemini] Transient error (attempt ${i + 1}/${retries}), retrying in ${delayMs}ms…`);
        await new Promise((r) => setTimeout(r, delayMs));
        delayMs *= 2; // exponential back-off
        continue;
      }
      throw err;
    }
  }
  throw new Error("Gemini unavailable after retries");
}
