/**
 * Knowledge Base Manager
 * مدیریت دانش کسب و کار — محصولات، سوالات متداول، اطلاعات تماس
 */

export interface Product {
  id: string;
  name: string;
  nameFa: string;
  category: string;
  price: string;
  description: string;
  features: string[];
  inStock: boolean;
  link?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BusinessInfo {
  name: string;
  nameFa: string;
  description: string;
  workingHours: string;
  supportContact: string;
  website: string;
  telegram?: string;
  instagram?: string;
}

// Default knowledge for a VPN business (example)
export const defaultBusinessInfo: BusinessInfo = {
  name: 'SurfShield VPN',
  nameFa: 'سورف‌شیلد وی‌پی‌ان',
  description: 'فروشنده معتبر وی‌پی‌ان با سرور در ۵۰ کشور جهان. پرسرعت، امن و بدون محدودیت.',
  workingHours: 'پشتیبانی ۲۴ ساعته',
  supportContact: 'پشتیبانی: @llllxyz',
  website: 'https://example.com',
  telegram: '@llllxyz',
  instagram: '@surfshield',
};

export const defaultProducts: Product[] = [
  {
    id: 'vpn-1',
    name: 'SurfShield Monthly',
    nameFa: 'وی‌پی‌ان یک ماهه',
    category: 'vpn',
    price: '۱۰۰,۰۰۰ تومان',
    description: 'وی‌پی‌ان پرسرعت با مصرف نامحدود. مناسب برای استفاده روزمره.',
    features: ['مصرف نامحدود', '۵۰ کشور', 'پشتیبانی ۲۴/۷', 'قابل استفاده روی ۳ دستگاه'],
    inStock: true,
    link: 'https://example.com/vpn/monthly',
  },
  {
    id: 'vpn-3',
    name: 'SurfShield Quarterly',
    nameFa: 'وی‌پی‌ان سه ماهه',
    category: 'vpn',
    price: '۲۵۰,۰۰۰ تومان',
    description: 'بسته اقتصادی با ۳ ماه سرویس پرسرعت بدون محدودیت.',
    features: ['مصرف نامحدود', '۵۰ کشور', 'پشتیبانی ۲۴/۷', 'قابل استفاده روی ۵ دستگاه', '۱۵٪ تخفیف'],
    inStock: true,
  },
  {
    id: 'vpn-6',
    name: 'SurfShield Yearly',
    nameFa: 'وی‌پی‌ان سالانه',
    category: 'vpn',
    price: '۷۵۰,۰۰۰ تومان',
    description: 'بهترین ارزش با ۱۲ ماه سرویس پرسرعت. معادل ماهی ۶۲,۵۰۰ تومان!',
    features: ['مصرف نامحدود', '۵۰ کشور', 'پشتیبانی ۲۴/۷', 'قابل استفاده روی ۱۰ دستگاه', '۴۰٪ تخفیف', 'VIP Support'],
    inStock: true,
  },
  {
    id: 'vpn-lifetime',
    name: 'SurfShield Lifetime',
    nameFa: 'وی‌پی‌ان مادام‌العمر',
    category: 'vpn',
    price: '۲,۵۰۰,۰۰۰ تومان',
    description: 'یکبار پرداخت کنید، تا همیشه استفاده کنید!',
    features: ['مصرف نامحدود', '۵۰ کشور', 'پشتیبانی ۲۴/۷', 'مادام‌العمر', 'نامحدود دستگاه', 'VIP Priority'],
    inStock: true,
  },
  {
    id: 'vpn-business',
    name: 'SurfShield Business',
    nameFa: 'وی‌پی‌ان سازمانی',
    category: 'vpn',
    price: '۵,۰۰۰,۰۰۰ تومان',
    description: 'مناسب شرکت‌ها و سازمان‌ها. به همراه پنل مدیریت اختصاصی.',
    features: ['مصرف نامحدود', '۵۰ کشور', 'پنل اختصاصی', 'مدیریت کاربران', 'مشاوره رایگان', '۱۰۰ دستگاه'],
    inStock: true,
  },
];

export const defaultFAQs: FAQ[] = [
  {
    question: 'چطور می‌تونم وی‌پی‌ان بخرم؟',
    answer: 'خیلی ساده! کافیه محصول مورد نظرت رو از لیست انتخاب کنی و بعد از پرداخت، اطلاعات حساب برات ارسال میشه. اگه نیاز به راهنمایی داری، به پشتیبانی پیام بده.'
  },
  {
    question: 'روی چند تا دستگاه میشه نصب کرد؟',
    answer: 'بسته به نوع اشتراک، می‌تونی روی ۳ تا ۱۰ دستگاه همزمان استفاده کنی. اشتراک مادام‌العمر نامحدوده!'
  },
  {
    question: 'چجوری پرداخت کنم؟',
    answer: 'پرداخت از طریق کارت‌های عضو شتاب انجام میشه. بعد از پرداخت، اطلاعات اتصال برات ارسال میشه.'
  },
  {
    question: 'پشتیبانی دارید؟',
    answer: 'بله! پشتیبانی ۲۴ ساعته از طریق تلگرام @llllxyz در خدمت شماست.'
  },
  {
    question: 'سرورها تو کدوم کشورها هستن؟',
    answer: 'ما سرورهایی در ۵۰ کشور داریم از جمله: آلمان، هلند، فرانسه، آمریکا، کانادا، انگلیس، ترکیه، امارات، سنگاپور و...'
  },
  {
    question: 'آیا محدودیت مصرف داره؟',
    answer: 'خیر! همه پلن‌های ما مصرف نامحدود دارن. هر چقدر دوست داری استفاده کن.'
  },
  {
    question: 'چطور میتونم سفارش بدم؟',
    answer: 'همین حالا می‌تونی از طریق خود ربات سفارش بدی. فقط بگو کدوم پلن رو می‌خوای.'
  },
  {
    question: 'گارانتی بازگشت وجه دارید؟',
    answer: 'بله! ۷ روز ضمانت بازگشت وجه داریم. اگه از سرویس راضی نبودی، مبلغت کامل برگردونده میشه.'
  },
];
