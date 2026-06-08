# Service-First Comparison Flow - Wireframe

## Flow Architecture

```
┌─────────────────────────────────────┐
│         Landing / Hero              │
│  "Find & Compare Dental Services"   │
│  Service Search + City Filter       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│    Service Selection View           │
│  Popular Services Grid              │
│  "Root Canal" "Whitening" etc       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Service Comparison Results         │
│  ┌──────┬──────┬──────┐             │
│  │Card1 │Card2 │Card3 │             │
│  └──────┴──────┴──────┘             │
│  (Sorted by: Price/Rating/Distance) │
│  Filter Bar: Price Range, Min Rating│
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Clinic Card (Service Specific)     │
│  ╔════════════════════════════╗     │
│  ║ Clinic Logo               ║     │
│  ║ "Sharma Dental Care"      ║     │
│  ║ Dr. Priya Sharma          ║     │
│  ║ ⭐ 4.9 (312 reviews)      ║     │
│  ║                           ║     │
│  ║ SERVICE SPECIFIC:         ║     │
│  ║ Root Canal: ₹4,500        ║     │
│  ║ Duration: 60-90 min       ║     │
│  ║ Rating for this service:  ║     │
│  ║   4.8/5 (45 reviews)      ║     │
│  ║                           ║     │
│  ║ 📍 2.3 km away            ║     │
│  ║ ⏰ Available today 3 PM    ║     │
│  ║                           ║     │
│  ║ [Book] [View Details]     ║     │
│  ╚════════════════════════════╝     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Clinic Detail Page                 │
│  Full clinic info + all services    │
└─────────────────────────────────────┘
```

---

## Page 1: Service Search Home

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  DentIndia                                                  │
│  "Compare Dental Services & Find the Best Clinic"          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  SEARCH + FILTERS                                           │
│  ┌─────────────────────────────────────┐                   │
│  │ 🔍 "Root Canal" or "Whitening"...  │ [🔍 Search]      │
│  └─────────────────────────────────────┘                   │
│  [All Cities ▼] [Mumbai] [Bangalore] [Chennai] [Delhi]    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  POPULAR SERVICES (Quick Browse)                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │Root     │ │Teeth    │ │Braces & │ │Dental   │          │
│  │Canal    │ │Cleaning │ │Aligners │ │Implants │          │
│  │   👄    │ │   👄    │ │   👄    │ │   👄    │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │Crowns & │ │Tooth    │ │Gum      │ │Consulta-│          │
│  │Bridges  │ │Extraction│ │Surgery  │ │tion     │          │
│  │   👄    │ │   👄    │ │   👄    │ │   👄    │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## Page 2: Service Comparison Results

```
┌─────────────────────────────────────────────────────────────┐
│  Service: Root Canal | Location: Mumbai | 12 clinics found │
│  [← Back]                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FILTERS & SORT                                             │
│  Sort by: [Recommended ▼] [Price ▼] [Rating ▼]            │
│  Filter: ₹_____ to ₹_____ | ⭐ Min Rating: [4.0+ ▼]       │
│  Distance: [All ▼] or [< 5 km] [< 10 km]                  │
└─────────────────────────────────────────────────────────────┘

CLINIC COMPARISON CARDS (Grid 1-2-3 col responsive)

┌────────────────────────────────────┐
│ Sharma Dental Care                 │
│ ════════════════════════════════   │
│ 👩‍⚕️ Dr. Priya Sharma                │
│ BDS, MDS (Orthodontics)            │
│                                    │
│ ⭐ 4.9 (312 reviews)               │
│ 💚 Highly trusted                  │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ Root Canal Treatment         │   │
│ │ ═══════════════════════════  │   │
│ │ Price: ₹4,500               │   │
│ │ Duration: 60-90 min         │   │
│ │                             │   │
│ │ Service Rating: 4.8/5       │   │
│ │ (45 verified reviews)       │   │
│ │ ✓ "Quick & painless"        │   │
│ │ ✓ "Expert work"             │   │
│ └──────────────────────────────┘   │
│                                    │
│ 📍 2.3 km (Bandra West)           │
│ ⏰ Available: Today 3 PM           │
│ 📞 +91 98200 11234                │
│                                    │
│ [Book Appointment] [View Clinic]  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Capital Smiles                     │
│ ════════════════════════════════   │
│ 👨‍⚕️ Dr. Vikram Malhotra              │
│ BDS, MDS (Periodontics)            │
│                                    │
│ ⭐ 4.8 (276 reviews)               │
│ 💚 Highly trusted                  │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ Root Canal Treatment         │   │
│ │ ═══════════════════════════  │   │
│ │ Price: ₹4,800               │   │
│ │ Duration: 75 min            │   │
│ │                             │   │
│ │ Service Rating: 4.7/5       │   │
│ │ (38 verified reviews)       │   │
│ │ ✓ "Advanced tech"           │   │
│ │ ✓ "Precise work"            │   │
│ └──────────────────────────────┘   │
│                                    │
│ 📍 1.8 km (South Extension)       │
│ ⏰ Available: Tomorrow 11 AM       │
│ 📞 +91 98110 77654                │
│                                    │
│ [Book Appointment] [View Clinic]  │
└────────────────────────────────────┘

[... more cards ...]
```

---

## Page 3: Service Detail + Booking

```
┌─────────────────────────────────────┐
│ [← Back to Results]                 │
│ Root Canal Treatment                │
│ at Sharma Dental Care               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SERVICE DETAILS                     │
│ ═════════════════════════════════   │
│ Description: Single-sitting RCT     │
│  using rotary endodontics with      │
│  rubber dam isolation.              │
│                                    │
│ Price: ₹4,500                      │
│ Duration: 60-90 minutes            │
│ Success Rate: 98%                  │
│ Warranty: 2 years                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PATIENT REVIEWS FOR THIS SERVICE    │
│ ═════════════════════════════════   │
│ ⭐⭐⭐⭐⭐ 4.8/5 (45 verified bookings)  │
│                                    │
│ "Quick & painless" - Rajesh (Feb)  │
│ "Excellent work" - Priya (Jan)    │
│ "Highly recommend!" - Amit (Dec)  │
│                                    │
│ [View All 45 Reviews]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ CLINIC INFO                         │
│ ═════════════════════════════════   │
│ 👩‍⚕️ Dr. Priya Sharma                 │
│ ⭐ 4.9 (312 reviews)                │
│ 📍 Bandra West, Mumbai              │
│ ⏰ Mon-Sat: 10 AM - 7 PM           │
│ 📞 +91 98200 11234                 │
│                                    │
│ [View Full Clinic Profile]         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ AVAILABLE SLOTS                     │
│ ═════════════════════════════════   │
│ Today                              │
│ [2 PM] [3 PM] [4 PM] [5 PM]      │
│                                    │
│ Tomorrow                           │
│ [10 AM] [11 AM] [2 PM] [3 PM]    │
│                                    │
│ [Book Now]                         │
└─────────────────────────────────────┘
```

---

## Mobile Responsive Variations

**Mobile (< 640px):**
- Cards stack single column
- Search is fullscreen
- Service carousel (swipeable)
- Sticky "Book" button at bottom

**Tablet (640px - 1024px):**
- Cards in 2 columns
- Filter drawer or collapsible filters

---

## Key Product Insights

| Element | Why | Example |
|---------|-----|---------|
| **Service-First Search** | Users know what they want, not which clinic | "Root Canal" not "dentist near me" |
| **Price Prominence** | Primary comparison driver | ₹4,500 vs ₹4,800 at top of card |
| **Service-Specific Reviews** | Not all RCTs are equal | 4.8/5 for this service specifically |
| **Availability Badges** | Reduces friction | "Today 3 PM" vs call to check |
| **Trust Signals** | Credibility | "45 verified bookings for this service" |
| **Distance & Directions** | Real-world constraint | "2.3 km away" is actionable |

