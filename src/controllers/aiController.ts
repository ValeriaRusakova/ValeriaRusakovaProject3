import type { Request, Response } from 'express';

interface NvidiaChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL ?? 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL ?? 'meta/llama-3.1-8b-instruct';

const AMBIGUOUS_INPUTS = new Set([
  'yes', 'no', 'ok', 'okay', 'hello', 'hi', 'test', 'maybe', 'thanks', 'thank you',
  'כן', 'לא', 'היי', 'שלום', 'בדיקה', 'תודה',
  'да', 'нет', 'привет', 'спасибо',
]);

const KNOWN_DESTINATIONS = [
  { name: 'Paris', aliases: ['paris', 'pari', 'פריז', 'париж'] },
  { name: 'Tokyo', aliases: ['tokyo', 'tokio', 'טוקיו', 'токио'] },
  { name: 'Tel Aviv', aliases: ['tel aviv', 'telaviv', 'tel-aviv', 'תל אביב', 'тель авив'] },
  { name: 'London', aliases: ['london', 'londn', 'לונדון', 'лондон'] },
  { name: 'Rome', aliases: ['rome', 'roma', 'רומא', 'рим'] },
  { name: 'Barcelona', aliases: ['barcelona', 'ברצלונה', 'барселона'] },
  { name: 'Amsterdam', aliases: ['amsterdam', 'אמסטרדם', 'амстердам'] },
  { name: 'Bangkok', aliases: ['bangkok', 'בנגקוק', 'бангкок'] },
  { name: 'Dubai', aliases: ['dubai', 'דובאי', 'дубай'] },
  { name: 'Athens', aliases: ['athens', 'אתונה', 'афины'] },
  { name: 'Prague', aliases: ['prague', 'praha', 'פראג', 'прага'] },
  { name: 'New York', aliases: ['new york', 'newyork', 'nyc', 'ניו יורק', 'нью йорк'] },
  { name: 'Iceland', aliases: ['iceland', 'איסלנד', 'исландия'] },
  { name: 'Norway', aliases: ['norway', 'נורבגיה', 'норвегия'] },
  { name: 'Israel', aliases: ['israel', 'ישראל', 'израиль'] },
  { name: 'France', aliases: ['france', 'צרפת', 'франция'] },
  { name: 'Italy', aliases: ['italy', 'איטליה', 'италия'] },
  { name: 'Spain', aliases: ['spain', 'ספרד', 'испания'] },
  { name: 'Greece', aliases: ['greece', 'יוון', 'греция'] },
  { name: 'Thailand', aliases: ['thailand', 'תאילנד', 'таиланд'] },
  { name: 'Japan', aliases: ['japan', 'יפן', 'япония'] },
];

const normalizeForMatch = (input: string): string =>
  input.trim().toLowerCase().replace(/[\u200e\u200f]/g, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');

const isClearlyNotDestination = (input: string): boolean => {
  const normalized = normalizeForMatch(input).replace(/[.!?]+$/g, '');
  return normalized.length < 3 || AMBIGUOUS_INPUTS.has(normalized);
};

const levenshtein = (left: string, right: string): number => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 0; leftIndex < left.length; leftIndex++) {
    let diagonal = previous[0] ?? 0;
    previous[0] = leftIndex + 1;

    for (let rightIndex = 0; rightIndex < right.length; rightIndex++) {
      const temp = previous[rightIndex + 1] ?? 0;
      const cost = left[leftIndex] === right[rightIndex] ? 0 : 1;
      previous[rightIndex + 1] = Math.min(
        (previous[rightIndex + 1] ?? 0) + 1,
        (previous[rightIndex] ?? 0) + 1,
        diagonal + cost,
      );
      diagonal = temp;
    }
  }

  return previous[right.length] ?? 0;
};

const resolveKnownDestination = (input: string): string | null => {
  const normalized = normalizeForMatch(input);

  for (const destination of KNOWN_DESTINATIONS) {
    for (const alias of destination.aliases) {
      if (normalized === normalizeForMatch(alias)) return destination.name;
    }
  }

  for (const destination of KNOWN_DESTINATIONS) {
    for (const alias of destination.aliases) {
      const normalizedAlias = normalizeForMatch(alias);
      if (normalizedAlias.length >= 4 && normalized.includes(normalizedAlias)) return destination.name;
    }
  }

  if (!/^[a-z\s-]+$/i.test(normalized)) return null;

  for (const destination of KNOWN_DESTINATIONS) {
    for (const alias of destination.aliases) {
      const normalizedAlias = normalizeForMatch(alias);
      if (!/^[a-z\s-]+$/i.test(normalizedAlias)) continue;

      const distance = levenshtein(normalized.replace(/\s/g, ''), normalizedAlias.replace(/\s/g, ''));
      const maxDistance = normalizedAlias.length <= 5 ? 1 : 2;
      if (distance <= maxDistance) return destination.name;
    }
  }

  return null;
};

const buildPrompt = (destination: string) => `The user entered this destination: "${destination}".

If this is not a real city, town, country, region, island, or well-known travel destination, return exactly: INVALID_DESTINATION

If it is a real travel destination, create a concise travel recommendation for it.
Include:
1. Best things to do
2. Food or local experience
3. Suggested trip length
4. One practical tip
Keep it friendly, useful, and under 180 words.`;

export const getRecommendation = async (req: Request, res: Response): Promise<void> => {
  const destination = String(req.body?.destination ?? '').trim();

  if (!destination) {
    res.status(400).json({ message: 'Destination is required' });
    return;
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    res.status(500).json({ message: 'NVIDIA_API_KEY is not configured on the backend' });
    return;
  }

  try {
    if (isClearlyNotDestination(destination)) {
      res.status(400).json({ message: 'Please enter a real city or country.' });
      return;
    }

    const destinationForRecommendation = resolveKnownDestination(destination) ?? destination;

    const response = await fetch(`${NVIDIA_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a practical travel advisor for a vacation booking app. Do not invent destinations. If the input is not a real destination, return exactly INVALID_DESTINATION.',
          },
          {
            role: 'user',
            content: buildPrompt(destinationForRecommendation),
          },
        ],
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    const data = await response.json().catch(() => ({})) as NvidiaChatResponse;

    if (!response.ok) {
      res.status(response.status).json({ message: data.error?.message ?? 'NVIDIA AI request failed' });
      return;
    }

    const recommendation = data.choices?.[0]?.message?.content?.trim();
    if (!recommendation) {
      res.status(502).json({ message: 'NVIDIA returned an empty AI response' });
      return;
    }

    if (/^INVALID_DESTINATION\b/i.test(recommendation)) {
      res.status(400).json({ message: 'Please enter a real city or country.' });
      return;
    }

    res.json({ destination: destinationForRecommendation, recommendation });
  } catch (err) {
    console.error('NVIDIA AI error:', err);
    res.status(500).json({ message: 'Failed to get AI recommendation' });
  }
};
