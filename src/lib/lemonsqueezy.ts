/**
 * Lemon Squeezy Payments & Subscription Helpers
 */

export interface CheckoutConfig {
  variantId: string;
  userId: string;
  userEmail: string;
  isYearly?: boolean;
}

export const LEMON_MONTHLY_VARIANT_ID =
  import.meta.env.VITE_LEMONSQUEEZY_MONTHLY_VARIANT_ID || 'ls_variant_pro_monthly';
export const LEMON_YEARLY_VARIANT_ID =
  import.meta.env.VITE_LEMONSQUEEZY_YEARLY_VARIANT_ID || 'ls_variant_pro_yearly';
export const LEMON_STORE_ID =
  import.meta.env.VITE_LEMONSQUEEZY_STORE_ID || '';

/**
 * Builds the Lemon Squeezy checkout URL with user metadata
 */
export function buildLemonSqueezyCheckoutUrl({
  variantId,
  userId,
  userEmail,
}: CheckoutConfig): string {
  // If a real store domain or custom URL is configured:
  const baseStoreUrl = `https://signalpulse.lemonsqueezy.com/buy/${variantId}`;
  
  const params = new URLSearchParams();
  if (userEmail) {
    params.set('checkout[email]', userEmail);
  }
  if (userId) {
    params.set('checkout[custom][user_id]', userId);
  }
  params.set('embed', '1');
  params.set('media', '0');

  return `${baseStoreUrl}?${params.toString()}`;
}

/**
 * Open Customer Portal
 */
export function openCustomerPortal(portalUrl?: string) {
  if (portalUrl) {
    window.open(portalUrl, '_blank', 'noopener,noreferrer');
  } else {
    // Default Lemon Squeezy customer billing portal URL
    window.open('https://app.lemonsqueezy.com/my-orders', '_blank', 'noopener,noreferrer');
  }
}
