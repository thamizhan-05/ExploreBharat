import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'explore-bharat-ultra-secure-jwt-secret-key-2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'explore-bharat-refresh-secret-token-key-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_ExploreBharatKey123',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_ExploreBharatSecretKey456',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_explorebharat_2026',
  PAYMENT_PROVIDER_MODE: process.env.PAYMENT_PROVIDER_MODE || 'demo',
  MAPS_PROVIDER: process.env.MAPS_PROVIDER || 'leaflet_osm',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || 'demo_key',
  AI_PROVIDER: process.env.AI_PROVIDER || 'internal_engine'
};
