import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prompts from './prompts/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Main coaching endpoint
app.post('/api/coach', async (req, res) => {
  try {
    const { userInput, language = 'en' } = req.body;

    // Validation
    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ 
        error: 'User input is required',
        code: 'MISSING_INPUT'
      });
    }

    if (userInput.length > 500) {
      return res.status(400).json({ 
        error: 'Input too long (max 500 characters)',
        code: 'INPUT_TOO_LONG'
      });
    }

    // Get language-specific prompt
    const promptFunction = prompts[language];
    if (!promptFunction) {
      return res.status(400).json({ 
        error: `Unsupported language: ${language}`,
        code: 'UNSUPPORTED_LANGUAGE'
      });
    }

    const systemPrompt = promptFunction(userInput);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'Analyze this overthinking and provide the response.'
        }
      ]
    });

    // Extract and parse response
    const responseText = message.content[0].text;
    
    // Try to extract JSON from response (Claude sometimes adds text before/after)
    let result;
    try {
      // First try direct parse
      result = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON from markdown code blocks or surrounding text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Validate response structure
    const requiredFields = ['type', 'action', 'ignore', 'reframe'];
    const missingFields = requiredFields.filter(field => !result[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing fields in AI response: ${missingFields.join(', ')}`);
    }

    // Validate overthinking type
    const validTypes = ['fear', 'perfectionism', 'decision_overload', 'avoidance', 'rumination'];
    if (!validTypes.includes(result.type)) {
      result.type = 'rumination'; // Default fallback
    }

    // Return successful response
    res.json({
      success: true,
      data: {
        type: result.type,
        action: result.action,
        ignore: result.ignore,
        reframe: result.reframe
      },
      metadata: {
        language,
        timestamp: new Date().toISOString(),
        model: 'claude-sonnet-4-20250514'
      }
    });

  } catch (error) {
    console.error('Coach API error:', error);

    // Handle specific Anthropic API errors
    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed',
        code: 'AUTH_ERROR',
        message: 'Invalid or missing API key'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT',
        message: 'Too many requests. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred processing your request'
    });
  }
});

// PLACEHOLDER: Stripe checkout endpoint (future implementation)
app.post('/api/create-checkout', async (req, res) => {
  res.status(501).json({
    error: 'Payment integration not yet implemented',
    code: 'NOT_IMPLEMENTED',
    message: 'Stripe integration coming soon'
  });
  
  /* FUTURE IMPLEMENTATION:
  const { priceId, successUrl, cancelUrl } = req.body;
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  
  res.json({ sessionUrl: session.url });
  */
});

// PLACEHOLDER: Stripe webhook endpoint (future implementation)
app.post('/api/stripe-webhook', async (req, res) => {
  res.status(501).json({
    error: 'Webhook not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
  
  /* FUTURE IMPLEMENTATION:
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Update user subscription in database
      break;
    case 'customer.subscription.deleted':
      // Handle cancellation
      break;
  }
  
  res.json({ received: true });
  */
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Start server (only if not in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Overthinking Coach API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Claude API: ${process.env.ANTHROPIC_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
  });
}

// Export for Vercel serverless
export default app;
