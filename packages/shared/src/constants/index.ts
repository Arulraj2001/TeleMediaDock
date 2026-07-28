export const PRODUCT_NAME = 'MediaDock';
export const FREE_BATCH_LIMIT = 20;
export const PRO_BATCH_LIMIT = 100;
export const DEFAULT_CONCURRENCY = 2;
export const MAX_CONCURRENCY_CAP = 4;
export const ZIP_ENABLED = false;
export const MAX_EXPONENTIAL_RETRIES = 3;
export const RETRY_DELAYS_MS = [1000, 2000, 4000] as const;
export const PRO_MONTHLY_PRICE = 2.99;
export const PRO_ANNUAL_PRICE = 24.99;
export const EARLY_ADOPTER_LIFETIME_PRICE = 49.00;
export const OFFLINE_GRACE_PERIOD_DAYS = 7;


export const COLOR_PALETTE = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  secondaryAccent: '#06B6D4',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  backgroundLight: '#F8FAFC',
  backgroundDark: '#090E1A',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#111827',
  elevatedLight: '#F1F5F9',
  elevatedDark: '#172033',
  borderLight: '#E2E8F0',
  borderDark: '#243047',
} as const;
