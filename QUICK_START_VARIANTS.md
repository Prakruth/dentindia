# Quick Start: Using Service Variants

## For Patients

### How Variants Work

When you book a service like **Braces & Aligners**, you might see multiple options:

```
☐ Metal Wired                    ₹18,000
☐ Ceramic Self-Ligating          ₹35,000  
☐ Clear Aligners                 ₹45,000 – ₹85,000
```

**Select one option** → that price gets locked in your booking → confirmation shows what you chose.

### Live Examples

**Service Comparison → Booking → Confirmation Flow:**

1. **Search**: "Braces & Aligners"
2. **Compare**: See "3 variants available" on clinic card
3. **Price Range**: ₹18,000 – ₹85,000 (helps you know options exist)
4. **Book**: Click "Book Now" → selector appears
5. **Choose**: Pick "Clear Aligners" (₹45,000 – ₹85,000)
6. **Fill Form**: Name, email, date, etc.
7. **Confirm**: Booking shows "Option: Clear Aligners"

---

## For Developers: Adding Variants

### Step 1: Add to Data

```typescript
// lib/data.ts
{
  name: "Braces & Aligners",
  description: "Multiple orthodontic options available.",
  duration: "12–18 months",
  priceFrom: 18000,
  priceTo: 85000,  // NEW: indicates range
  variants: [      // NEW: list options
    {
      type: "Metal Wired",
      price: 18000,
      duration: "12–18 months"
    },
    {
      type: "Ceramic Self-Ligating",
      price: 35000,
      duration: "12–18 months"
    },
    {
      type: "Clear Aligners",
      priceMin: 45000,
      priceMax: 85000,
      duration: "6–12 months"
    }
  ]
}
```

### Step 2: Verify it Works

**Service Comparison Page:**
- ✅ Shows price range: "₹18,000 – ₹85,000"
- ✅ Shows indicator: "3 variants available"

**Booking Page:**
- ✅ Shows "Select Option" section with radio buttons
- ✅ Button disabled until variant selected
- ✅ Shows price for selected variant

**Confirmation Page:**
- ✅ Shows "Option: [selected variant name]"

### Step 3: No Other Changes Needed!

The UI automatically:
- Renders variant selector if `variants` exists
- Hides it if `variants` is undefined
- Validates form submission
- Saves selected variant with booking

---

## Variant Types

### Type 1: Fixed Price Variant
```typescript
{
  type: "Single Implant",
  price: 26000,
  duration: "3–4 months"
}
```
**Shows as**: ₹26,000

### Type 2: Price Range Variant
```typescript
{
  type: "Multiple Implants",
  priceMin: 50000,
  priceMax: 150000,
  duration: "4–6 months"
}
```
**Shows as**: ₹50,000 – ₹150,000

### Type 3: No Variants (Legacy Service)
```typescript
{
  name: "Consultation",
  priceFrom: 500,
  // No 'priceTo' or 'variants' field
}
```
**Works as**: Single option, no selector

---

## Database Schema

When user books with variant:

```json
{
  "id": "BOOK-1234567890",
  "clinic": "Sharma Dental Care",
  "service": "Braces & Aligners",
  "selectedVariant": "Clear Aligners",    // NEW FIELD
  "price": 45000,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "preferredDate": "2026-05-10",
  "preferredTime": "3:00 PM",
  "agreeToTerms": true,
  "createdAt": "2026-04-24T12:30:00Z"
}
```

**Stored in**: `localStorage.bookings` (JSON array)

---

## Files Changed

| File | Change |
|------|--------|
| `lib/data.ts` | Added `ServiceVariant` interface, added variants to 4 services |
| `app/services/[name]/page.tsx` | Display price range and variants count |
| `app/booking/page.tsx` | Added variant selector, form validation |
| `app/booking-confirmation/page.tsx` | Display selected variant in confirmation |

---

## Testing Checklist

- [ ] Go to `/services/Braces%20%26%20Aligners`
- [ ] See "3 variants available" on clinic card
- [ ] See price range "₹18,000 – ₹85,000"
- [ ] Click "Book Now"
- [ ] See "Select Option" section with 3 radio buttons
- [ ] Confirm button is disabled
- [ ] Click a variant radio button
- [ ] Confirm button becomes enabled
- [ ] Complete booking
- [ ] Confirmation page shows "Option: [your choice]"
- [ ] Download/print includes variant

---

## Common Questions

**Q: What if a service doesn't have variants?**
A: The selector doesn't appear. The form works normally. Booking proceeds without variant field.

**Q: Can variants have different durations?**
A: Yes! Each variant has its own duration. Example:
- Single-Sitting RCT: 60 min
- Multi-Visit RCT: 3–4 visits

**Q: Are variants required?**
A: Only if the service defines them. If no variants, booking works without selecting one.

**Q: Can I edit variants later?**
A: Not in MVP. Phase 2 will add clinic dashboard for editing.

**Q: Where's variant data stored?**
A: In `lib/data.ts` as hardcoded array. Phase 2 will move to database.

---

## Next Steps (Phase 2)

- [ ] Add variant editor to clinic dashboard
- [ ] Store variants in Supabase database
- [ ] Track variant popularity/analytics
- [ ] Allow time-based pricing variants
- [ ] Bundle variants together (e.g., package deals)
- [ ] Variant availability scheduling

---

## Live Demo

**Production URL**: https://dental-india.vercel.app

**Try this path**:
1. Search: "Braces & Aligners"
2. Click first clinic
3. See "3 variants available"
4. Click "Book Now"
5. Select a variant
6. Complete booking

---

**Feature Status**: ✅ Production Ready
**Last Updated**: 2026-04-24
**Version**: 1.0
