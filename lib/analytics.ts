// Google Analytics Event Tracking
// Typed event tracking for business-critical user actions

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// Helper to send events to GA4
const sendEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// ===== SEARCH & DISCOVERY EVENTS =====

export const trackSearchInitiated = (searchTerm: string, location?: string) => {
  sendEvent('search_initiated', {
    search_term: searchTerm,
    location: location || 'not_specified',
  });
};

export const trackSearchResults = (searchTerm: string, resultCount: number) => {
  sendEvent('search_results_viewed', {
    search_term: searchTerm,
    result_count: resultCount,
  });
};

export const trackFilterApplied = (filterType: string, filterValue: string) => {
  sendEvent('search_filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
  });
};

export const trackClinicCardClick = (
  clinicId: string,
  clinicName: string,
  position: number,
  source?: string
) => {
  sendEvent('clinic_card_clicked', {
    clinic_id: clinicId,
    clinic_name: clinicName,
    position_in_list: position,
    source: source || 'unknown',
  });
};

// ===== CLINIC ENGAGEMENT EVENTS =====

export const trackClinicViewed = (
  clinicId: string,
  clinicName: string,
  city: string,
  referrerSource?: string
) => {
  sendEvent('clinic_viewed', {
    clinic_id: clinicId,
    clinic_name: clinicName,
    city: city,
    referrer_source: referrerSource || document.referrer || 'direct',
  });
};

export const trackPhoneClick = (clinicId: string, clinicName: string) => {
  sendEvent('phone_clicked', {
    clinic_id: clinicId,
    clinic_name: clinicName,
    event_category: 'engagement',
    event_label: 'high_intent',
  });
};

export const trackDirectionsClick = (clinicId: string, clinicName: string) => {
  sendEvent('directions_clicked', {
    clinic_id: clinicId,
    clinic_name: clinicName,
    event_category: 'engagement',
  });
};

export const trackGalleryView = (clinicId: string, imageIndex: number) => {
  sendEvent('gallery_image_viewed', {
    clinic_id: clinicId,
    image_index: imageIndex,
  });
};

export const trackReviewsViewed = (clinicId: string) => {
  sendEvent('reviews_section_viewed', {
    clinic_id: clinicId,
  });
};

// ===== BOOKING FUNNEL EVENTS =====

export const trackBookingInitiated = (
  clinicId: string,
  serviceName: string,
  price?: number
) => {
  sendEvent('booking_initiated', {
    clinic_id: clinicId,
    service_name: serviceName,
    price: price || 0,
    event_category: 'booking_funnel',
  });
};

export const trackBookingStepCompleted = (
  step: string,
  stepNumber: number,
  additionalData?: Record<string, any>
) => {
  sendEvent(`booking_step_${stepNumber}_completed`, {
    step: step,
    step_number: stepNumber,
    ...additionalData,
  });
};

export const trackBookingSubmitted = (
  clinicId: string,
  serviceName: string,
  bookingValue: number,
  paymentMethod?: string
) => {
  sendEvent('booking_submitted', {
    clinic_id: clinicId,
    service_name: serviceName,
    booking_value: bookingValue,
    payment_method: paymentMethod || 'not_specified',
    currency: 'INR',
    event_category: 'booking_funnel',
  });
};

export const trackBookingConfirmed = (
  bookingId: string,
  confirmationNumber: string,
  value: number
) => {
  sendEvent('booking_confirmed', {
    booking_id: bookingId,
    confirmation_number: confirmationNumber,
    value: value,
    currency: 'INR',
    event_category: 'conversion',
  });
};

export const trackBookingAbandoned = (
  step: string,
  timeSpent: number,
  reason?: string
) => {
  sendEvent('booking_abandoned', {
    step_abandoned: step,
    time_spent_seconds: timeSpent,
    abandonment_reason: reason || 'unknown',
    event_category: 'booking_funnel',
  });
};

// ===== GA4 ECOMMERCE EVENTS (Revenue Tracking) =====

export const trackAddToCart = (
  serviceName: string,
  price: number,
  clinicId: string,
  clinicName: string
) => {
  sendEvent('add_to_cart', {
    currency: 'INR',
    value: price,
    items: [
      {
        item_id: `${clinicId}_${serviceName.toLowerCase().replace(/\s+/g, '_')}`,
        item_name: serviceName,
        item_category: 'dental_service',
        item_brand: clinicName,
        price: price,
        quantity: 1,
      },
    ],
  });
};

export const trackBeginCheckout = (
  items: Array<{
    serviceName: string;
    price: number;
    clinicId: string;
    clinicName: string;
  }>
) => {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  sendEvent('begin_checkout', {
    currency: 'INR',
    value: totalValue,
    items: items.map((item) => ({
      item_id: `${item.clinicId}_${item.serviceName.toLowerCase().replace(/\s+/g, '_')}`,
      item_name: item.serviceName,
      item_category: 'dental_service',
      item_brand: item.clinicName,
      price: item.price,
      quantity: 1,
    })),
  });
};

export const trackPurchase = (
  transactionId: string,
  value: number,
  items: Array<{
    serviceName: string;
    price: number;
    clinicId: string;
    clinicName: string;
  }>,
  paymentMethod?: string
) => {
  sendEvent('purchase', {
    transaction_id: transactionId,
    currency: 'INR',
    value: value,
    payment_type: paymentMethod || 'not_specified',
    items: items.map((item) => ({
      item_id: `${item.clinicId}_${item.serviceName.toLowerCase().replace(/\s+/g, '_')}`,
      item_name: item.serviceName,
      item_category: 'dental_service',
      item_brand: item.clinicName,
      price: item.price,
      quantity: 1,
    })),
  });
};

// ===== SERVICE COMPARISON EVENTS =====

export const trackCompareServicesClicked = (serviceName: string) => {
  sendEvent('compare_services_clicked', {
    service_name: serviceName,
  });
};

export const trackClinicAddedToComparison = (clinicId: string, clinicName: string) => {
  sendEvent('clinic_added_to_comparison', {
    clinic_id: clinicId,
    clinic_name: clinicName,
  });
};

export const trackComparisonViewed = (
  clinicsCompared: string[],
  serviceType: string
) => {
  sendEvent('comparison_page_viewed', {
    clinics_compared: clinicsCompared.join(','),
    clinic_count: clinicsCompared.length,
    service_type: serviceType,
  });
};

export const trackCompareToBooking = (winningClinicId: string) => {
  sendEvent('compare_to_booking', {
    winning_clinic_id: winningClinicId,
    event_category: 'conversion',
  });
};

// ===== USER ACCOUNT EVENTS =====

export const trackRegistrationStarted = (userType: 'patient' | 'clinic_staff') => {
  sendEvent('registration_started', {
    user_type: userType,
  });
};

export const trackRegistrationCompleted = (
  userType: 'patient' | 'clinic_staff',
  method: string
) => {
  sendEvent('registration_completed', {
    user_type: userType,
    registration_method: method,
    event_category: 'user_acquisition',
  });
};

export const trackLoginAttempt = (method: 'email' | 'social') => {
  sendEvent('login_attempt', {
    method: method,
  });
};

export const trackLoginSuccess = (userType: string) => {
  sendEvent('login', {
    method: 'email',
    user_type: userType,
  });
};

export const trackLoginFailed = (errorReason: string) => {
  sendEvent('login_failed', {
    error_reason: errorReason,
  });
};

// ===== ERROR TRACKING =====

export const trackError = (
  errorType: 'api_error' | 'booking_failed' | 'payment_failed' | 'form_error',
  errorDetails: Record<string, any>
) => {
  sendEvent(errorType, {
    ...errorDetails,
    event_category: 'error',
    timestamp: new Date().toISOString(),
  });
};

// ===== LEAD GENERATION =====

export const trackLeadGenerated = (clinicId: string, leadSource: string) => {
  sendEvent('generate_lead', {
    clinic_id: clinicId,
    lead_source: leadSource,
    currency: 'INR',
    value: 0,
  });
};

export const trackCallInitiated = (clinicId: string, sourcePage: string) => {
  sendEvent('call_initiated', {
    clinic_id: clinicId,
    source_page: sourcePage,
    event_category: 'lead_generation',
  });
};
