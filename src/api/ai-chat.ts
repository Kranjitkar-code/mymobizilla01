import type { ViteDevServer } from 'vite';

// This is a mock serverless endpoint for local dev. Replace with your prod serverless function if needed.
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages payload:', messages);
      return new Response(JSON.stringify({ error: 'Invalid messages' }), { status: 400 });
    }
    const last = messages[messages.length - 1]?.content || '';
    let reply = 'Sorry, assistant is not configured.';
    try {
      const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://mobizilla.com',
          'X-Title': 'Mobizilla',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for the Mobizilla website. Only answer questions related to Mobizilla, its services, products, and support. If asked about other topics, politely redirect to Mobizilla-related help.'
            },
            ...messages
          ],
        }),
      });
      if (!openrouterRes.ok) {
        const errorText = await openrouterRes.text();
        console.error('OpenRouter API error:', openrouterRes.status, errorText);
        reply = `API error: ${openrouterRes.status}`;
      } else {
        const data = await openrouterRes.json();
        reply = data.choices?.[0]?.message?.content || reply;
      }
    } catch (err) {
      console.error('Network or fetch error:', err);
      reply = `Network error: ${err?.message || err}`;
    }
    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (e) {
    console.error('Server error:', e);
    return new Response(JSON.stringify({ error: 'Server error', details: e?.message || e }), { status: 500 });
  }
}
