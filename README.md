# 🤖 AI Business Sales Bot — ربات فروشنده هوشمند

> **AI-powered sales assistant** for businesses. Embeddable in any website with one line of code.
> **ربات فروشنده هوشمند با هوش مصنوعی** — مناسب برای فروشگاه‌های آنلاین، VPN فروش‌ها و هر کسب و کاری

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://openai.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## ✨ قابلیت‌ها

| قابلیت | توضیح |
|--------|-------|
| 🧠 **AI فروشنده** | پاسخگویی هوشمند با OpenAI GPT-4o |
| 🔌 **نصب آسان** | فقط یک خط کد روی هر سایتی |
| 📦 **مدیریت محصولات** | افزودن/ویرایش محصولات و قیمت‌ها |
| ❓ **FAQ هوشمند** | پاسخ به سوالات متداول کاربران |
| 💬 **چت آنلاین** | شبیه به چت واقعی با انیمیشن تایپینگ |
| 🎨 **سفارشی‌سازی** | تغییر رنگ، نام، توضیحات کسب و کار |
| 🌐 **دو زبانه** | فارسی و انگلیسی |
| 📊 **پنل مدیریت** | مدیریت محصولات و تنظیمات |
| 🚀 **سبک و سریع** | بدون وابستگی خارجی، حجم کم |

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
# توکن OpenAI را در .env وارد کنید
```

### ۳. اجرا

```bash
npm run dev
```

### ۴. نصب روی سایت شما

فقط این یک خط کد را به سایت خود اضافه کنید:

```html
<script src="https://your-server.com/embed.js"></script>
```

---

## 🛠️ API Reference

### `POST /api/chat`
ارسال پیام و دریافت پاسخ از AI

```json
{
  "message": "محصولاتتون چیه؟",
  "sessionId": "session_123"
}
```

### `GET /api/products`
دریافت لیست محصولات

### `GET /api/business`
دریافت اطلاعات کسب و کار

### `GET /embed.js`
اسکریپت نصب ویجت

---

## 📋 مثال: فروشگاه VPN

ربات به صورت پیش‌فرض با دانش یک فروشگاه VPN (SurfShield) راه‌اندازی می‌شود:

- **محصولات**: ماهانه، سه ماهه، سالانه، مادام‌العمر، سازمانی
- **FAQ**: نحوه خرید، پشتیبانی، سرورها، گارانتی
- **پشتیبانی**: ۲۴ ساعته

شما می‌توانید محصولات و اطلاعات را از طریق **پنل مدیریت** تغییر دهید.

---

## 🎨 شخصی‌سازی

ویرایش فایل `src/server/knowledge.ts` برای تغییر:
- محصولات و قیمت‌ها
- سوالات متداول
- اطلاعات کسب و کار
- رنگ‌ها و استایل

---

## 📁 ساختار پروژه

```
ai-business-sales-bot/
├── src/
│   ├── server/
│   │   ├── index.ts       # سرور اصلی (Express)
│   │   ├── ai.ts          # هوش مصنوعی (OpenAI)
│   │   ├── knowledge.ts   # دانش کسب و کار
│   │   └── config.ts      # تنظیمات
│   ├── widget/
│   │   ├── chat-widget.js # ویجت قابل نصب
│   │   └── chat-widget.css# استایل ویجت
│   └── admin/
│       └── index.html     # پنل مدیریت
├── .env.example
├── package.json
└── README.md
```

---

## 🔗 ریپوهای مرتبط

- [🤖 ربات چت ناشناس تلگرام](https://github.com/mamadiezad/robot-chat-nashnas)
- [📊 MT5 Grid Trading EA](https://github.com/mamadiezad/mt5-grid-trading-ea)

---

## 📜 لایسنس

**MIT** — آزاد برای استفاده شخصی و تجاری.

---

<p align="center">
  ساخته شده با ❤️ توسط <a href="https://github.com/mamadiezad">Mohammad</a>
</p>
