/**
 * OpenAI Integration — AI Sales Assistant
 */

import OpenAI from 'openai';
import { config } from './config';
import { BusinessInfo, Product, FAQ } from './knowledge';

const openai = new OpenAI({ apiKey: config.openai.apiKey });

export class SalesAI {
  private businessInfo: BusinessInfo;
  private products: Product[];
  private faqs: FAQ[];
  private conversationHistory: { role: 'user' | 'assistant' | 'system'; content: string }[] = [];

  constructor(businessInfo: BusinessInfo, products: Product[], faqs: FAQ[]) {
    this.businessInfo = businessInfo;
    this.products = products;
    this.faqs = faqs;
  }

  /**
   * Build the system prompt with business knowledge
   */
  private buildSystemPrompt(): string {
    const productList = this.products
      .map((p, i) => `${i + 1}. ${p.nameFa} (${p.name}) — ${p.price}\n   ${p.description}\n   ویژگی‌ها: ${p.features.join('، ')}`)
      .join('\n\n');

    const faqList = this.faqs
      .map((f) => `سوال: ${f.question}\nپاسخ: ${f.answer}`)
      .join('\n\n');

    return `شما یک دستیار فروش حرفه‌ای و دوستانه برای ${this.businessInfo.nameFa} هستید.

📋 اطلاعات کسب و کار:
نام: ${this.businessInfo.nameFa} (${this.businessInfo.name})
توضیحات: ${this.businessInfo.description}
ساعت کاری: ${this.businessInfo.workingHours}
پشتیبانی: ${this.businessInfo.supportContact}

📦 محصولات موجود:
${productList}

❓ سوالات متداول:
${faqList}

🔴 قوانین مهم:
1. همیشه به صورت حرفه‌ای و دوستانه پاسخ بده
2. اگر کاربر قصد خرید دارد، محصول را معرفی کن و راهنمایی کن
3. اگر سوالی خارج از دانش تو بود، بگو "برای اطلاعات بیشتر به پشتیبانی @llllxyz پیام بدید"
4. قیمت‌ها را دقیق بگو
5. در پایان هر مکالمه بپرس "آیا می‌تونم کمک دیگری بکنم؟"
6. فارسی صحبت کن مگر اینکه کاربر انگلیسی بپرسد
7. اگر کاربر درباره محصول خاصی پرسید، پیشنهاد مشابه بده
8. همیشه مفید و مختصر پاسخ بده`;
  }

  /**
   * Send a message and get AI response
   */
  async chat(message: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({ role: 'user', content: message });

      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: this.buildSystemPrompt() },
        ...this.conversationHistory.slice(-20), // Last 20 messages for context
      ];

      const response = await openai.chat.completions.create({
        model: config.openai.model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = response.choices[0]?.message?.content || 'متاسفانه مشکلی پیش آمده. لطفاً دوباره تلاش کنید.';

      // Add assistant reply to history
      this.conversationHistory.push({ role: 'assistant', content: reply });

      return reply;
    } catch (error: any) {
      console.error('❌ OpenAI API Error:', error.message);

      // Fallback: FAQ-based answer if AI fails
      if (error.message?.includes('401') || error.message?.includes('API key')) {
        return this.fallbackReply(message);
      }

      return '⚠️ سرویس موقتاً در دسترس نیست. لطفاً بعداً تلاش کنید یا به پشتیبانی @llllxyz پیام بدید.';
    }
  }

  /**
   * Fallback reply using FAQ matching when AI is unavailable
   */
  private fallbackReply(message: string): string {
    const msg = message.toLowerCase();

    // Check FAQ matches
    for (const faq of this.faqs) {
      const keywords = faq.question.replace(/[؟?]/g, '').split(' ');
      const matchCount = keywords.filter(k => msg.includes(k)).length;
      if (matchCount >= 2) {
        return faq.answer + '\n\nآیا می‌تونم کمک دیگری بکنم؟ 🤗';
      }
    }

    // Check product matches
    for (const product of this.products) {
      if (msg.includes(product.nameFa) || msg.includes(product.name.toLowerCase())) {
        return `✅ ${product.nameFa}\n💰 قیمت: ${product.price}\n📝 ${product.description}\n✨ ویژگی‌ها: ${product.features.join('، ')}\n\nبرای خرید یا اطلاعات بیشتر به پشتیبانی پیام بدید.`;
      }
    }

    // Generic reply with products
    const productList = this.products.map(p => `• ${p.nameFa} — ${p.price}`).join('\n');
    return `به فروشگاه ${this.businessInfo.nameFa} خوش آمدید! 🤗\n\n📦 محصولات ما:\n${productList}\n\nاگر سوالی دارید بپرسید، خوشحال میشم راهنماییتون کنم! 😊`;
  }

  /**
   * Reset conversation
   */
  resetConversation() {
    this.conversationHistory = [];
  }
}
