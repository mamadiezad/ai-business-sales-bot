/**
 * AI Business Sales Bot — Embeddable Chat Widget
 * 
 * Add this ONE line to any website:
 * <script src="https://your-server.com/embed.js"></script>
 */

(function() {
  'use strict';

  const script = document.currentScript;
  const botUrl = script?.getAttribute('data-bot-url') || 'http://localhost:3000';
  const primaryColor = script?.getAttribute('data-primary-color') || '#7c3aed';
  const businessName = script?.getAttribute('data-business-name') || 'فروشگاه';

  let sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  let isOpen = false;
  let isLoading = false;

  // Create container
  const container = document.createElement('div');
  container.className = 'salesbot-container';
  container.innerHTML = `
    <div class="salesbot-card" id="salesbotCard">
      <div class="salesbot-header">
        <h3>🤖 ${businessName}</h3>
        <p>دستیار هوشمند فروش</p>
        <div class="salesbot-online">
          <span class="dot"></span>
          آنلاین
        </div>
      </div>
      <div class="salesbot-messages" id="salesbotMessages">
        <div class="salesbot-msg bot">
          👋 سلام! به ${businessName} خوش آمدید. چطور میتونم کمکتون کنم؟
        </div>
      </div>
      <div class="salesbot-quick" id="salesbotQuick">
        <button onclick="SalesBot.send('محصولاتتون چیه؟')">📦 محصولات</button>
        <button onclick="SalesBot.send('قیمت وی‌پی‌ان چنده؟')">💰 قیمت‌ها</button>
        <button onclick="SalesBot.send('پشتیبانی دارید؟')">🛟 پشتیبانی</button>
        <button onclick="SalesBot.send('چطور خرید کنم؟')">🛒 خرید</button>
      </div>
      <div class="salesbot-input">
        <input type="text" id="salesbotInput" placeholder="پیام خود را بنویسید..." />
        <button id="salesbotSendBtn" onclick="SalesBot.send()">➤</button>
      </div>
    </div>
    <button class="salesbot-bubble" id="salesbotBubble" onclick="SalesBot.toggle()">
      <span class="pulse"></span>
      💬
    </button>
  `;

  document.body.appendChild(container);

  // Store reference and update CSS variables
  document.documentElement.style.setProperty('--primary', primaryColor);

  // Input handler
  const input = document.getElementById('salesbotInput');
  const sendBtn = document.getElementById('salesbotSendBtn');
  const messagesEl = document.getElementById('salesbotMessages');
  const card = document.getElementById('salesbotCard');
  const bubble = document.getElementById('salesbotBubble');

  input?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') SalesBot.send();
  });

  // API
  window.SalesBot = {
    toggle() {
      isOpen = !isOpen;
      card?.classList.toggle('open', isOpen);
      bubble!.style.display = isOpen ? 'none' : 'flex';
      if (isOpen) setTimeout(() => input?.focus(), 300);
    },

    async send(text) {
      const message = text || input?.value?.trim();
      if (!message || isLoading) return;

      // Clear input
      if (input) input.value = '';
      
      // Hide quick actions after first message
      const quick = document.getElementById('salesbotQuick');
      if (quick) quick.style.display = 'none';

      // Add user message
      this.addMessage(message, 'user');
      
      // Show typing indicator
      const typingId = this.showTyping();

      isLoading = true;
      if (sendBtn) sendBtn.disabled = true;

      try {
        const res = await fetch(botUrl + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, sessionId }),
        });

        const data = await res.json();
        
        // Remove typing
        this.removeTyping(typingId);
        
        // Add bot reply
        this.addMessage(data.reply, 'bot');
        sessionId = data.sessionId;
      } catch (err) {
        this.removeTyping(typingId);
        this.addMessage('⚠️ خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.', 'bot');
      }

      isLoading = false;
      if (sendBtn) sendBtn.disabled = false;
    },

    addMessage(text, type) {
      const div = document.createElement('div');
      div.className = 'salesbot-msg ' + type;
      div.textContent = text;
      messagesEl?.appendChild(div);
      messagesEl?.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
    },

    showTyping() {
      const id = 'typing_' + Date.now();
      const div = document.createElement('div');
      div.className = 'salesbot-msg bot';
      div.id = id;
      div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
      messagesEl?.appendChild(div);
      messagesEl?.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
      return id;
    },

    removeTyping(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    },
  };

  // Footer credit
  const footer = document.createElement('div');
  footer.style.cssText = 'text-align:center;padding:8px;font-size:10px;color:#6b7280;border-top:1px solid #313244;background:#0d1117';
  footer.innerHTML = 'Built with ❤️ by <a href="https://t.me/llllxyz" style="color:#7c3aed;text-decoration:none">Mohammad</a>';
  document.querySelector('.salesbot-card')?.appendChild(footer);

})();
