# Commission & Revenue Tracking Model

## Current Implementation

### What's Tracked (localStorage)
Each booking stores:
```javascript
{
  id: "BOOK-1704067200000",           // Unique booking ID
  clinic: "Sharma Dental Care",       // Clinic name
  service: "Root Canal Treatment",    // Service name
  price: 4500,                        // Service price (₹)
  firstName: "John",                  // Patient first name
  lastName: "Doe",                    // Patient last name
  email: "john@example.com",          // Patient email
  phone: "+91 98765 43210",           // Patient phone
  preferredDate: "2026-04-29",        // Appointment date
  preferredTime: "3:00 PM",           // Appointment time
  notes: "Sensitive to pain",         // Patient notes
  agreeToTerms: true,                 // Consent
  createdAt: "2026-04-24T10:30:00Z"   // Booking timestamp
}
```

### How to Extract Revenue Data
```javascript
// Get all bookings
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

// Calculate total revenue
const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
console.log(`Total Revenue: ₹${totalRevenue.toLocaleString()}`);

// Group by clinic
const byClinic = bookings.reduce((acc, b) => {
  acc[b.clinic] = (acc[b.clinic] || 0) + b.price;
  return acc;
}, {});
console.log('Revenue by Clinic:', byClinic);

// Group by service
const byService = bookings.reduce((acc, b) => {
  acc[b.service] = (acc[b.service] || 0) + b.price;
  return acc;
}, {});
console.log('Revenue by Service:', byService);

// Count by clinic
const countByClinic = bookings.reduce((acc, b) => {
  acc[b.clinic] = (acc[b.clinic] || 0) + 1;
  return acc;
}, {});
console.log('Bookings by Clinic:', countByClinic);
```

---

## Revenue Model Options

### Option 1: Fixed Commission per Booking (RECOMMENDED FOR START)
**Commission:** ₹500 per booking regardless of service price

**Calculation:**
```
Bookings = 10
Commission per booking = ₹500
DentIndia Revenue = 10 × ₹500 = ₹5,000
```

**Pros:**
- ✅ Simple to calculate
- ✅ Predictable for clinics
- ✅ Fair for all services
- ✅ Easy to track

**Cons:**
- ❌ Doesn't scale with service price
- ❌ Low revenue on cheap services
- ❌ High cost for clinics on expensive services

---

### Option 2: Percentage Commission (MOST COMMON)
**Commission:** 15% of service price

**Calculation:**
```
Booking 1: Root Canal ₹4,500 → Commission = 15% = ₹675
Booking 2: Consultation ₹500 → Commission = 15% = ₹75
Booking 3: Implant ₹25,000 → Commission = 15% = ₹3,750

Total Revenue = ₹675 + ₹75 + ₹3,750 = ₹4,500
```

**Pros:**
- ✅ Scales with service price
- ✅ Fair for both cheap & expensive services
- ✅ Industry standard (15-20%)
- ✅ Incentivizes high-value bookings

**Cons:**
- ❌ Complex calculation
- ❌ Clinics may prefer lower percentage
- ❌ Lower revenue on cheap services

---

### Option 3: Tiered Commission
**Different percentages based on service price**

**Structure:**
- Services < ₹1,000: 10% commission
- Services ₹1,000 - ₹10,000: 15% commission
- Services > ₹10,000: 20% commission

**Calculation:**
```
Booking 1: Cleaning ₹800 → 10% = ₹80
Booking 2: Root Canal ₹4,500 → 15% = ₹675
Booking 3: Implant ₹25,000 → 20% = ₹5,000

Total Revenue = ₹80 + ₹675 + ₹5,000 = ₹5,755
```

**Pros:**
- ✅ Rewards high-value bookings
- ✅ Fair for affordable services
- ✅ Incentivizes clinic participation
- ✅ Market-aligned

**Cons:**
- ❌ Complex calculation
- ❌ Requires rule maintenance
- ❌ Harder to explain to clinics

---

### Option 4: Hybrid Model (RECOMMENDED FOR SCALE)
**Fixed commission PLUS percentage above threshold**

**Structure:**
- Base: ₹300 fixed per booking
- Plus: 10% of amount above ₹2,000

**Calculation:**
```
Booking 1: Consultation ₹500 → ₹300 (no overflow)
Booking 2: Root Canal ₹4,500 → ₹300 + 10% of (4500-2000) = ₹300 + ₹250 = ₹550
Booking 3: Implant ₹25,000 → ₹300 + 10% of (25000-2000) = ₹300 + ₹2,300 = ₹2,600

Total Revenue = ₹300 + ₹550 + ₹2,600 = ₹3,450
```

**Pros:**
- ✅ Guaranteed minimum per booking
- ✅ Scales with high-value services
- ✅ Balances volume & value
- ✅ Easy for clinics to understand

**Cons:**
- ❌ Slightly complex formula
- ❌ Needs clear communication

---

## Sample Revenue Projection

### Current Data: 4 Clinics, ~80+ Services

**Scenario: 100 bookings in first month**

Using **Option 2 (15% percentage):**

#### By Service
```
Consultation (10 bookings): 
  10 × ₹500 × 15% = ₹750

Root Canal (15 bookings):
  15 × ₹4,500 × 15% = ₹10,125

Teeth Whitening (8 bookings):
  8 × ₹6,500 × 15% = ₹7,800

Dental Implants (5 bookings):
  5 × ₹27,000 × 15% = ₹20,250

Scaling & Polishing (12 bookings):
  12 × ₹900 × 15% = ₹1,620

Braces & Aligners (20 bookings):
  20 × ₹18,000 × 15% = ₹54,000

Other services (30 bookings):
  30 × ₹5,000 × 15% = ₹22,500

TOTAL MONTH 1: ₹117,045
Average per booking: ₹1,170
```

#### Revenue Growth
```
Month 1: 100 bookings → ₹117,045
Month 2: 200 bookings → ₹234,090 (2x growth)
Month 3: 350 bookings → ₹409,658 (2.5x growth)
Month 6: 800 bookings → ₹936,420 (6x growth)
Month 12: 2000 bookings → ₹2,341,050 (12x growth)
```

---

## Implementation: Backend Revenue Tracking

### What We Need (Future)

**1. Booking Status Tracking**
```typescript
enum BookingStatus {
  REQUESTED = "requested",      // Patient submitted form
  CONFIRMED = "confirmed",      // Clinic confirmed
  COMPLETED = "completed",       // Appointment happened
  PAID = "paid",                // Payment received
  CANCELLED = "cancelled"       // Cancelled by either party
}
```

**2. Payment Status**
```typescript
enum PaymentStatus {
  PENDING = "pending",          // Waiting for clinic/patient to pay
  PROCESSING = "processing",    // Payment in progress
  COMPLETED = "completed",      // Payment done
  REFUNDED = "refunded"         // Refund issued
}
```

**3. Commission Calculation**
```typescript
interface CommissionRecord {
  id: string;
  bookingId: string;
  clinic: string;
  clinicId: string;
  service: string;
  servicePrice: number;
  commissionRate: number;        // 0.15 for 15%
  commissionAmount: number;      // Calculated
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  timestamp: Date;
}
```

---

## Dashboard Reporting (Future)

### Admin Dashboard Metrics
```
┌─────────────────────────────────────┐
│ DentIndia Revenue Dashboard          │
├─────────────────────────────────────┤
│ Total Bookings: 2,543               │
│ Total Revenue: ₹2,985,401           │
│ Average Commission: ₹1,175           │
│ Month-over-Month Growth: +45%        │
└─────────────────────────────────────┘

By Clinic:
┌──────────────────────┬─────────────┬──────────┐
│ Clinic               │ Bookings    │ Revenue  │
├──────────────────────┼─────────────┼──────────┤
│ Sharma Dental        │ 892         │ ₹1,047k  │
│ Smile Studio         │ 645         │ ₹756k    │
│ Capital Smiles       │ 589         │ ₹690k    │
│ Apollo Dental        │ 417         │ ₹492k    │
└──────────────────────┴─────────────┴──────────┘

By Service:
┌──────────────────────┬─────────────┬──────────┐
│ Service              │ Bookings    │ Revenue  │
├──────────────────────┼─────────────┼──────────┤
│ Root Canal           │ 487         │ ₹856k    │
│ Dental Implants      │ 234         │ ₹623k    │
│ Braces & Aligners    │ 456         │ ₹1,234k  │
│ Teeth Whitening      │ 345         │ ₹540k    │
└──────────────────────┴─────────────┴──────────┘
```

### Clinic Dashboard Metrics
```
Your Clinic: Sharma Dental Care
┌─────────────────────────────────────┐
│ Total Bookings: 892                 │
│ Confirmed Appointments: 756 (85%)   │
│ Pending Confirmation: 136 (15%)     │
│ Top Service: Root Canal (234 books) │
│ Average Booking Value: ₹1,173       │
└─────────────────────────────────────┘

Service Performance:
┌──────────────────────┬─────────────┐
│ Service              │ Bookings    │
├──────────────────────┼─────────────┤
│ Root Canal           │ 234         │
│ Consultation         │ 178         │
│ Teeth Whitening      │ 156         │
│ Scaling & Polishing  │ 142         │
│ Dental Implants      │ 94          │
└──────────────────────┴─────────────┘

Upcoming Appointments: 24
Next 7 days: 12 appointments
```

---

## Payout Model (Future)

### Current Implementation
✅ Bookings tracked in localStorage
❌ No payment processing yet

### Payment Flow (To Build)
```
Patient books appointment
    ↓
DentIndia collects commission
    ↓
Clinic confirms appointment
    ↓
Patient completes appointment (or pays in clinic)
    ↓
Status updated to "COMPLETED"
    ↓
Monthly payout report generated
    ↓
Clinic paid amount due
    ↓
DentIndia retains commission
```

### Sample Payout Calculation
```
Month: April 2026
Total Bookings Completed: 245

By Clinic:
1. Sharma Dental Care
   Bookings: 89 × avg ₹4,200 = ₹373,800 gross
   Commission @ 15%: ₹56,070
   Clinic receives: ₹373,800

2. Smile Studio
   Bookings: 78 × avg ₹5,100 = ₹397,800 gross
   Commission @ 15%: ₹59,670
   Clinic receives: ₹397,800

3. Capital Smiles
   Bookings: 56 × avg ₹3,800 = ₹212,800 gross
   Commission @ 15%: ₹31,920
   Clinic receives: ₹212,800

4. Apollo Dental
   Bookings: 22 × avg ₹6,500 = ₹143,000 gross
   Commission @ 15%: ₹21,450
   Clinic receives: ₹143,000

TOTAL DENTINDIA COMMISSION: ₹169,110
```

---

## Tax & Legal Considerations

### GST (India)
- Commission is liable for GST (currently 18%)
- Invoice issued to clinics
- Keep records for compliance

### Revenue Recognition (Accounting)
- Recognition timing: When booking confirmed or payment received?
- Cancellation policy: How to handle refunds?
- Accrual vs Cash basis reporting

### Terms of Service
- Clear commission percentage stated
- Payment terms (Net 15, Net 30, etc.)
- Cancellation & refund policy
- Dispute resolution

---

## Going Forward

### Next Steps
1. Decide commission model (recommend Option 2: 15%)
2. Build backend API to track bookings
3. Implement payment processing (Razorpay, Stripe, etc.)
4. Create admin dashboard
5. Create clinic dashboard
6. Set up monthly payout automation
7. Generate detailed reports

### Immediate Actions
- [ ] Confirm commission model
- [ ] Set competitive rates vs competitors
- [ ] Define clinic tier pricing (if any)
- [ ] Draft terms of service
- [ ] Plan payment integration

