# Quick Reference Card

## 🚀 Getting Started

```bash
npm run dev
# Open http://localhost:3000
```

---

## 📍 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Clinic-based home (existing) |
| `/services` | **NEW** Service discovery |
| `/services/[name]` | **NEW** Clinic comparison for service |
| `/booking?clinic=X&service=Y` | **NEW** Booking form |
| `/booking-confirmation?id=X` | **NEW** Confirmation page |

---

## 🧪 Quick Test

### 1. Service Discovery
```
http://localhost:3000/services
- Click "Root Canal Treatment"
```

### 2. Compare Clinics
```
http://localhost:3000/services/Root%20Canal%20Treatment?city=Mumbai
- See 4 clinics with prices
- Sort by price/rating
- Filter by max price
```

### 3. Book Now
```
Click "Book Now" on any clinic
- Fill: John | Doe | john@example.com | +91 98765 43210
- Select date & time
- Check terms
- Submit
```

### 4. Confirmation
```
See booking receipt
- Booking ID: BOOK-{timestamp}
- Print / Download / Book Another
```

---

## 📊 Current Data

### 4 Clinics
- 👩‍⚕️ Sharma Dental Care (Mumbai)
- 👨‍⚕️ Smile Studio (Bangalore)
- 👩‍⚕️ Apollo Dental (Chennai)
- 👨‍⚕️ Capital Smiles (Delhi)

### 12 Services
Consultation, Root Canal, Implants, Braces, Whitening, Scaling, Extraction, Smile Design, Dentures, Crowns, Laser Gum, Gum Surgery

### Service-Specific Ratings
Each clinic has different ratings for each service (e.g., Root Canal 4.8/5 with 45 bookings)

---

## 💾 Data Storage

### View Bookings
```javascript
// In browser console (F12)
JSON.parse(localStorage.getItem('bookings'))
```

### Clear Bookings
```javascript
localStorage.removeItem('bookings')
```

### Add Test Booking
```javascript
const booking = {
  id: `BOOK-${Date.now()}`,
  clinic: "Test Clinic",
  service: "Test Service",
  price: 5000,
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "+91 98765 43210",
  preferredDate: "2026-05-01",
  preferredTime: "10:00 AM",
  notes: "",
  agreeToTerms: true,
  createdAt: new Date().toISOString()
};
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
bookings.push(booking);
localStorage.setItem('bookings', JSON.stringify(bookings));
```

---

## 📝 Form Fields

**Required:**
- First Name
- Last Name
- Email (validated)
- Phone (tel format)
- Preferred Date (next 30 days)
- Preferred Time (8 slots)
- Terms checkbox

**Optional:**
- Additional Notes

---

## 🎨 Styling

### Colors
- **Primary:** Blue-600 (buttons)
- **Secondary:** Teal-600 (clinic home)
- **Neutral:** Stone-* (backgrounds)
- **Success:** Green-500 (confirmation)

### Components
- Input: Stone-200 border, blue-400 focus
- Button: Blue-600, hover:blue-700
- Card: White bg, stone-200 border, rounded-2xl

---

## 🔄 Data Flow

```
/services (search)
    ↓
/services/[name]?city=X (compare)
    ↓
/booking?clinic=Y&service=Z (form)
    ↓
localStorage.setItem('bookings', [...])
    ↓
/booking-confirmation?id=BOOK-X (receipt)
```

---

## 💰 Revenue Tracking

### Current Model
**15% commission on service price**

### Example
- Root Canal ₹4,500 → Commission ₹675
- Consultation ₹500 → Commission ₹75
- Implant ₹25,000 → Commission ₹3,750

### Extract Revenue
```javascript
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
const revenue = bookings.reduce((sum, b) => sum + (b.price * 0.15), 0);
console.log(`Total Commission: ₹${revenue.toLocaleString()}`);
```

---

## ✅ Features Implemented

- ✅ Service discovery & search
- ✅ Multi-city filtering
- ✅ Service comparison (all clinics for one service)
- ✅ Clinic cards with prices & ratings
- ✅ Sort: Recommended, Price, Rating, Distance
- ✅ Filter: Min Rating, Max Price
- ✅ Booking form (6 required fields + optional notes)
- ✅ Form validation (HTML5)
- ✅ Confirmation page with receipt
- ✅ Print confirmation
- ✅ Download as file
- ✅ Data persistence (localStorage)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Service-specific ratings per clinic

---

## ❌ Not Yet Implemented

- ❌ Backend/Database
- ❌ Real clinic availability
- ❌ Email/SMS notifications
- ❌ Payment processing
- ❌ User accounts
- ❌ Clinic dashboard
- ❌ Admin dashboard

---

## 📚 Documentation

| File | Content |
|------|---------|
| `WIREFRAME.md` | Visual flow, mockups, PM insights |
| `BOOKING_FLOW.md` | Complete user journey |
| `BOOKING_FEATURES.md` | Form fields, UX, accessibility |
| `TESTING_GUIDE.md` | Step-by-step test scenarios |
| `COMMISSION_MODEL.md` | Revenue & payment models |
| `IMPLEMENTATION_SUMMARY.md` | Full technical overview |
| `QUICK_REFERENCE.md` | This card |

---

## 🛠️ Common Tasks

### Add a New Clinic
Edit `lib/data.ts`:
```typescript
{
  id: "unique-clinic-id",
  name: "Clinic Name",
  doctor: "Dr. Name",
  city: "Mumbai",
  services: [
    { name: "Root Canal Treatment", priceFrom: 4500, rating: 4.8, reviewCount: 45 },
    // ... more services
  ]
  // ... other fields
}
```

### Add a New Service
Add to existing clinic's `services` array:
```typescript
{
  name: "New Service",
  description: "Description",
  duration: "45 min",
  priceFrom: 2000,
  rating: 4.7,
  reviewCount: 20
}
```

### Change Commission Rate
In `COMMISSION_MODEL.md`, update calculation
Then implement in backend API

### Update Form Fields
Edit `app/booking/page.tsx` - `formData` state
Add new field → add input → add to submission

---

## 🐛 Debugging

### Form not submitting?
```javascript
// Check localStorage is enabled
localStorage.getItem('bookings')
```

### Date picker not showing future dates?
```javascript
// Check browser date settings
new Date().toISOString()
```

### Button stays disabled?
```javascript
// Check if terms checkbox is checked
// Check all required fields are filled
```

### Bookings disappear after refresh?
```javascript
// Check localStorage is enabled (not in private mode)
// Try: localStorage.getItem('bookings')
```

---

## 📱 Responsive Breakpoints

| Screen | Columns | Layout |
|--------|---------|--------|
| Mobile < 640px | 1 | Stacked |
| Tablet 640-1024px | 2 | Grid |
| Desktop > 1024px | 3-4 | Wide |

---

## 🎯 User Flows

### Path 1: Discover & Book (Happy Path)
```
/services → Search → Click service → /services/[name]
    ↓
See all clinics → Sort by price → Click best deal
    ↓
/booking → Fill form → Submit → /booking-confirmation
```

### Path 2: Direct Link
```
/booking?clinic=sharma-dental-mumbai&service=Root%20Canal%20Treatment&price=4500
    ↓
Form pre-filled → Submit → Confirmation
```

### Path 3: Compare & Print
```
/services/Teeth%20Whitening → Compare prices
    ↓
/booking → Fill & Submit → /booking-confirmation
    ↓
Print receipt or download
```

---

## 🚀 Deployment

### Dev
```bash
npm run dev
# http://localhost:3000
```

### Build
```bash
npm run build
npm start
```

### Vercel (Production)
```bash
git push origin main
# Auto-deploys
```

---

## 📞 Support

### For Users
- "How to book" → See `/services`
- "Modify booking" → Not yet (future)
- "Track booking" → Check email confirmation (future)

### For Clinics
- Clinic management → Not yet (future)
- Booking notifications → Not yet (future)
- Revenue reports → Not yet (future)

### For Developers
- See `IMPLEMENTATION_SUMMARY.md`
- See `TESTING_GUIDE.md`
- Check code comments
- Use browser DevTools

---

## 📈 Next Big Features

1. **Backend** - Move from localStorage to DB
2. **Auth** - User login & profiles
3. **Payments** - Razorpay/Stripe integration
4. **Clinic Dashboard** - Booking management
5. **Notifications** - Email/SMS alerts
6. **Admin Dashboard** - Revenue tracking

---

## 💡 Pro Tips

### Testing Multiple Bookings
1. Book first appointment → get BOOK-1
2. Open new browser tab
3. Book second appointment → get BOOK-2
4. Both persist in localStorage

### Testing City Filtering
Click city pill → URL updates automatically
Returns to `/services/[name]?city=Mumbai`

### Testing Print
Chrome: Cmd+P (Mac) / Ctrl+P (Windows)
Select "Save as PDF" for digital receipt

### Mobile Testing
Use Chrome DevTools → Toggle device toolbar (Cmd+Shift+M)
Or open on phone: `http://YOUR_IP:3000`

---

## 🎓 Learning Resources

- React Hooks: https://react.dev/reference/react
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

## 📞 Questions?

Check the documentation files in order:
1. `QUICK_REFERENCE.md` (this file)
2. `TESTING_GUIDE.md` (how to test)
3. `BOOKING_FLOW.md` (how it works)
4. `IMPLEMENTATION_SUMMARY.md` (full details)

