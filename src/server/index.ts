/**
 * AI Business Sales Bot — Server Entry Point
 * Supports both Website Widget + Telegram Bot
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import chalk from 'chalk';
import { config } from './config';
import { SalesAI } from '../server/ai';
import { defaultBusinessInfo, defaultProducts, defaultFAQs } from '../server/knowledge';
import { startTelegramBot } from '../telegram/bot';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'widget')));

const chatSessions = new Map<string, SalesAI>();

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', business: config.business.name, version: '2.0.0', telegram: !!process.env.TELEGRAM_BOT_TOKEN });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    if (!chatSessions.has(sid)) chatSessions.set(sid, new SalesAI(defaultBusinessInfo, defaultProducts, defaultFAQs));
    const ai = chatSessions.get(sid)!;
    const reply = await ai.chat(message);
    res.json({ reply, sessionId: sid });
  } catch (error: any) {
    res.status(500).json({ error: error.message, reply: 'خطایی رخ داد.' });
  }
});

app.get('/api/business', (_, res) => {
  res.json({ name: config.business.name, description: config.business.description, primaryColor: config.business.primaryColor });
});

app.get('/api/products', (_, res) => res.json(defaultProducts));
app.get('/widget.js', (_, res) => res.sendFile(path.join(__dirname, '..', 'widget', 'chat-widget.js')));
app.get('/widget.css', (_, res) => res.sendFile(path.join(__dirname, '..', 'widget', 'chat-widget.css')));

app.get('/embed.js', (_, res) => {
  const baseUrl = config.server.baseUrl;
  res.set('Content-Type', 'application/javascript');
  res.send(`(function(){var s=document.createElement('script');s.src='${baseUrl}/widget.js';s.setAttribute('data-bot-url','${baseUrl}');s.setAttribute('data-primary-color','${config.business.primaryColor}');s.setAttribute('data-business-name','${config.business.name}');s.async=true;document.head.appendChild(s);var c=document.createElement('link');c.rel='stylesheet';c.href='${baseUrl}/widget.css';document.head.appendChild(c);})();`);
});

app.get('/admin', (_, res) => res.sendFile(path.join(__dirname, '..', 'admin', 'index.html')));

app.listen(config.server.port, () => {
  console.log(chalk.green('╔══════════════════════════════════════╗'));
  console.log(chalk.green('║  AI Business Sales Bot v2.0         ║'));
  console.log(chalk.green('╚══════════════════════════════════════╝'));
  console.log(chalk.cyan(`\n📦 ${config.business.name}`));
  console.log(chalk.white(`🌐 Web: http://localhost:${config.server.port}`));
  console.log(chalk.white(`🔌 Embed: <script src="${config.server.baseUrl}/embed.js">`));
  console.log(chalk.yellow('📱 Telegram:'), process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌');
  console.log(chalk.yellow('🧠 OpenAI:'), config.openai.apiKey ? '✅' : '❌');
});

startTelegramBot();
