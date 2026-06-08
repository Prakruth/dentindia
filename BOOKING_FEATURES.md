# Booking Form Features & Design

## Form Fields Breakdown

### 1. Personal Information Section

#### First Name
- **Type:** Text input
- **Placeholder:** "John"
- **Validation:** Required
- **Icon:** 👤 User icon

#### Last Name
- **Type:** Text input
- **Placeholder:** "Doe"
- **Validation:** Required

#### Email Address
- **Type:** Email input
- **Placeholder:** "john@example.com"
- **Validation:** Required, HTML5 email validation
- **Icon:** 📧 Mail icon
- **Use:** For confirmation email

#### Phone Number
- **Type:** Telephone input
- **Placeholder:** "+91 98765 43210"
- **Validation:** Required, tel format
- **Icon:** 📞 Phone icon
- **Use:** Clinic will call/SMS this number

---

### 2. Appointment Details Section

#### Preferred Date
- **Type:** Date picker
- **Validation:** Required
- **Min Date:** Today
- **Max Date:** 30 days from now
- **Icon:** 📅 Calendar icon
- **Format:** YYYY-MM-DD (browser native format)

#### Preferred Time
- **Type:** Dropdown select
- **Validation:** Required
- **Options:**
  - 9:00 AM
  - 10:00 AM
  - 11:00 AM
  - 2:00 PM
  - 3:00 PM
  - 4:00 PM
  - 5:00 PM
  - 6:00 PM
- **Icon:** ⏰ Clock icon
- **Note:** Clinic will confirm actual availability

#### Additional Notes
- **Type:** Textarea
- **Validation:** Optional
- **Placeholder:** "Any specific concerns or medical history we should know?"
- **Icon:** 📝 Message icon
- **Rows:** 3
- **Use:** Patient can mention:
  - Anxiety/dental phobia
  - Medical conditions
  - Allergies
  - Previous experiences
  - Budget constraints
  - Preferred languages

---

### 3. Agreement Section

#### Terms & Conditions Checkbox
- **Type:** Checkbox (required)
- **Label:** "I agree to the [terms & conditions] and confirm that the information provided is accurate."
- **Background:** Blue highlight (blue-50) with blue border
- **Behavior:** Submit button disabled until checked
- **Link:** "terms & conditions" is clickable link

---

## Form State Management

### Initial State
```javascript
{
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
  agreeToTerms: false
}
```

### Form Validation
- **Email:** HTML5 email input validation
- **Phone:** Tel input type validation
- **Date:** Browser date picker ensures valid date
- **Time:** Dropdown ensures predefined value
- **Terms:** Checkbox must be true

### Form Submission
- **Loading State:** Shows spinner + "Submitting..." text
- **Button Disabled:** Until all required fields filled + terms agreed
- **Duration:** 1.5s simulated API call
- **Success:** Redirects to `/booking-confirmation?id=BOOKING_ID`

---

## Service Summary Card (Above Form)

### What's Shown
```
┌─────────────────────────────────────┐
│ 👩‍⚕️ Clinic Name                         │
│                                     │
│ Dr. Doctor Name                     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Service: Root Canal Treatment   │ │
│ │                                 │ │
│ │ Price: ₹4,500    Duration: 60m  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Purpose
- Confirms what service user is booking
- Shows price (prevents surprises)
- Shows duration
- Sets context before form

---

## Form Layout

### Desktop (> 640px)
- 2-column grid for name fields
- Single column for email, phone
- 2-column grid for date/time
- Full width for notes
- Full width for terms
- Full width for submit button

### Mobile (< 640px)
- All inputs stack single column
- Date picker fills screen width
- Time dropdown fills screen width
- Touch-friendly padding (2.5py)
- Larger tap targets

---

## UX Features

### 1. Visual Hierarchy
- **Icons** next to labels for quick scanning
- **Required fields** indicated by `required` attribute
- **Optional fields** explicitly labeled "(Optional)"
- **Placeholder text** provides examples

### 2. Focus States
- **Border color:** Changes to blue-400 on focus
- **Ring effect:** Blue-100 ring around focused field
- **Outline:** Removed for cleaner look

### 3. Disabled State (Submit Button)
- **Color:** Stone-300 (grayed out)
- **Cursor:** Not-allowed
- **Action:** Cannot be clicked
- **Trigger:** Until terms checkbox is checked

### 4. Loading State
- **Button text:** "Submitting..."
- **Spinner:** Animated loading circle
- **Button locked:** Cannot click again

### 5. Success Feedback
- Automatic redirect to confirmation page
- Confirmation shows green success banner
- Booking ID displayed prominently

---

## Input Styling

### All Text Inputs
```
Border: stone-200
Border Radius: lg
Padding: 4 2.5 (px py)
Focus Border: blue-400
Focus Ring: blue-100
Transition: All
Background: White
```

### All Labels
```
Font Size: sm
Font Weight: medium
Color: stone-700
Margin Bottom: 2
```

### Placeholder Text
```
Color: stone-400
```

---

## Form Submission Flow

```
User fills form
    ↓
Clicks "Confirm Booking"
    ↓
Client-side validation
    ↓
Show spinner
    ↓
Simulate 1.5s API call
    ↓
Generate unique booking ID: BOOK-{timestamp}
    ↓
Save to localStorage: { bookings: [...] }
    ↓
Redirect to /booking-confirmation?id=BOOK-xxx
    ↓
Page loads confirmation with details
```

---

## Data Capture

### What We Collect
✅ Full name (first + last)
✅ Email address
✅ Phone number
✅ Preferred appointment date
✅ Preferred appointment time
✅ Medical notes/concerns
✅ Consent to terms

### What We DON'T Require
❌ Credit card (confirmation only, payment later)
❌ Insurance (optional, collected after booking)
❌ Emergency contact (optional, can be added later)
❌ Dental history (optional in notes field)

---

## Accessibility

### ARIA & Semantic HTML
- Proper `<label>` elements for all inputs
- Input `required` attributes
- `type="email"`, `type="tel"` for better mobile keyboards
- `type="date"` for date picker
- Semantic form structure

### Keyboard Navigation
- Tab through all fields in logical order
- Enter to submit form
- Space to toggle checkbox
- Arrow keys in date picker

### Mobile Considerations
- Email input shows `@` keyboard
- Tel input shows numeric keyboard
- Date input shows native date picker
- All touches >= 44x44 pixels (recommended minimum)

---

## Error Handling

### Current Implementation
- HTML5 form validation
- Browser-native error messages
- Submit button disabled until valid

### Future Enhancement
- Custom error messages
- Real-time validation feedback
- Toast notifications for API errors

---

## Confirmation Email (Future)

When implemented, email should contain:
- Booking confirmation ID
- Date & time
- Clinic details & map
- Patient info summary
- Cancellation link
- "Add to calendar" link
- Clinic contact details

---

## Commission & Revenue Tracking

### What's Tracked
```javascript
{
  bookingId: "BOOK-1704067200000",
  clinic: "Sharma Dental Care",
  clinicId: "sharma-dental-mumbai",
  service: "Root Canal Treatment",
  price: 4500,
  timestamp: "2026-04-24T...",
  patientName: "John Doe",
  patientEmail: "john@example.com",
  patientPhone: "+91 98765 43210"
}
```

### Revenue Model
- **Booking completion**: ₹X commission or X% of service price
- **Payment confirmation**: Additional commission if payment made
- **Clinic attribution**: Each booking tracked to clinic
- **Monthly reports**: Aggregate bookings & revenue by clinic

---

## Testing Scenarios

### Happy Path
1. Fill all fields correctly ✓
2. Check terms ✓
3. Submit ✓
4. See success page ✓

### Edge Cases
1. Try submit with no terms checked → Button disabled
2. Try submit with empty required fields → Browser validation
3. Fill form, then go back → Data cleared (new form)
4. Refresh confirmation page → Data persists (localStorage)
5. Submit duplicate booking → Gets unique ID (timestamp-based)

### Mobile Testing
1. Date picker opens native date UI
2. Time dropdown scrollable
3. All inputs scrollable on small screens
4. Print works on mobile browser
5. Download creates file properly

