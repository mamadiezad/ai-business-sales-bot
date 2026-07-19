# 🤖 AI Business Sales Bot — ربات فروشنده هوشمند

> **AI-powered sales assistant** for websites AND Telegram stores.
> **ربات فروشنده هوشمند با هوش مصنوعی** — هم برای وبسایت، هم برای فروشگاه تلگرام

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://openai.com)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-2CA5E0?logo=telegram)](https://core.telegram.org/bots)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## ✨ قابلیت‌ها

### 🌐 برای وبسایت
| قابلیت | توضیح |
|--------|-------|
| 🧠 **AI فروشنده** | پاسخگویی هوشمند با OpenAI GPT-4o |
| 🔌 **نصب آسان** | فقط یک خط کد روی هر سایتی |
| 💬 **ویجت چت** | شناور در سایت، آماده پاسخگویی |
| ❓ **FAQ هوشمند** | پاسخ به سوالات متداول |

### 📱 برای فروشگاه تلگرام
| قابلیت | توضیح |
|--------|-------|
| 🤖 **ربات فروشنده** | ربات هوشمند تلگرام برای فروشگاه شما |
| 🛍️ **نمایش محصولات** | لیست محصولات با قیمت و توضیحات |
| 🛒 **سبد خرید** | افزودن/حذف محصول، ثبت سفارش |
| 🧠 **AI چت** | مشاوره هوشمند قبل از خرید |
| 📞 **پشتیبانی** | ارتباط مستقیم با پشتیبان |

---

## 🚀 نصب سریع

### ۱. Clone & Install
```bash
git clone https://github.com/mamadiezad/ai-business-sales-bot.git
cd ai-business-sales-bot
npm install
```

### ۲. تنظیم `.env`
```bash
cp .env.example .env
# توکن‌ها را در .env وارد کنید
```

### ۳. اجرا
```bash
npm run dev
```

---

## 📱 فروشگاه تلگرام

### ساخت ربات تلگرام فروشگاهی
۱. برو به [@BotFather](https://t.me/BotFather)
۲. بزن `/newbot` و اسم رباتتو بده
۳. توکن رو کپی کن
۴. بذار توی `.env`:
```
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
```

### منوی ربات تلگرام
```
🛍️ مشاهده محصولات    ❓ سوالات متداول
🛒 سبد خرید           💬 چت با هوش مصنوعی
📞 پشتیبانی           ℹ️ درباره ما
```

### مشتری میتونه:
- محصولات رو ببینه
- با AI چت کنه و مشاوره بگیره
- به سبد خرید اضافه کنه
- سفارش نهایی رو ثبت کنه

---

## 🌐 نصب روی وبسایت

فقط این یک خط کد:
```html
<script src="https://your-server.com/embed.js"></script>
```

---

## 📁 ساختار پروژه

```
ai-business-sales-bot/
├── src/
│   ├── server/           # سرور اصلی (Express + OpenAI)
│   │   ├── index.ts       # ورودی سرور
│   │   ├── ai.ts          # موتور هوش مصنوعی
│   │   ├── knowledge.ts   # محصولات، FAQ، اطلاعات کسب و کار
│   │   └── config.ts      # تنظیمات
│   ├── telegram/
│   │   └── bot.ts         # ربات فروشگاه تلگرام
│   ├── widget/
│   │   ├── chat-widget.js # ویجت وبسایت
│   │   └── chat-widget.css
│   └── admin/
│       └── index.html     # پنل مدیریت
├── .env.example
├── package.json
└── README.md
```

---

## 🔗 ریپوهای مرتبط
- [🤖 ربات چت ناشناس](https://github.com/mamadiezad/robot-chat-nashnas)
- [📊 MT5 Grid EA](https://github.com/mamadiezad/mt5-grid-trading-ea)

---

## 📜 لایسنس
**MIT** — آزاد برای استفاده شخصی و تجاری.

---

<p align="center">ساخته شده با ❤️ توسط <a href="https://github.com/mamadiezad">Mohammad</a></p>
