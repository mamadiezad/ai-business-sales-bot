/**
 * 🤖 AI Sales Bot for Telegram
 * ربات فروشنده هوشمند برای فروشگاه‌های تلگرام
 * 
 * Business owners can add this bot to their Telegram,
 * customers chat with AI and buy products directly.
 */

import { Context, Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from '../server/config';
import { SalesAI } from '../server/ai';
import { defaultBusinessInfo, defaultProducts, defaultFAQs, Product } from '../server/knowledge';
import { PaymentManager } from '../payment/zarinpal';
import chalk from 'chalk';

// ===== Types =====
interface SessionData {
  ai?: SalesAI;
  cart: { productId: string; quantity: number }[];
  expectingInput: 'none' | 'address' | 'phone' | 'name';
}

interface BotContext extends Context {
  session: SessionData;
}

// ===== Bot Setup =====
const token = process.env.TELEGRAM_BOT_TOKEN || '';
export const bot = new Telegraf<BotContext>(token);

// Session middleware
bot.use(session({ defaultSession: () => ({ cart: [], expectingInput: 'none' }) }));

// ===== Helpers =====
function getAI(ctx: BotContext): SalesAI {
  if (!ctx.session.ai) {
    ctx.session.ai = new SalesAI(defaultBusinessInfo, defaultProducts, defaultFAQs);
  }
  return ctx.session.ai;
}

function productToMessage(p: Product, index?: number): string {
  const num = index !== undefined ? `${index}. ` : '';
  return `${num}🛒 *${p.nameFa}*\n💰 قیمت: ${p.price}\n📝 ${p.description}\n✨ ${p.features.join(' • ')}`;
}

function mainKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['🛍️ مشاهده محصولات', '❓ سوالات متداول'],
        ['🛒 سبد خرید', '💬 چت با هوش مصنوعی'],
        ['📞 پشتیبانی', 'ℹ️ درباره ما'],
      ],
      resize_keyboard: true,
    },
  };
}

function productKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        ...defaultProducts.map((p, i) => [{ text: `🛒 ${p.nameFa}`, callback_data: `product_${i}` }]),
        [{ text: '🔙 بازگشت', callback_data: 'back_main' }],
      ],
    },
  };
}

function productActionKeyboard(productIndex: number) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ افزودن به سبد خرید', callback_data: `addtocart_${productIndex}` }],
        [{ text: '🔙 بازگشت به محصولات', callback_data: 'back_products' }],
      ],
    },
  };
}

function cartKeyboard() {
  const buttons = defaultProducts.map((_, i) => 
    [{ text: `❌ حذف ${defaultProducts[i].nameFa}`, callback_data: `remove_${i}` }]
  );
  return {
    reply_markup: {
      inline_keyboard: [
        ...buttons,
        [{ text: '✅ نهایی کردن سفارش', callback_data: 'checkout' }],
        [{ text: '🔙 بازگشت', callback_data: 'back_main' }],
      ],
    },
  };
}

// ===== Commands =====
bot.start(async (ctx) => {
  const name = ctx.from?.first_name || 'کاربر';
  await ctx.reply(
    `👋 سلام ${name}!\n\n` +
    `به *${defaultBusinessInfo.nameFa}* خوش آمدید! 🤗\n\n` +
    `من یک دستیار هوشمند هستم که می‌تونم:\n` +
    `• محصولات رو بهت معرفی کنم 🛍️\n` +
    `• به سوالاتت جواب بدم ❓\n` +
    `• سفارشت رو ثبت کنم 🛒\n` +
    `• راهنماییت کنم 🎯\n\n` +
    `از منوی زیر انتخاب کن یا هر سوالی داری بپرس! 👇`,
    { parse_mode: 'Markdown', ...mainKeyboard() }
  );
});

// ===== Menu Handlers =====
bot.hears('🛍️ مشاهده محصولات', async (ctx) => {
  let msg = '📦 *محصولات ما:*\n\n';
  defaultProducts.forEach((p, i) => {
    msg += productToMessage(p, i + 1) + '\n\n';
  });
  await ctx.reply(msg, { parse_mode: 'Markdown', ...productKeyboard() });
});

bot.hears('❓ سوالات متداول', async (ctx) => {
  let msg = '❓ *سوالات متداول:*\n\n';
  defaultFAQs.forEach((f, i) => {
    msg += `*${i + 1}. ${f.question}*\n${f.answer}\n\n`;
  });
  await ctx.reply(msg, { parse_mode: 'Markdown' });
});

bot.hears('🛒 سبد خرید', async (ctx) => {
  const cart = ctx.session.cart;
  if (cart.length === 0) {
    await ctx.reply('🛒 سبد خرید شما خالی است!\nبرای خرید از منوی "مشاهده محصولات" استفاده کنید.');
    return;
  }

  let total = 0;
  let msg = '🛒 *سبد خرید شما:*\n\n';
  cart.forEach((item, i) => {
    const p = defaultProducts[parseInt(item.productId)];
    if (p) {
      msg += `${i + 1}. ${p.nameFa} — ${p.price}\n`;
      total += parseInt(p.price.replace(/[^0-9]/g, ''));
    }
  });
  msg += `\n💰 *مجموع: ${total.toLocaleString()} تومان*`;
  await ctx.reply(msg, { parse_mode: 'Markdown', ...cartKeyboard() });
});

bot.hears('💬 چت با هوش مصنوعی', async (ctx) => {
  await ctx.reply(
    '🧠 *حالت چت هوشمند فعال شد!*\n\n' +
    'هر سوالی داری بپرس، من جواب می‌دم.\n' +
    'مثال: "محصولاتتون چیه؟"، "قیمت سالانه چنده؟"\n\n' +
    'برای خروج از حالت چت، "بازگشت" رو بزن.',
    { parse_mode: 'Markdown' }
  );
  ctx.session.expectingInput = 'none';
});

bot.hears('📞 پشتیبانی', async (ctx) => {
  await ctx.reply(
    `📞 *پشتیبانی ${defaultBusinessInfo.nameFa}*\n\n` +
    `🆔 پشتیبانی: @llllxyz\n` +
    `⏰ ساعت کاری: ${defaultBusinessInfo.workingHours}\n\n` +
    `کارشناسان ما آماده پاسخگویی هستند! 🤗`,
    { parse_mode: 'Markdown' }
  );
});

bot.hears('ℹ️ درباره ما', async (ctx) => {
  await ctx.reply(
    `ℹ️ *${defaultBusinessInfo.nameFa}*\n\n` +
    `${defaultBusinessInfo.description}\n\n` +
    `🌐 وبسایت: ${defaultBusinessInfo.website}\n` +
    `📞 پشتیبانی: ${defaultBusinessInfo.supportContact}\n` +
    `⏰ ${defaultBusinessInfo.workingHours}`,
    { parse_mode: 'Markdown' }
  );
});

bot.hears('🔙 بازگشت', async (ctx) => {
  ctx.session.expectingInput = 'none';
  await ctx.reply('به منوی اصلی بازگشتید 👇', mainKeyboard());
});

// ===== Product Callbacks =====
bot.action(/product_(\d+)/, async (ctx) => {
  const index = parseInt(ctx.match![1]);
  const p = defaultProducts[index];
  if (!p) return;

  await ctx.editMessageText(
    productToMessage(p) + '\n\nبرای افزودن به سبد خرید دکمه زیر رو بزن 👇',
    { parse_mode: 'Markdown', ...productActionKeyboard(index) }
  );
  await ctx.answerCbQuery();
});

bot.action(/addtocart_(\d+)/, async (ctx) => {
  const index = ctx.match![1];
  ctx.session.cart.push({ productId: index, quantity: 1 });
  const p = defaultProducts[parseInt(index)];
  
  await ctx.editMessageText(
    `✅ *${p.nameFa}* به سبد خرید اضافه شد!\n\n` +
    `برای مشاهده سبد خرید از منوی "سبد خرید" استفاده کنید.`,
    { parse_mode: 'Markdown' }
  );
  await ctx.answerCbQuery('✅ به سبد خرید اضافه شد!');
});

bot.action(/remove_(\d+)/, async (ctx) => {
  const index = parseInt(ctx.match![1]);
  ctx.session.cart = ctx.session.cart.filter(item => parseInt(item.productId) !== index);
  
  await ctx.editMessageText('❌ محصول از سبد خرید حذف شد.', { parse_mode: 'Markdown' });
  await ctx.answerCbQuery('❌ حذف شد');
});

bot.action('checkout', async (ctx) => {
  const cart = ctx.session.cart;
  if (cart.length === 0) {
    await ctx.editMessageText('سبد خرید شما خالی است!');
    return;
  }

  let msg = '✅ *درخواست سفارش شما ثبت شد!*\n\n';
  msg += '📋 *خلاصه سفارش:*\n';
  let total = 0;
  cart.forEach((item) => {
    const p = defaultProducts[parseInt(item.productId)];
    if (p) {
      msg += `• ${p.nameFa} — ${p.price}\n`;
      total += parseInt(p.price.replace(/[^0-9]/g, ''));
    }
  });
  msg += `\n💰 مبلغ کل: ${total.toLocaleString()} تومان`;
  msg += `\n\n📞 برای پیگیری سفارش به پشتیبانی @llllxyz پیام بدید.`;
  msg += `\n\n🙏 از خرید شما متشکریم!`;

  await ctx.editMessageText(msg, { parse_mode: 'Markdown' });
  ctx.session.cart = [];
  await ctx.answerCbQuery('✅ سفارش ثبت شد!');
});

bot.action('back_products', async (ctx) => {
  let msg = '📦 *محصولات ما:*\n\n';
  defaultProducts.forEach((p, i) => {
    msg += productToMessage(p, i + 1) + '\n\n';
  });
  await ctx.editMessageText(msg, { parse_mode: 'Markdown', ...productKeyboard() });
  await ctx.answerCbQuery();
});

bot.action('back_main', async (ctx) => {
  await ctx.deleteMessage();
  await ctx.reply('به منوی اصلی بازگشتید 👇', mainKeyboard());
  await ctx.answerCbQuery();
});

// ===== AI Chat =====
bot.on(message('text'), async (ctx) => {
  // Skip command and menu texts
  const text = ctx.message.text;
  if (text.startsWith('/')) return;
  if (['🛍️ مشاهده محصولات', '❓ سوالات متداول', '🛒 سبد خرید', '💬 چت با هوش مصنوعی', '📞 پشتیبانی', 'ℹ️ درباره ما'].includes(text)) return;

  // Send typing indicator
  await ctx.sendChatAction('typing');

  try {
    const ai = getAI(ctx);
    const reply = await ai.chat(text);
    await ctx.reply(reply, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.reply('⚠️ خطایی رخ داد. لطفاً دوباره تلاش کنید.');
  }
});

// ===== Start Bot =====
export function startTelegramBot() {
  if (!token || token === 'your_telegram_bot_token') {
    console.log(chalk.yellow('⚠️ TELEGRAM_BOT_TOKEN not set. Telegram bot not started.'));
    console.log(chalk.yellow('   Add to .env: TELEGRAM_BOT_TOKEN=your_token'));
    return;
  }

  bot.launch().then(() => {
    console.log(chalk.green('✅ Telegram Sales Bot started!'));
    console.log(chalk.white(`   🤖 Bot is ready for customers`));
  }).catch(err => {
    console.error(chalk.red('❌ Failed to start Telegram bot:'), err.message);
  });
}
