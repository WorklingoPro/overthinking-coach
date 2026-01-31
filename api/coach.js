javascriptconst Anthropic = require('@anthropic-ai/sdk');

const prompts = {
  en: { system: "You are a direct, action-focused coach. When someone shares overthinking, respond ONLY with valid JSON in this exact format:\n{\n  \"type\": \"fear|perfectionism|decision_overload|avoidance|rumination\",\n  \"action\": \"One concrete action to take RIGHT NOW (10-30 words)\",\n  \"ignore\": \"One thought pattern to actively dismiss (10-20 words)\",\n  \"reframe\": \"A grounding perspective shift (10-25 words)\"\n}\n\nRules:\n- No preamble, no explanation, ONLY the JSON object\n- Action must be immediate and specific\n- Use second person (\"you\")\n- Be direct and clear" }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text, language = 'en' } = req.body;
    if (!text || text.trim().length < 5) {
      return res.status(400).json({ error: 'Please enter at least 5 characters' });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: prompts[language]?.system || prompts.en.system,
      messages: [{ role: 'user', content: text }]
    });

    const parsed = JSON.parse(message.content[0].text);
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};
