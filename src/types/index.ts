export type UserRole = 'customer' | 'vendor' | 'admin';

export type ListingStatus = 'draft' | 'pending_approval' | 'published' | 'rejected' | 'archived';

export type BookingStatus = 'pending_payment' | 'confirmed' | 'checked_in' | 'cancelled' | 'refunded';

export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  displayName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  city: string;
  bio?: string;
  interests: string[];
  isSocialOptedIn: boolean;
  createdAt: string;
}

export type KycStatus = 'unsubmitted' | 'pending_review' | 'verified' | 'rejected';

export interface KycDocument {
  id: string;
  docType: 'pan' | 'gst' | 'fssai_license' | 'cancelled_cheque' | 'business_proof';
  docName: string;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessType: 'restaurant' | 'event_organizer' | 'hospitality_group';
  city: string;
  upiId?: string;
  pan?: string;
  gstin?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankBeneficiaryName?: string;
  razorpayAccountId?: string;
  isVerified: boolean;
  kycStatus?: KycStatus;
  kycSubmittedAt?: string;
  kycVerifiedAt?: string;
  kycRejectionReason?: string;
  kycDocuments?: KycDocument[];
  commissionOverridePct?: number;
}

export interface TicketTier {
  id: string;
  eventId: string;
  tierName: string;
  price: number; // in INR
  totalCapacity: number;
  soldCount: number;
  perks: string[];
  salesStart?: string;
  salesEnd?: string;
}

export interface EventDaySchedule {
  dayNumber: number;
  date: string;
  label: string;
  theme?: string;
}

export interface DailyPass {
  passId: string;
  dayNumber: number;
  date: string;
  dayLabel: string;
  qrCodeHash: string;
  status: 'valid' | 'checked_in' | 'expired';
  checkedInAt?: string;
  checkedInGate?: string;
}

export interface EventListing {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  slug: string;
  category: 'live_music' | 'standup_comedy' | 'food_fest' | 'club_night' | 'cultural_experience';
  categoryLabel: string;
  description: string;
  city: string;
  venueName: string;
  venueAddress: string;
  bannerUrl: string;
  galleryUrls: string[];
  startTime: string;
  endTime: string;
  status: ListingStatus;
  isFeatured: boolean;
  ageRestriction: string;
  termsConditions: string;
  ticketTiers: TicketTier[];
  startingPrice: number;
  daysCount?: number;
  eventDays?: EventDaySchedule[];
}

export interface RestaurantOffer {
  id: string;
  restaurantId: string;
  title: string;
  discountPct: number;
  description: string;
  availableDays: string[];
  validFrom: string;
  validTo: string;
  coverCharge: number; // per guest guarantee in INR
  maxCoversPerSlot: number;
  isActive: boolean;
}

export interface Restaurant {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  slug: string;
  description: string;
  cuisineTypes: string[];
  city: string;
  area: string;
  address: string;
  images: string[];
  avgCostForTwo: number;
  rating: number;
  reviewCount: number;
  status: ListingStatus;
  isFeatured: boolean;
  socialTableEnabled: boolean;
  offers: RestaurantOffer[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingType: 'event' | 'dining';
  
  // Specific targets
  eventId?: string;
  eventTitle?: string;
  eventBanner?: string;
  tierId?: string;
  tierName?: string;
  
  restaurantId?: string;
  restaurantName?: string;
  restaurantImage?: string;
  offerId?: string;
  offerTitle?: string;
  
  quantity: number;
  bookingDate: string;
  timeSlot?: string;
  
  // Monetary
  baseAmount: number;
  discountAmount: number;
  convenienceFee: number;
  gstAmount: number;
  totalAmount: number;
  
  status: BookingStatus;
  qrCodeHash: string;
  isSocialOptedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
  
  // Multi-day Event Pass Architecture
  dailyPasses?: DailyPass[];
  passType?: 'single_day' | 'multi_day';
  selectedDayNumber?: number;
  totalDays?: number;

  // Payment link
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface SocialDiscoveryProfile {
  id: string;
  userId: string;
  firstName: string;
  bio: string;
  interests: string[];
  avatarUrl?: string;
  targetType: 'event' | 'dining';
  targetId: string;
  bookingDate: string;
  timeSlot?: string;
}

export interface AdminSettings {
  platformCommissionPct: number;
  convenienceFeeFixed: number;
  gstPct: number;
  supportedCities: string[];
  contactEmail: string;
  contactPhone: string;
  razorpayRouteEnabled?: boolean;
  featuredListingPrice?: number;
  payoutFrequency?: 'daily' | 'weekly' | 'instant';
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountCap?: number;
  minBookingAmount?: number;
  vendorId?: string; // undefined = platform-funded
  isActive: boolean;
  validUntil?: string;
  usageCount: number;
}

export type SubscriptionTier = 'starter' | 'curator_pro' | 'heritage_luxury';

export interface VendorSubscription {
  vendorId: string;
  tier: SubscriptionTier;
  tierName: string;
  monthlyPrice: number;
  commissionPct: number;
  featuredListingCredits: number;
  usedListingCredits: number;
  razorpayRouteInstantSettlements: boolean;
  prioritySocialPlacement: boolean;
  status: 'active' | 'cancelled';
  renewsAt: string;
}

export interface PayoutRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  period: string;
  grossBookingsGmv: number;
  commissionDeducted: number;
  gatewayFeesDeducted: number;
  netPayoutAmount: number;
  status: 'pending' | 'processing' | 'transferred' | 'failed';
  method: 'razorpay_route' | 'manual_ledger_neft';
  razorpayTransferId?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  processedAt?: string;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  paymentId?: string;
  razorpayRefundId?: string;
  amount: number;
  reason: string;
  initiatedBy: string;
  status: 'processed' | 'pending' | 'failed';
  createdAt: string;
}

export interface RevenueSummary {
  grossGMV: number;
  totalPlatformRevenue: number;
  commissionRevenue: number;
  convenienceFeeRevenue: number;
  subscriptionRevenue: number;
  totalPayoutsDisbursed: number;
  pendingPayouts: number;
  totalRefundsAmount: number;
  activeSubscriptionsCount: number;
  featuredListingsCount: number;
}

export interface SponsorCampaign {
  id: string;
  sponsor: string;
  tagline: string;
  title: string;
  description: string;
  badge: string;
  perk: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  logo: string;
  isActive: boolean;
  createdAt?: string;
}


