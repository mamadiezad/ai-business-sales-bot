import dotenv from 'dotenv';
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  },
  business: {
    name: process.env.BUSINESS_NAME || 'فروشگاه من',
    description: process.env.BUSINESS_DESCRIPTION || 'فروشگاه آنلاین',
    primaryColor: process.env.PRIMARY_COLOR || '#7c3aed',
    secondaryColor: process.env.SECONDARY_COLOR || '#1a1a2e',
    logoUrl: process.env.LOGO_URL || '',
  },
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
};
