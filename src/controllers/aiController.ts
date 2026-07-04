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

const buildPrompt = (destination: string) => `Create a concise travel recommendation for ${destination}.
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
            content: 'You are a practical travel advisor for a vacation booking app.',
          },
          {
            role: 'user',
            content: buildPrompt(destination),
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

    res.json({ destination, recommendation });
  } catch (err) {
    console.error('NVIDIA AI error:', err);
    res.status(500).json({ message: 'Failed to get AI recommendation' });
  }
};
