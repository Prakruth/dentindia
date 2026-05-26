# Analytics Implementation Guide

## Overview

Comprehensive Google Analytics 4 (GA4) event tracking has been implemented across the Dentobook platform to track business-critical user actions and enable data-driven decision making.

**Measurement ID:** `G-B457NT367Q`

---

## 📊 What's Being Tracked

### 1. **Search & Discovery Events** 🔍

| Event | Trigger | Parameters | Business Value |
|-------|---------|------------|----------------|
| `search_initiated` | User searches for a service | `search_term`, `location` | Understand user intent, identify service demand |
| `search_results_viewed` | Search results displayed | `search_term`, `result_count` | Measure search quality and relevance |
| `search_filter_applied` | User applies filter (city, sort, price, rating) | `filter_type`, `filter_value` | Optimize filtering UX |
| `clinic_card_clicked` | Clinic card clicked from any list | `clinic_id`, `clinic_name`, `position_in_list`, `source` | Measure clinic visibility and CTR |

### 2. **Clinic Engagement Events** 🏥

| Event | Trigger | Parameters | Business Value |
|-------|---------|------------|----------------|
| `clinic_viewed` | Clinic detail page loaded | `clinic_id`, `clinic_name`, `city`, `referrer_source` | Track clinic page views and traffic sources |
| `phone_clicked` | User clicks phone number | `clinic_id`, `clinic_name` | **High-intent lead** - user wants to call |
| `call_initiated` | Phone call link clicked | `clinic_id`, `source_page` | Track call conversions by page |
| `directions_clicked` | User requests directions | `clinic_id`, `clinic_name` | Intent to visit physically |
| `generate_lead` | Any contact action (phone/WhatsApp/email) | `clinic_id`, `lead_source` | Universal lead generation tracking |

### 3. **Booking Funnel Events** 📅 **(CRITICAL)**

| Event | Trigger | Parameters | Business Value |
|-------|---------|------------|----------------|
| `booking_initiated` | "Book Now" button clicked | `clinic_id`, `service_name`, `price` | Top of booking funnel |
| `booking_step_N_completed` | Each step in booking flow | `step`, `step_number`, custom data | Identify drop-off points |
| `booking_submitted` | Booking form submitted | `clinic_id`, `service_name`, `booking_value`, `payment_method`, `currency` | Near-conversion tracking |
| `booking_confirmed` | Booking successfully confirmed | `booking_id`, `confirmation_number`, `value`, `currency` | **Conversion event** |
| `booking_abandoned` | User leaves booking flow | `step_abandoned`, `time_spent_seconds`, `reason` | Analyze abandonment patterns |

### 4. **GA4 Ecommerce Events** 💰 **(REVENUE TRACKING)**

| Event | Trigger | Parameters | Business Value |
|-------|---------|------------|----------------|
| `add_to_cart` | Service added to cart | `currency`, `value`, `items[]` | Track intent |
| `begin_checkout` | Checkout process started | `currency`, `value`, `items[]` | Funnel entry point |
| `purchase` | **Transaction completed** | `transaction_id`, `currency`, `value`, `items[]`, `payment_type` | **Revenue attribution** |

### 5. **Service Comparison Events** 📊

| Event | Trigger | Parameters | Business Value |
|-------|---------|------------|----------------|
| `compare_services_clicked` | User clicks compare button | `service_name` | Feature adoption |
| `clinic_added_to_comparison` | Clinic added to comparison | `clinic_id`, `clinic_name` | Comparison behavior |
| `comparison_page_viewed` | Comparison page loaded | `clinics_compared`, `clinic_count`, `service_type` | Decision-making insights |
| `compare_to_booking` | Booking from comparison page | `winning_clinic_id` | Identify winning factors |

### 6. **User Account Events** 👤

| Event | Trigger | Parameters | Business Value |
|-------|---------|------------|----------------|
| `registration_started` | User begins registration | `user_type` | Track acquisition funnel start |
| `registration_completed` | Registration successful | `user_type`, `registration_method` | **User acquisition conversion** |
| `login_attempt` | Login button clicked | `method` | Track login activity |
| `login` (GA4 standard) | Successful login | `method`, `user_type` | Session tracking |
| `login_failed` | Login fails | `error_reason` | Identify auth issues |

### 7. **Error Tracking** ⚠️

| Event | Trigger | Parameters | Business Value |
|-------|---------|------------|----------------|
| `api_error` | API request fails | `endpoint`, `error_code`, `error_message` | Identify technical issues |
| `form_error` | Form validation fails | `form_name`, `errors` | Improve form UX |
| `booking_failed` / `payment_failed` | Transaction errors | `reason`, `amount`, `clinic_id` | **Revenue loss prevention** |

---

## 🎯 Key Metrics You Can Now Track

### Conversion Metrics
- **Booking Conversion Rate:** `bookings / clinic_views × 100`
- **Search-to-Book Rate:** `bookings / searches × 100`
- **Clinic Call Rate:** `phone_clicks / clinic_views × 100`
- **Lead Generation Rate:** `leads / total_sessions × 100`

### Revenue Metrics
- **Average Booking Value (ABV):** `total_revenue / bookings`
- **Revenue Per Session:** `total_revenue / sessions`
- **Revenue by Service Type:** Group by `service_name`
- **Revenue by City:** Group by `city`

### Funnel Metrics
- **Drop-off by Step:** `users_at_step_N / users_at_step_N-1`
- **Time to Book:** Average time from first visit to booking
- **Abandonment Rate:** `abandoned_bookings / booking_initiated`

### User Metrics
- **User Acquisition Cost (UAC):** `marketing_spend / registrations_completed`
- **Registration Conversion Rate:** `registrations_completed / registrations_started`
- **Login Success Rate:** `login_success / login_attempt`

---

## 📂 Implementation Files

### Core Analytics Library
- **`lib/analytics.ts`** - All tracking functions with TypeScript types

### Pages with Tracking

#### Home Page
- **File:** `components/HomePageClient.tsx`
- **Events:**
  - `search_initiated` - When user selects a service
  - `search_results_viewed` - When results are filtered
  - `search_filter_applied` - City filter changes

#### Service Comparison Page
- **File:** `components/ServiceComparisonClient.tsx`
- **Events:**
  - `comparison_page_viewed` - Page load
  - `search_filter_applied` - Sort/rating/price filters
  - `clinic_card_clicked` - Clinic card clicks with position
  - `booking_initiated` - "Book Now" clicks

#### Clinic Detail Page
- **File:** `components/ClinicPageClient.tsx`
- **Events:**
  - `clinic_viewed` - Page view with referrer
  - `phone_clicked` - Phone number clicks
  - `call_initiated` - Phone link clicks
  - `generate_lead` - Phone/WhatsApp/Email clicks

#### Authentication Pages
- **Files:** `app/login/page.tsx`, `app/register/page.tsx`
- **Events:**
  - `registration_started` - User begins typing in registration form
  - `registration_completed` - Successful registration
  - `login_attempt` - Login submission
  - `login` - Successful login
  - `login_failed` - Failed login with reason
  - `form_error` - Validation errors
  - `api_error` - Server errors

---

## 🔧 How to Use the Analytics Functions

### Example: Track a Custom Event

```typescript
import { trackBookingInitiated } from '@/lib/analytics';

const handleBookNowClick = () => {
  trackBookingInitiated(clinicId, serviceName, price);
  // ... rest of booking logic
};
```

### Example: Track an Error

```typescript
import { trackError } from '@/lib/analytics';

try {
  await submitBooking();
} catch (error) {
  trackError('booking_failed', {
    clinic_id: clinicId,
    reason: error.message,
  });
}
```

---

## 📈 Where to View Data in Google Analytics

### Real-time Tracking
**Google Analytics → Reports → Realtime**
- See live events as they happen
- Verify tracking is working

### Event Reports
**Google Analytics → Reports → Engagement → Events**
- All custom events
- Event count, users, conversion rate

### Conversion Tracking
**Google Analytics → Configure → Events**
- Mark events as conversions:
  - `purchase` ✅
  - `booking_confirmed` ✅
  - `registration_completed` ✅
  - `generate_lead` ✅

### Revenue Reports
**Google Analytics → Reports → Monetization → Ecommerce purchases**
- Total revenue
- Transaction count
- Average purchase value
- Revenue by item (service)

### Funnel Analysis
**Google Analytics → Explore → Funnel Exploration**
- Create custom booking funnel:
  1. `booking_initiated`
  2. `booking_step_1_completed`
  3. `booking_step_2_completed`
  4. `booking_step_3_completed`
  5. `booking_confirmed`

### User Flow
**Google Analytics → Explore → Path Exploration**
- Visualize user journeys
- Identify common paths to conversion

---

## 🎓 Next Steps

### Immediate Actions
1. ✅ Mark key events as conversions in GA4
2. ✅ Set up custom reports for key metrics
3. ✅ Create booking funnel visualization
4. ✅ Set up alerts for error spikes

### Future Enhancements
- Add scroll depth tracking
- Track video engagement (if added)
- Track mobile vs desktop behavior
- Add A/B testing event parameters
- Implement user properties (lifetime value, etc.)

### Integration Opportunities
- **Google Ads:** Import conversions for campaign optimization
- **Search Console:** Connect for search query insights
- **BigQuery:** Export for advanced analysis
- **Looker Studio:** Build custom dashboards

---

## 🔒 Privacy & Compliance

- ✅ No PII (Personally Identifiable Information) is tracked
- ✅ User IDs are anonymized by GA4
- ✅ IP addresses are anonymized
- ⚠️ Consider adding cookie consent banner (future)
- ⚠️ Review data retention settings in GA4

---

## 📞 Support

For questions about analytics implementation, contact your development team or refer to:
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9267735)
- Project file: `lib/analytics.ts` for all tracking functions
