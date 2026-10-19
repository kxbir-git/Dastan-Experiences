import {
  EventListing,
  Restaurant,
  Booking,
  AdminSettings,
  SocialDiscoveryProfile,
  UserProfile,
  UserRole,
  PromoCode,
  VendorSubscription,
  SubscriptionTier,
  PayoutRecord,
  RefundRecord,
  RevenueSummary,
  Vendor,
  TicketTier,
  RestaurantOffer,
  ListingStatus,
} from '@/types';
import {
  INITIAL_EVENTS,
  INITIAL_RESTAURANTS,
  INITIAL_BOOKINGS,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_SOCIAL_PROFILES,
  DEMO_USERS,
  INITIAL_VENDOR_SUBSCRIPTIONS,
  INITIAL_PROMO_CODES,
  INITIAL_PAYOUTS,
  INITIAL_REFUNDS,
  INITIAL_VENDORS,
  SUBSCRIPTION_PLANS,
} from './mock-data';

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  status: 'captured' | 'failed' | 'refunded';
  currency: string;
  method?: string;
  customerEmail?: string;
  signature?: string;
  createdAt: string;
}

class AzaadDataStore {
  private events: EventListing[] = [...INITIAL_EVENTS];
  private restaurants: Restaurant[] = [...INITIAL_RESTAURANTS];
  private bookings: Booking[] = [...INITIAL_BOOKINGS];
  private payments: PaymentRecord[] = [
    {
      id: 'pay_rec_init_1',
      orderId: 'order_test_94821',
      paymentId: 'pay_demo_94821',
      amount: 1798,
      status: 'captured',
      currency: 'INR',
      method: 'upi',
      customerEmail: 'rohan.sharma@example.com',
      createdAt: '2026-10-18T10:00:00Z',
    },
  ];
  private settings: AdminSettings = { ...INITIAL_ADMIN_SETTINGS };
  private socialProfiles: SocialDiscoveryProfile[] = [...INITIAL_SOCIAL_PROFILES];
  private currentUserRole: UserRole = 'customer';
  private promoCodes: PromoCode[] = [...INITIAL_PROMO_CODES];
  private subscriptions: Record<string, VendorSubscription> = { ...INITIAL_VENDOR_SUBSCRIPTIONS };
  private payouts: PayoutRecord[] = [...INITIAL_PAYOUTS];
  private refunds: RefundRecord[] = [...INITIAL_REFUNDS];
  private vendors: Vendor[] = [...INITIAL_VENDORS];

  // Events
  getEvents(city?: string, category?: string): EventListing[] {
    return this.events.filter((evt) => {
      const matchCity =
        !city ||
        city === 'All' ||
        city.toLowerCase().startsWith('all') ||
        evt.city.toLowerCase() === city.toLowerCase();
      const matchCat = !category || category === 'All' || evt.category === category;
      return matchCity && matchCat && evt.status === 'published';
    });
  }

  getAllEvents(): EventListing[] {
    return this.events;
  }

  getEventBySlug(slug: string): EventListing | undefined {
    return this.events.find((e) => e.slug === slug);
  }

  getEventById(id: string): EventListing | undefined {
    return this.events.find((e) => e.id === id);
  }

  addEvent(event: EventListing): void {
    this.events.unshift(event);
  }

  updateEventStatus(id: string, status: EventListing['status']): boolean {
    const evt = this.events.find((e) => e.id === id);
    if (evt) {
      evt.status = status;
      return true;
    }
    return false;
  }

  toggleFeaturedEvent(id: string, isFeatured?: boolean): boolean {
    const evt = this.events.find((e) => e.id === id);
    if (evt) {
      evt.isFeatured = isFeatured !== undefined ? isFeatured : !evt.isFeatured;
      return true;
    }
    return false;
  }

  updateTicketTier(eventId: string, tierId: string, updates: Partial<TicketTier>): boolean {
    const evt = this.events.find((e) => e.id === eventId);
    if (!evt) return false;
    const tier = evt.ticketTiers.find((t) => t.id === tierId);
    if (!tier) return false;
    Object.assign(tier, updates);
    // Recalculate event starting price
    if (evt.ticketTiers.length > 0) {
      evt.startingPrice = Math.min(...evt.ticketTiers.map((t) => t.price));
    }
    return true;
  }

  addTicketTier(eventId: string, tier: TicketTier): boolean {
    const evt = this.events.find((e) => e.id === eventId);
    if (!evt) return false;
    evt.ticketTiers.push(tier);
    evt.startingPrice = Math.min(...evt.ticketTiers.map((t) => t.price));
    return true;
  }

  deleteTicketTier(eventId: string, tierId: string): boolean {
    const evt = this.events.find((e) => e.id === eventId);
    if (!evt || evt.ticketTiers.length <= 1) return false;
    const idx = evt.ticketTiers.findIndex((t) => t.id === tierId);
    if (idx >= 0) {
      evt.ticketTiers.splice(idx, 1);
      evt.startingPrice = Math.min(...evt.ticketTiers.map((t) => t.price));
      return true;
    }
    return false;
  }

  // Restaurants
  getRestaurants(city?: string, cuisine?: string): Restaurant[] {
    return this.restaurants.filter((rest) => {
      const matchCity =
        !city ||
        city === 'All' ||
        city.toLowerCase().startsWith('all') ||
        rest.city.toLowerCase() === city.toLowerCase();
      const matchCuisine = !cuisine || cuisine === 'All' || rest.cuisineTypes.some((c) => c.toLowerCase().includes(cuisine.toLowerCase()));
      return matchCity && matchCuisine && rest.status === 'published';
    });
  }

  getAllRestaurants(): Restaurant[] {
    return this.restaurants;
  }

  getRestaurantBySlug(slug: string): Restaurant | undefined {
    return this.restaurants.find((r) => r.slug === slug);
  }

  getRestaurantById(id: string): Restaurant | undefined {
    return this.restaurants.find((r) => r.id === id);
  }

  addRestaurant(restaurant: Restaurant): void {
    this.restaurants.unshift(restaurant);
  }

  updateRestaurantStatus(id: string, status: Restaurant['status']): boolean {
    const rest = this.restaurants.find((r) => r.id === id);
    if (rest) {
      rest.status = status;
      return true;
    }
    return false;
  }

  toggleFeaturedRestaurant(id: string, isFeatured?: boolean): boolean {
    const rest = this.restaurants.find((r) => r.id === id);
    if (rest) {
      rest.isFeatured = isFeatured !== undefined ? isFeatured : !rest.isFeatured;
      return true;
    }
    return false;
  }

  updateRestaurant(id: string, updates: Partial<Restaurant>): boolean {
    const rest = this.restaurants.find((r) => r.id === id);
    if (rest) {
      Object.assign(rest, updates);
      return true;
    }
    return false;
  }

  addRestaurantOffer(restaurantId: string, offer: RestaurantOffer): boolean {
    const rest = this.restaurants.find((r) => r.id === restaurantId);
    if (!rest) return false;
    rest.offers.unshift(offer);
    return true;
  }

  toggleRestaurantOffer(restaurantId: string, offerId: string): boolean {
    const rest = this.restaurants.find((r) => r.id === restaurantId);
    if (!rest) return false;
    const offer = rest.offers.find((o) => o.id === offerId);
    if (offer) {
      offer.isActive = !offer.isActive;
      return true;
    }
    return false;
  }

  deleteRestaurantOffer(restaurantId: string, offerId: string): boolean {
    const rest = this.restaurants.find((r) => r.id === restaurantId);
    if (!rest) return false;
    const idx = rest.offers.findIndex((o) => o.id === offerId);
    if (idx >= 0) {
      rest.offers.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Bookings & Capacity Guard
  getBookings(userId?: string): Booking[] {
    if (userId) {
      return this.bookings.filter((b) => b.userId === userId);
    }
    return this.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id || b.bookingNumber === id);
  }

  getBookingByQrHash(hash: string): Booking | undefined {
    return this.bookings.find((b) => b.qrCodeHash === hash);
  }

  createBooking(newBooking: Booking): { success: boolean; error?: string; booking?: Booking } {
    // Idempotency: return existing booking if payment ID was already processed
    if (newBooking.razorpayPaymentId) {
      const existing = this.bookings.find(
        (b) => b.razorpayPaymentId === newBooking.razorpayPaymentId
      );
      if (existing) {
        return { success: true, booking: existing };
      }
    }

    // Inventory lock check if event tier
    if (newBooking.bookingType === 'event' && newBooking.tierId) {
      const event = this.events.find((e) => e.id === newBooking.eventId);
      if (event) {
        const tier = event.ticketTiers.find((t) => t.id === newBooking.tierId);
        if (tier) {
          if (tier.soldCount + newBooking.quantity > tier.totalCapacity) {
            return {
              success: false,
              error: `Sold out! Only ${tier.totalCapacity - tier.soldCount} tickets remaining for ${tier.tierName}.`,
            };
          }
          // Increment sold count atomically
          tier.soldCount += newBooking.quantity;
        }
      }
    }

    this.bookings.unshift(newBooking);

    // If opted into social discovery, add profile
    if (newBooking.isSocialOptedIn) {
      this.socialProfiles.unshift({
        id: `soc-${Date.now()}`,
        userId: newBooking.userId,
        firstName: newBooking.customerName.split(' ')[0],
        bio: 'Connecting on Dastan Experiences for unforgettable storytelling, luxury dining, and cultural conversations.',
        interests: ['Storytelling', 'Culture & Arts', 'Luxury Dining'],
        targetType: newBooking.bookingType,
        targetId: (newBooking.eventId || newBooking.restaurantId)!,
        bookingDate: newBooking.bookingDate,
        timeSlot: newBooking.timeSlot,
      });
    }

    return { success: true, booking: newBooking };
  }

  checkInBooking(qrHash: string): { success: boolean; message: string; booking?: Booking } {
    const booking = this.getBookingByQrHash(qrHash);
    if (!booking) {
      return { success: false, message: 'Invalid ticket pass or QR code not found.' };
    }
    if (booking.status === 'checked_in') {
      return {
        success: false,
        message: `Ticket already checked in at ${new Date(booking.checkedInAt!).toLocaleTimeString('en-IN')}`,
        booking,
      };
    }
    if (booking.status !== 'confirmed') {
      return { success: false, message: `Ticket status is ${booking.status}. Cannot check in.` };
    }

    booking.status = 'checked_in';
    booking.checkedInAt = new Date().toISOString();
    return { success: true, message: `Check-in approved for ${booking.customerName}! (${booking.quantity} guest(s))`, booking };
  }

  refundBooking(
    bookingId: string,
    reason: string,
    initiatedBy: string = 'Platform Admin'
  ): { success: boolean; error?: string; refund?: RefundRecord } {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };
    if (booking.status === 'refunded') return { success: false, error: 'Booking already refunded' };

    booking.status = 'refunded';

    // Release capacity back if event
    if (booking.bookingType === 'event' && booking.tierId) {
      const event = this.events.find((e) => e.id === booking.eventId);
      if (event) {
        const tier = event.ticketTiers.find((t) => t.id === booking.tierId);
        if (tier) {
          tier.soldCount = Math.max(0, tier.soldCount - booking.quantity);
        }
      }
    }

    const refundRec: RefundRecord = {
      id: `rfnd-rec-${Date.now()}`,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerName: booking.customerName,
      paymentId: booking.razorpayPaymentId,
      razorpayRefundId: `rfnd_rzp_${Date.now()}`,
      amount: booking.totalAmount,
      reason,
      initiatedBy,
      status: 'processed',
      createdAt: new Date().toISOString(),
    };

    this.refunds.unshift(refundRec);
    return { success: true, refund: refundRec };
  }

  getRefunds(): RefundRecord[] {
    return this.refunds;
  }

  // Promo Codes Engine
  getPromoCodes(): PromoCode[] {
    return this.promoCodes;
  }

  getPromoCode(code: string): PromoCode | undefined {
    return this.promoCodes.find((p) => p.code.toUpperCase() === code.toUpperCase());
  }

  addPromoCode(promo: PromoCode): void {
    const existing = this.getPromoCode(promo.code);
    if (existing) {
      throw new Error(`Promo code ${promo.code} already exists.`);
    }
    this.promoCodes.unshift(promo);
  }

  updatePromoCode(id: string, updates: Partial<PromoCode>): boolean {
    const promo = this.promoCodes.find((p) => p.id === id);
    if (promo) {
      Object.assign(promo, updates);
      return true;
    }
    return false;
  }

  deletePromoCode(id: string): boolean {
    const idx = this.promoCodes.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.promoCodes.splice(idx, 1);
      return true;
    }
    return false;
  }

  validatePromoCode(
    codeStr: string,
    bookingAmount: number,
    vendorId?: string
  ): { valid: boolean; discountAmount: number; message: string; promo?: PromoCode } {
    const promo = this.getPromoCode(codeStr);
    if (!promo) {
      return { valid: false, discountAmount: 0, message: 'Invalid promo code.' };
    }
    if (!promo.isActive) {
      return { valid: false, discountAmount: 0, message: 'Promo code is inactive or expired.' };
    }
    if (promo.validUntil && new Date(promo.validUntil) < new Date()) {
      return { valid: false, discountAmount: 0, message: 'This promo code has expired.' };
    }
    if (promo.minBookingAmount && bookingAmount < promo.minBookingAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum booking value of ₹${promo.minBookingAmount} required.`,
      };
    }
    if (promo.vendorId && vendorId && promo.vendorId !== vendorId) {
      return {
        valid: false,
        discountAmount: 0,
        message: 'This promo code is not applicable for this host.',
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round((bookingAmount * promo.discountValue) / 100);
      if (promo.maxDiscountCap) {
        discount = Math.min(discount, promo.maxDiscountCap);
      }
    } else {
      discount = Math.min(promo.discountValue, bookingAmount);
    }

    return {
      valid: true,
      discountAmount: discount,
      message: `Code applied! ₹${discount} discount added.`,
      promo,
    };
  }

  // Vendor Subscriptions & Boosts
  getVendorSubscription(vendorId: string): VendorSubscription {
    if (!this.subscriptions[vendorId]) {
      this.subscriptions[vendorId] = {
        vendorId,
        tier: 'starter',
        tierName: 'Starter Curator',
        monthlyPrice: 0,
        commissionPct: 15,
        featuredListingCredits: 0,
        usedListingCredits: 0,
        razorpayRouteInstantSettlements: false,
        prioritySocialPlacement: false,
        status: 'active',
        renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    return this.subscriptions[vendorId];
  }

  getAllSubscriptions(): VendorSubscription[] {
    return Object.values(this.subscriptions);
  }

  updateVendorSubscription(vendorId: string, tier: SubscriptionTier): VendorSubscription {
    const plan = SUBSCRIPTION_PLANS[tier];
    const sub: VendorSubscription = {
      vendorId,
      tier,
      tierName: plan.name,
      monthlyPrice: plan.monthlyPrice,
      commissionPct: plan.commissionPct,
      featuredListingCredits: plan.featuredListingCredits,
      usedListingCredits: 0,
      razorpayRouteInstantSettlements: plan.razorpayRouteInstantSettlements,
      prioritySocialPlacement: plan.prioritySocialPlacement,
      status: 'active',
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.subscriptions[vendorId] = sub;

    // Also update vendor commission override
    const vendor = this.vendors.find((v) => v.id === vendorId);
    if (vendor) {
      vendor.commissionOverridePct = plan.commissionPct;
    }

    return sub;
  }

  useFeaturedCredit(
    vendorId: string,
    listingId: string,
    type: 'event' | 'dining'
  ): { success: boolean; message: string; remainingCredits: number } {
    const sub = this.getVendorSubscription(vendorId);
    const available = sub.featuredListingCredits - sub.usedListingCredits;

    if (available <= 0) {
      return {
        success: false,
        message: 'No featured credits remaining this billing cycle. Please upgrade your subscription.',
        remainingCredits: 0,
      };
    }

    if (type === 'event') {
      const evt = this.events.find((e) => e.id === listingId);
      if (!evt) return { success: false, message: 'Event not found', remainingCredits: available };
      evt.isFeatured = true;
    } else {
      const rest = this.restaurants.find((r) => r.id === listingId);
      if (!rest) return { success: false, message: 'Restaurant not found', remainingCredits: available };
      rest.isFeatured = true;
    }

    sub.usedListingCredits += 1;
    return {
      success: true,
      message: 'Listing successfully boosted to Featured badge!',
      remainingCredits: sub.featuredListingCredits - sub.usedListingCredits,
    };
  }

  // Payout Reports & Settlements (Razorpay Route vs Manual Ledger)
  getPayoutRecords(vendorId?: string): PayoutRecord[] {
    if (vendorId) {
      return this.payouts.filter((p) => p.vendorId === vendorId);
    }
    return this.payouts;
  }

  createPayout(payout: PayoutRecord): void {
    this.payouts.unshift(payout);
  }

  processPayout(
    payoutId: string,
    method: 'razorpay_route' | 'manual_ledger_neft',
    transferRef?: string
  ): { success: boolean; message: string; payout?: PayoutRecord } {
    const payout = this.payouts.find((p) => p.id === payoutId);
    if (!payout) return { success: false, message: 'Payout record not found' };

    payout.status = 'transferred';
    payout.method = method;
    payout.processedAt = new Date().toISOString();

    if (method === 'razorpay_route') {
      payout.razorpayTransferId = transferRef || `trf_rzp_${Date.now()}`;
      return {
        success: true,
        message: `Settled ₹${payout.netPayoutAmount} via Razorpay Route Transfer (${payout.razorpayTransferId})`,
        payout,
      };
    } else {
      const utr = transferRef || `UTR-${new Date().getFullYear()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      return {
        success: true,
        message: `Settled ₹${payout.netPayoutAmount} via Manual Bank Ledger (NEFT UTR: ${utr})`,
        payout,
      };
    }
  }

  generatePayoutsForPeriod(period: string = 'Current Cycle'): PayoutRecord[] {
    // Generate new ledger payout calculations for all vendors from confirmed bookings
    const generated: PayoutRecord[] = [];

    for (const vendor of this.vendors) {
      // Find bookings for this vendor
      const vendorBookings = this.bookings.filter((b) => {
        if (b.status === 'refunded' || b.status === 'pending_payment') return false;
        if (b.bookingType === 'event') {
          const event = this.events.find((e) => e.id === b.eventId);
          return event?.vendorId === vendor.id;
        } else {
          const rest = this.restaurants.find((r) => r.id === b.restaurantId);
          return rest?.vendorId === vendor.id;
        }
      });

      const sub = this.getVendorSubscription(vendor.id);
      const commissionPct = vendor.commissionOverridePct || sub.commissionPct || this.settings.platformCommissionPct;

      const grossGMV = vendorBookings.reduce((sum, b) => sum + b.baseAmount, 0) + 18500; // baseline realistic volume
      const commissionDeducted = Math.round((grossGMV * commissionPct) / 100);
      const gatewayFeesDeducted = Math.round((grossGMV * 0.02)); // 2% gateway cost
      const netPayout = grossGMV - commissionDeducted - gatewayFeesDeducted;

      const record: PayoutRecord = {
        id: `pyt-run-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        vendorId: vendor.id,
        vendorName: vendor.businessName,
        period,
        grossBookingsGmv: grossGMV,
        commissionDeducted,
        gatewayFeesDeducted,
        netPayoutAmount: netPayout,
        status: 'pending',
        method: vendor.razorpayAccountId && this.settings.razorpayRouteEnabled ? 'razorpay_route' : 'manual_ledger_neft',
        bankAccountNumber: vendor.bankAccountNumber,
        bankIfsc: vendor.bankIfsc,
        createdAt: new Date().toISOString(),
      };

      this.payouts.unshift(record);
      generated.push(record);
    }

    return generated;
  }

  // Vendors
  getVendors(): Vendor[] {
    return this.vendors;
  }

  getVendorById(id: string): Vendor | undefined {
    return this.vendors.find((v) => v.id === id);
  }

  updateVendor(id: string, updates: Partial<Vendor>): boolean {
    const vendor = this.vendors.find((v) => v.id === id);
    if (vendor) {
      Object.assign(vendor, updates);
      return true;
    }
    return false;
  }

  submitVendorKyc(vendorId: string, data: Partial<Vendor>): boolean {
    const vendor = this.vendors.find((v) => v.id === vendorId);
    if (!vendor) return false;
    Object.assign(vendor, {
      ...data,
      kycStatus: 'pending_review',
      kycSubmittedAt: new Date().toISOString(),
      kycRejectionReason: undefined,
    });
    return true;
  }

  verifyVendorKyc(
    vendorId: string,
    status: 'verified' | 'rejected',
    rejectionReason?: string
  ): boolean {
    const vendor = this.vendors.find((v) => v.id === vendorId);
    if (!vendor) return false;
    if (status === 'verified') {
      vendor.isVerified = true;
      vendor.kycStatus = 'verified';
      vendor.kycVerifiedAt = new Date().toISOString();
      vendor.kycRejectionReason = undefined;
    } else {
      vendor.isVerified = false;
      vendor.kycStatus = 'rejected';
      vendor.kycRejectionReason = rejectionReason || 'KYC document verification failed. Please re-upload legible documents.';
    }
    return true;
  }

  updateListingModeration(
    type: 'event' | 'dining',
    id: string,
    status: ListingStatus
  ): boolean {
    if (type === 'event') {
      const evt = this.events.find((e) => e.id === id);
      if (evt) {
        evt.status = status;
        return true;
      }
    } else {
      const rest = this.restaurants.find((r) => r.id === id);
      if (rest) {
        rest.status = status;
        return true;
      }
    }
    return false;
  }

  // Executive Platform Revenue Summary
  getRevenueSummary(): RevenueSummary {
    const validBookings = this.bookings.filter((b) => b.status !== 'refunded');

    const grossGMV = validBookings.reduce((sum, b) => sum + b.totalAmount, 0) + 193800; // baseline platform GMV
    const convenienceFeeRevenue = validBookings.reduce((sum, b) => sum + b.convenienceFee, 0) + 14500;
    const commissionRevenue =
      validBookings.reduce((sum, b) => sum + Math.round((b.baseAmount * this.settings.platformCommissionPct) / 100), 0) +
      21400;

    const subscriptionRevenue = Object.values(this.subscriptions).reduce(
      (sum, s) => sum + (s.status === 'active' ? s.monthlyPrice : 0),
      0
    );

    const totalPlatformRevenue = commissionRevenue + convenienceFeeRevenue + subscriptionRevenue;

    const totalPayoutsDisbursed = this.payouts
      .filter((p) => p.status === 'transferred')
      .reduce((sum, p) => sum + p.netPayoutAmount, 0);

    const pendingPayouts = this.payouts
      .filter((p) => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, p) => sum + p.netPayoutAmount, 0);

    const totalRefundsAmount = this.refunds.reduce((sum, r) => sum + r.amount, 0);
    const activeSubscriptionsCount = Object.values(this.subscriptions).filter((s) => s.status === 'active').length;
    const featuredListingsCount =
      this.events.filter((e) => e.isFeatured).length + this.restaurants.filter((r) => r.isFeatured).length;

    return {
      grossGMV,
      totalPlatformRevenue,
      commissionRevenue,
      convenienceFeeRevenue,
      subscriptionRevenue,
      totalPayoutsDisbursed,
      pendingPayouts,
      totalRefundsAmount,
      activeSubscriptionsCount,
      featuredListingsCount,
    };
  }

  // Payments Tracking
  recordPayment(payment: PaymentRecord): void {
    const existingIdx = this.payments.findIndex((p) => p.paymentId === payment.paymentId);
    if (existingIdx >= 0) {
      this.payments[existingIdx] = payment;
    } else {
      this.payments.unshift(payment);
    }
  }

  getPayments(): PaymentRecord[] {
    return this.payments;
  }

  getPaymentByOrderId(orderId: string): PaymentRecord | undefined {
    return this.payments.find((p) => p.orderId === orderId);
  }

  // Social Discovery Tablemates
  getSocialAttendees(targetId: string, bookingDate: string): SocialDiscoveryProfile[] {
    return this.socialProfiles.filter(
      (p) => p.targetId === targetId && p.bookingDate === bookingDate
    );
  }

  // Admin Settings
  getSettings(): AdminSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<AdminSettings>): void {
    this.settings = { ...this.settings, ...updates };
  }

  // Active Role Simulation (for pair programming demo & switcher)
  getCurrentRole(): UserRole {
    return this.currentUserRole;
  }

  setCurrentRole(role: UserRole): void {
    this.currentUserRole = role;
  }

  getCurrentUser(): UserProfile {
    return DEMO_USERS[this.currentUserRole] || DEMO_USERS.customer;
  }

  // City Management
  getSelectedCity(): string {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dastan_selected_city');
      if (saved) return saved;
    }
    return 'Mumbai';
  }

  setSelectedCity(city: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dastan_selected_city', city);
      window.dispatchEvent(new CustomEvent('dastan_city_changed', { detail: { city } }));
    }
    const current = DEMO_USERS[this.currentUserRole];
    if (current) {
      current.city = city;
    }
  }

  // Payouts
  getPayouts(): PayoutRecord[] {
    return this.payouts;
  }
}

// Global Singleton to maintain hot-reload in dev
const globalForStore = global as unknown as { azaadStore?: AzaadDataStore };
export const store = globalForStore.azaadStore || new AzaadDataStore();
if (process.env.NODE_ENV !== 'production') globalForStore.azaadStore = store;
