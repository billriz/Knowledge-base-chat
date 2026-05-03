export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }

  if (!apiKey.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY must start with "sk-"');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: text,
      model: process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message =
      error?.error?.message ?? response.statusText ?? 'Unknown OpenAI API error';
    throw new Error(`OpenAI embeddings API error: ${message}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}
