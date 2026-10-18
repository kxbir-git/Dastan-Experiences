export interface PriceCalculationResult {
  baseAmount: number;
  discountAmount: number;
  discountedBase: number;
  convenienceFee: number;
  convenienceFeeGst: number;
  totalGst: number;
  totalAmount: number;
  platformCommission: number;
  vendorEarnings: number;
}

export function calculateBookingPrice(
  unitPrice: number,
  quantity: number,
  options: {
    convenienceFeeFixed?: number;
    gstPct?: number; // GST on convenience fee (typically 18% in India)
    promoDiscount?: number;
    platformCommissionPct?: number;
  } = {}
): PriceCalculationResult {
  const {
    convenienceFeeFixed = 29,
    gstPct = 18,
    promoDiscount = 0,
    platformCommissionPct = 10,
  } = options;

  const baseAmount = unitPrice * quantity;
  const discountAmount = Math.min(promoDiscount, baseAmount);
  const discountedBase = baseAmount - discountAmount;

  // Convenience fee per order or per ticket (in India, typically fixed per booking or per head)
  const convenienceFee = quantity > 0 ? convenienceFeeFixed * Math.min(quantity, 4) : 0;
  
  // 18% GST applies to platform convenience fee
  const convenienceFeeGst = Math.round(convenienceFee * (gstPct / 100));
  const totalGst = convenienceFeeGst;

  const totalAmount = discountedBase + convenienceFee + totalGst;

  // Vendor & Platform Split:
  // Platform commission from base amount
  const platformCommission = Math.round(discountedBase * (platformCommissionPct / 100));
  const vendorEarnings = discountedBase - platformCommission;

  return {
    baseAmount,
    discountAmount,
    discountedBase,
    convenienceFee,
    convenienceFeeGst,
    totalGst,
    totalAmount,
    platformCommission,
    vendorEarnings,
  };
}
