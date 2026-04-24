# Booking Flow Documentation

## Overview
Complete patient booking flow from service discovery → booking form → confirmation.

---

## Pages & Routes

### 1. **Service Discovery** (`/services`)
- Hero with service search bar
- City filters (Mumbai, Bangalore, Chennai, Delhi)
- Popular services grid with 12 unique services
- Real-time service filtering

**Entry Point:** Navbar "Compare Services" link

---

### 2. **Service Comparison Results** (`/services/[name]?city=...`)
- All clinics offering the selected service
- Service-specific pricing, ratings, and duration
- Sort options: Recommended, Price, Rating, Distance
- Filters: Min Rating (3.5+/4.0+/4.5+), Max Price slider
- Clinic cards showing:
  - Clinic name, doctor, overall rating
  - **Service-specific rating** (e.g., "Root Canal: 4.8/5 with 45 verified bookings")
  - Price for this service
  - Distance (km away)
  - Availability ("Today 3 PM")
  - **"Book Now" button** → redirects to booking form

---

### 3. **Booking Form** (`/booking?clinic=X&service=Y&price=Z`)
Collects patient details with the following fields:

#### Personal Information
- **First Name** (required)
- **Last Name** (required)
- **Email Address** (required, email validation)
- **Phone Number** (required, tel format)

#### Appointment Details
- **Preferred Date** (date picker, min today → max 30 days out)
- **Preferred Time** (dropdown with 8 time slots: 9 AM - 6 PM)
- **Additional Notes** (optional textarea for medical history/concerns)

#### Agreement
- Checkbox: Agree to terms & conditions

#### UI Features
- **Service Summary Card** at top showing:
  - Clinic name & doctor
  - Service name
  - Price & duration
- **Loading state** on submit button
- **Form validation** before submission
- **Disabled submit** until terms are checked

#### Data Storage
- Bookings saved to **localStorage** with:
  - Unique booking ID (`BOOK-{timestamp}`)
  - All form data
  - Clinic info
  - Service details
  - Timestamp

---

### 4. **Booking Confirmation** (`/booking-confirmation?id=BOOK-...`)

#### What's Displayed
1. **Success Banner** with checkmark animation
2. **Booking Reference ID** (copy-paste friendly, monospace font)
3. **Patient Information** section:
   - Name
   - Email
   - Phone
4. **Appointment Details** section:
   - Service name
   - Date & Time (formatted: "Tuesday, April 29, 2026 at 3:00 PM")
   - Service fee (₹ formatted with commas)
   - Notes (if provided)
5. **Clinic Information** section:
   - Clinic name
   - Timings
   - Status: "Confirmed"
   - Note: "Clinic will call within 2 hours"
6. **What's Next?** (3-step process):
   - Clinic will call to confirm
   - Review details on call
   - Arrive 10 minutes early

#### Action Buttons
- **Print Confirmation** → Opens print dialog
- **Download** → Downloads as .txt file
- **Book Another** → Back to service discovery

#### Info Card
- Reminder to check email or call clinic with questions

---

## Form Data Structure

```typescript
interface BookingFormData {
  firstName: string;      // "John"
  lastName: string;       // "Doe"
  email: string;          // "john@example.com"
  phone: string;          // "+91 98765 43210"
  preferredDate: string;  // "2026-04-29"
  preferredTime: string;  // "3:00 PM"
  notes: string;          // "Sensitive to pain"
  agreeToTerms: boolean;  // true
}
```

```typescript
interface Booking extends BookingFormData {
  id: string;              // "BOOK-1704067200000"
  clinic: string;          // "Sharma Dental Care"
  service: string;         // "Root Canal Treatment"
  price: number;           // 4500
  createdAt: string;       // ISO timestamp
}
```

---

## User Journey Example

```
1. User clicks "Compare Services" in navbar
   ↓ /services

2. User searches for "Root Canal" or clicks service card
   ↓ /services/Root%20Canal%20Treatment?city=Mumbai

3. User sees 4 clinics with prices: ₹4,500 → ₹5,000
   Filters by rating: 4.5+ only
   Sorts by price
   ↓

4. User clicks "Book Now" on their choice (Sharma Dental - ₹4,500)
   ↓ /booking?clinic=sharma-dental-mumbai&service=Root%20Canal%20Treatment&price=4500

5. User fills form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +91 98765 43210
   - Date: April 29, 2026
   - Time: 3:00 PM
   - Notes: "Sensitive to pain, past experience was good"
   - ✓ Agrees to terms
   ↓ Clicks "Confirm Booking"

6. Form submits (1.5s API simulation)
   ↓ Redirect to confirmation page

7. User sees confirmation:
   - Booking ID: BOOK-1704067200000
   - All details summary
   - Next steps: "Clinic will call within 2 hours"
   ↓

8. User can:
   - Print confirmation (browser print dialog)
   - Download as .txt file
   - Book another service
```

---

## Technical Details

### Storage
- **localStorage key:** `"bookings"`
- **Format:** JSON array of booking objects
- **Persistence:** Survives browser refresh, cleared on browser cache clear

### Validation
- Email: HTML5 email input type
- Phone: Tel input type
- Date: Min = today, Max = 30 days from now
- Time: Predefined dropdown options (no free text)
- Terms: Checkbox must be checked to submit

### Loading State
- Button shows spinner during form submission
- Submit disabled until terms agreed
- 1.5s simulated API call before redirect

### Responsive Design
- Mobile: Stacked form, full-width inputs
- Tablet: 2-column layout where appropriate
- Desktop: Same 2-column with better spacing

### Print-Friendly
- `@media print` CSS hides buttons and actions
- Prints booking details on white background
- Booking reference ID prominent and easy to scan

---

## Future Enhancements

1. **Email Notifications**
   - Send confirmation email to patient
   - SMS reminder day before appointment

2. **Payment Integration**
   - Accept advance payment
   - Show payment status on confirmation

3. **Clinic Dashboard**
   - Clinic views incoming bookings
   - Can confirm/reschedule
   - Calendar integration

4. **Real-Time Availability**
   - Pull actual available slots from clinic system
   - Show real-time calendar instead of "Today 3 PM" mock

5. **Cancellation & Rescheduling**
   - Allow patient to modify booking
   - Clinic can suggest alternatives

6. **Patient History**
   - Show past & upcoming bookings
   - One-click rebooking for same service

7. **Insurance & Payment Plans**
   - Show available payment options
   - Insurance coverage info

---

## Testing Checklist

- [ ] Navigate to /services
- [ ] Search for a service
- [ ] Filter by city
- [ ] Sort by price/rating/distance
- [ ] Click "Book Now" on a clinic card
- [ ] Form pre-fills clinic & service info
- [ ] Fill all form fields
- [ ] Try submitting without checking terms (should be disabled)
- [ ] Submit form
- [ ] See loading spinner
- [ ] Redirected to confirmation page
- [ ] Confirmation shows correct booking ID
- [ ] All details match form input
- [ ] Print button opens print dialog
- [ ] Download button downloads .txt file
- [ ] "Book Another" navigates back to /services
- [ ] Refresh confirmation page - data still there (from localStorage)

