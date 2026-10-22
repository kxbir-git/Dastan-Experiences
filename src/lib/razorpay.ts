import crypto from 'crypto';
import Razorpay from 'razorpay';

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_dastan_demo';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dastan_secret_demo_key';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'dastan_webhook_secret_key';

let razorpayClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
}

/**
 * Verifies Razorpay checkout signature:
 * generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret)
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  // If in demo test mode without live keys, allow verified test tokens
  if (
    (RAZORPAY_KEY_SECRET === 'dastan_secret_demo_key' || RAZORPAY_KEY_SECRET === 'dastan_experiences_secret_demo_key') &&
    signature.startsWith('demo_sig_')
  ) {
    return true;
  }

  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    return false;
  }
}

/**
 * Verifies Razorpay Webhook signature from X-Razorpay-Signature header
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying Webhook signature:', error);
    return false;
  }
}
