# Testing Guide: Service Booking Flow

## Quick Start

### Running the App
```bash
npm run dev
```
Visit: `http://localhost:3000`

---

## Test Scenarios

### Scenario 1: Complete Booking Journey
**Goal:** Book a Root Canal appointment from scratch

**Steps:**
1. Navigate to `http://localhost:3000`
2. Click "Compare Services" in navbar (blue button)
3. Click search or scroll to "Root Canal Treatment" card
4. Click on service card
5. Sort by "Price (Low → High)"
6. Click "Book Now" on Sharma Dental (₹4,500 - cheapest)
7. Fill form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Phone: `+91 98765 43210`
   - Date: Pick any date in next 7 days
   - Time: Select `3:00 PM`
   - Notes: `I'm sensitive to pain, please use anesthesia`
8. Check "I agree to terms" checkbox
9. Click "Confirm Booking" button
10. Should see loading spinner for 1.5 seconds
11. Redirected to confirmation page
12. See booking ID like `BOOK-1704067200000`
13. All details should match your input
14. Click "Print Confirmation" - should open print dialog
15. Click "Book Another" - back to services

**Expected Results:**
- ✅ Form validates email format
- ✅ Form validates phone format
- ✅ Date picker shows only future dates
- ✅ Time is selected from dropdown (no free text)
- ✅ Submit button disabled until terms checked
- ✅ 1.5s delay simulates API call
- ✅ Confirmation page shows all data
- ✅ Data persists if you refresh page (localStorage)

---

### Scenario 2: Form Validation
**Goal:** Test that form validation works

**Steps:**
1. Go to `/booking?clinic=sharma-dental-mumbai&service=Root%20Canal%20Treatment&price=4500`
2. Leave "First Name" empty, try to submit
   - Expected: Browser shows "Please fill in this field"
3. Fill name, leave email empty
   - Expected: Browser shows email validation error
4. Fill email as "invalid.email", try submit
   - Expected: Browser shows "Please include an '@' in the email address"
5. Leave phone empty
   - Expected: Browser validation required
6. Try submit without checking terms
   - Expected: Button is disabled (grayed out, cursor: not-allowed)
7. Check terms checkbox
   - Expected: Button becomes enabled (blue, clickable)

**Expected Results:**
- ✅ HTML5 validation prevents invalid data
- ✅ Email format validated
- ✅ Required fields cannot be empty
- ✅ Submit button disabled until terms agreed

---

### Scenario 3: Service Comparison & Sorting
**Goal:** Test filtering and sorting functionality

**Steps:**
1. Go to `/services/Root%20Canal%20Treatment?city=All%20Cities`
2. You should see 4 clinics with prices:
   - Apollo: ₹4,000
   - Sharma: ₹4,500
   - Capital: ₹4,800
   - Smile Studio: ₹5,000
3. Sort by "Price (Low → High)"
   - Expected: Apollo first (₹4,000)
4. Sort by "Rating (High → Low)"
   - Expected: Sorted by service rating
5. Change max price to ₹4,500
   - Expected: Only Apollo and Sharma shown
6. Set min rating to "4.5+"
   - Expected: Filters accordingly
7. Click city "Delhi"
   - Expected: Only Capital Smiles in Delhi appears
8. Search back: `?city=All%20Cities`
   - Expected: Back to all clinics

**Expected Results:**
- ✅ All 4 clinics initially visible
- ✅ Sort changes clinic order
- ✅ Price filter hides expensive clinics
- ✅ Rating filter shows only high-rated
- ✅ City filter shows relevant clinics

---

### Scenario 4: Service Discovery
**Goal:** Test service search and browsing

**Steps:**
1. Go to `/services`
2. Should see hero with search + city filters
3. Should see 8 popular service cards:
   - Braces & Aligners (📌)
   - Consultation (💬)
   - Crowns & Bridges (👑)
   - Dental Implants (👁️)
   - Dentures (👄)
   - Digital Smile Design (🎨)
   - Gum Surgery (⚕️)
   - Laser Gum Treatment (💚)
4. Type in search: "Root"
   - Expected: No results (Root Canal not in first 8)
5. Clear search, type "Consultation"
   - Expected: 1 result (Consultation)
6. Select different cities, search still works
7. Click a service card
   - Expected: Goes to `/services/[serviceName]?city=All%20Cities`

**Expected Results:**
- ✅ 8 services displayed
- ✅ Search filters services
- ✅ City filter works
- ✅ Service cards are clickable
- ✅ Emojis load correctly

---

### Scenario 5: Clinic Card Details
**Goal:** Verify all information shown on clinic card

**Navigate to:** `/services/Root%20Canal%20Treatment`

**Check each card has:**
- ✅ Clinic emoji avatar
- ✅ Clinic name (e.g., "Sharma Dental Care")
- ✅ Doctor name (e.g., "Dr. Priya Sharma")
- ✅ Overall clinic rating + review count (e.g., "4.9 (312)")
- ✅ Service name: "Root Canal Treatment"
- ✅ Service price (e.g., "₹4,500")
- ✅ Service duration (e.g., "60–90 min")
- ✅ **Service-specific rating** (e.g., "4.8/5 (45 verified bookings)")
- ✅ Distance (e.g., "2.3 km away")
- ✅ Availability ("Available today 3 PM")
- ✅ "Book Now" button (blue)
- ✅ "View Clinic" button (light gray)

**Expected Results:**
- ✅ All fields populated correctly
- ✅ Service-specific rating different from overall clinic rating
- ✅ Buttons clickable

---

### Scenario 6: Multi-City Selection
**Goal:** Test city filtering works across pages

**Steps:**
1. Go to `/services`
2. Click city filter "Mumbai"
3. Search/click "Root Canal Treatment"
4. URL should show: `/services/Root%20Canal%20Treatment?city=Mumbai`
5. Only clinics in Mumbai shown:
   - Sharma Dental Care (Mumbai)
6. Try city "Bengaluru"
   - Expected: Smile Studio shown (it's in Bangalore)
7. Try city "Chennai"
   - Expected: Apollo Dental Clinic shown
8. Try city "Delhi"
   - Expected: Capital Smiles shown

**Expected Results:**
- ✅ City filter preserved in URL
- ✅ Only clinics from selected city shown
- ✅ Can switch cities and see different clinics

---

### Scenario 7: Confirmation Page Features
**Goal:** Test all features on confirmation page

**After completing a booking:**

1. **Check page elements:**
   - ✅ Green checkmark animation
   - ✅ Success message: "Booking Confirmed!"
   - ✅ Booking reference ID in monospace font
   - ✅ Patient name
   - ✅ Email
   - ✅ Phone
   - ✅ Service name
   - ✅ Date formatted nicely (e.g., "Tuesday, April 29, 2026")
   - ✅ Time (e.g., "3:00 PM")
   - ✅ Service fee with ₹ and commas
   - ✅ Notes section (if provided)
   - ✅ Clinic information
   - ✅ "What's Next" section with 3 steps

2. **Test Print:**
   - Click "Print Confirmation"
   - Expected: Browser print dialog opens
   - Print to PDF or printer
   - Verify booking details are on printout

3. **Test Download:**
   - Click "Download"
   - Expected: File downloads as `booking-BOOK-xxx.txt`
   - Open in text editor
   - Verify all details in text format

4. **Test Refresh:**
   - Refresh page (Cmd+R / Ctrl+R)
   - Expected: Data still shows (stored in localStorage)
   - Booking ID same as before

5. **Test "Book Another":**
   - Click "Book Another"
   - Expected: Navigate to `/services`
   - Should be a fresh form, no data filled

**Expected Results:**
- ✅ Confirmation page loads correctly
- ✅ All patient data shown
- ✅ Print dialog works
- ✅ Download creates file
- ✅ Data persists on refresh
- ✅ Can navigate back to book more

---

### Scenario 8: Mobile Responsiveness
**Goal:** Test mobile experience

**On mobile device or browser (< 640px width):**

1. Go to `/services`
   - Expected: Services in 2 columns
   - Search bar spans full width

2. Go to `/services/Root%20Canal%20Treatment`
   - Expected: Clinic cards in 1 column
   - Filters stack vertically
   - Sort dropdown full width

3. Go to booking form
   - Expected: All inputs single column
   - Labels visible
   - Icons show
   - Full width inputs
   - Checkboxes clickable (44px+ minimum)

4. Test date picker
   - Expected: Native mobile date picker opens

5. Test time dropdown
   - Expected: Native mobile dropdown

6. Submit booking on mobile
   - Expected: Confirmation page looks good
   - Print/Download buttons accessible
   - Text readable without zooming

**Expected Results:**
- ✅ All elements readable on small screen
- ✅ Touch targets >= 44px
- ✅ No horizontal scroll
- ✅ Native mobile pickers work

---

## localStorage Inspection

### View All Bookings
Open browser console (F12 → Console tab):
```javascript
JSON.parse(localStorage.getItem('bookings'))
```

### Clear All Bookings
```javascript
localStorage.removeItem('bookings')
```

### Manual Booking Creation (for testing)
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
  notes: "Test booking",
  createdAt: new Date().toISOString(),
  agreeToTerms: true
};
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
bookings.push(booking);
localStorage.setItem('bookings', JSON.stringify(bookings));
```

---

## Common Issues & Fixes

### Issue: Form fields not filling
**Solution:** Refresh page, clear browser cache

### Issue: Date picker not showing future dates
**Solution:** Check browser date setting, should be correct
- Min date = today
- Max date = 30 days from now

### Issue: Submit button always disabled
**Solution:** Check if checkbox is checked, button enables only after checking

### Issue: Booking not persisting after refresh
**Solution:** 
- Check localStorage is enabled (not in private/incognito mode)
- Check browser console for errors
- Try `localStorage.getItem('bookings')` in console

### Issue: Print dialog doesn't open
**Solution:** Try different browser or clear browser dialog blocks

---

## Browser Compatibility

### Tested On
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Limitations
- Date picker: Uses native browser picker (varies by browser)
- localStorage: Not available in private/incognito mode
- Print: Some browsers may prompt about background colors

---

## Performance Checklist

- [ ] First Load: < 3 seconds
- [ ] Service Search: < 500ms filtering
- [ ] Sort: < 200ms
- [ ] Form submission: Shows 1.5s spinner
- [ ] Confirmation load: < 1 second
- [ ] Print dialog: Opens instantly

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab moves through all form fields in order
- [ ] Shift+Tab moves backward
- [ ] Enter submits form
- [ ] Space toggles checkbox
- [ ] Arrow keys in date picker work

### Screen Reader (NVDA, JAWS, VoiceOver)
- [ ] Labels announced with inputs
- [ ] Icons have alt text
- [ ] Buttons announced as buttons
- [ ] Form errors announced
- [ ] Success message announced

### Color Contrast
- [ ] White text on blue: ✅ 4.5:1
- [ ] Gray text on white: ✅ 4.5:1
- [ ] All interactive elements have clear focus state

---

## Debugging Tips

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. No real API calls (everything client-side)
4. localStorage writes happen on submit

### Debug Form State
1. Open Console tab
2. Check form values:
   ```javascript
   // This won't work directly, but you can inspect via React DevTools
   ```

### Debug Booking Storage
```javascript
// See all bookings
console.log(JSON.parse(localStorage.getItem('bookings')))

// See specific booking
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
console.log(bookings[0])
```

