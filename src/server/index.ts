/**
 * AI Business Sales Bot — Server
 * ربات فروشنده هوشمند با قابلیت نصب روی هر سایتی
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import chalk from 'chalk';
import { config } from './config';
import { SalesAI } from './ai';
import { defaultBusinessInfo, defaultProducts, defaultFAQs } from './knowledge';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'widget')));

// Store active chat sessions
const chatSessions = new Map<string, SalesAI>();

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', business: config.business.name, version: '2.0.0' });
});

// ===== CHAT API =====
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Get or create chat session
    if (!chatSessions.has(sid)) {
      chatSessions.set(sid, new SalesAI(defaultBusinessInfo, defaultProducts, defaultFAQs));
    }

    const ai = chatSessions.get(sid)!;

    // Get AI response
    const reply = await ai.chat(message);

    res.json({ reply, sessionId: sid });
  } catch (error: any) {
    console.error(chalk.red('❌ Chat error:'), error.message);
    res.status(500).json({ error: 'Internal server error', reply: 'متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.' });
  }
});

// Reset conversation
app.post('/api/chat/reset', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && chatSessions.has(sessionId)) {
    chatSessions.get(sessionId)!.resetConversation();
    chatSessions.delete(sessionId);
  }
  res.json({ status: 'reset' });
});

// ===== BUSINESS INFO API =====
app.get('/api/business', (_, res) => {
  res.json({
    name: config.business.name,
    description: config.business.description,
    primaryColor: config.business.primaryColor,
    secondaryColor: config.business.secondaryColor,
    logoUrl: config.business.logoUrl,
  });
});

// ===== PRODUCTS API =====
app.get('/api/products', (_, res) => {
  res.json(defaultProducts);
});

// ===== EMBEDDABLE WIDGET =====
app.get('/widget.js', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'widget', 'chat-widget.js'));
});

app.get('/widget.css', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'widget', 'chat-widget.css'));
});

// ===== EMBED SCRIPT (one line to add to any website) =====
app.get('/embed.js', (_, res) => {
  const baseUrl = config.server.baseUrl;
  res.set('Content-Type', 'application/javascript');
  res.send(`
(function() {
  var s = document.createElement('script');
  s.src = '${baseUrl}/widget.js';
  s.setAttribute('data-bot-url', '${baseUrl}');
  s.setAttribute('data-primary-color', '${config.business.primaryColor}');
  s.setAttribute('data-business-name', '${config.business.name}');
  s.async = true;
  document.head.appendChild(s);
  var c = document.createElement('link');
  c.rel = 'stylesheet';
  c.href = '${baseUrl}/widget.css';
  document.head.appendChild(c);
})();
`);
});

// ===== ADMIN PANEL =====
app.get('/admin', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

// Update business info (simple admin)
app.post('/api/admin/update', express.json(), (req, res) => {
  const { username, password, ...updates } = req.body;
  if (username !== config.admin.username || password !== config.admin.password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // In production, save to database
  res.json({ status: 'updated', updates });
});

// ===== START =====
app.listen(config.server.port, () => {
  console.log(chalk.green('╔═══════════════════════════════════════════╗'));
  console.log(chalk.green('║     🤖 AI Business Sales Bot v2.0       ║'));
  console.log(chalk.green('╚═══════════════════════════════════════════╝'));
  console.log(chalk.cyan(`\n📦 ${config.business.name}`));
  console.log(chalk.white(`🌐 Server: http://localhost:${config.server.port}`));
  console.log(chalk.white(`💬 Chat API: http://localhost:${config.server.port}/api/chat`));
  console.log(chalk.white(`🔌 Embed: <script src="${config.server.baseUrl}/embed.js"></script>`));
  console.log(chalk.white(`📊 Admin: http://localhost:${config.server.port}/admin`));
  console.log(chalk.yellow('\n⚠️  API Key:'), config.openai.apiKey ? '✅ Set' : '❌ NOT SET');
  if (!config.openai.apiKey) {
    console.log(chalk.red('   Add OPENAI_API_KEY to .env file'));
  }
  console.log();
});
