# 01 - Requirements

## 1. Functional Requirements

### FR-1: Language Selection
- User Hindi / Gujarati / English choose kar sake.
- Choice poore UI aur AI explanation par apply ho.

### FR-2: Profile Form (Eligibility Questionnaire)
Multi-step form, har step mein 1-2 sawal:
| Field | Type | Example |
|---|---|---|
| Age | number | 19 |
| Gender | select | Male / Female / Other |
| State | select | Gujarat |
| Category | select | General / OBC / SC / ST / EWS |
| Annual family income | number | 200000 |
| Education level | select | 10th / 12th / Diploma / UG / PG |
| Course / stream | text/select | B.Tech |
| Occupation | select | Student / Farmer / Self-employed / Unemployed |
| Disability | boolean | Yes / No |
| Minority community | boolean | Yes / No |

### FR-3: Voice Input
- Web Speech API se user bolkar jawab de sake (Hindi/Gujarati/English).

### FR-4: Eligibility Matching
- Backend rule engine profile ko schemes ke rules se match kare.
- Output: **Eligible**, **Near-miss (almost eligible)**, **Not eligible**.
- Har eligible scheme ke saath match % aur "kyun eligible" reasons.

### FR-5: Results Page
- Eligible schemes ki list: naam, type (scholarship/yojana), benefit, deadline.
- Filter: type, level (central/state), deadline.
- Sort: match %, deadline.

### FR-6: Scheme Detail Page
- Benefit amount, eligibility, documents checklist, apply steps, official link, deadline.
- Documents ki tick-able checklist (progress bar).

### FR-7: AI Explanation
- Har scheme ke liye user ki bhasha mein simple explanation.
- Near-miss hints.

### FR-8: AI Chatbot (RAG)
- User scheme ke baare mein follow-up sawal puchh sake.
- Bot sirf database ke scheme data ke context se jawab de.
- Data mein jawab na ho to bole: "Is baare mein pakki jaankari nahi, official site dekhein."

### FR-9: Deadline Reminder
- User optional email de to deadline se 7 din aur 1 din pehle reminder mile (node-cron + Nodemailer).

### FR-10: Share & Download
- WhatsApp share button.
- Result PDF download (optional).

### FR-11: Admin Panel (Basic)
- Admin login (JWT).
- Scheme add / edit / delete.
- Deadline update.

### FR-12: Feedback
- "Kya ye result helpful tha?" thumbs up/down, analytics ke liye.

## 2. Non-Functional Requirements
| Area | Requirement |
|---|---|
| Performance | Result 3 second ke andar (AI explanation async load ho sakta hai) |
| Responsive | Mobile-first design (zyadatar users mobile par honge) |
| Accessibility | Bada font, high contrast, voice support |
| Security | Input validation, rate limiting, helmet, CORS, JWT for admin |
| Privacy | User profile DB mein save nahi; sirf anonymous analytics |
| Reliability | AI fail ho to bhi rule-engine result dikhe (graceful fallback) |
| Scalability | Naye states/schemes sirf data add karke jud sakein (code change nahi) |
| Maintainability | Modular code, `.env` config, clear folder structure |

## 3. Scope

### MVP (Hackathon mein zaroor)
- Language select (Hindi/English, Gujarati agar time mile)
- Profile form
- Rule-based eligibility engine
- Results + detail page
- AI explanation
- 20-25 schemes ka data (Gujarat focus + central)

### Should Have
- RAG chatbot
- Voice input
- Document checklist
- WhatsApp share

### Future Scope
- Certificate OCR se auto-fill
- Multiple states
- SMS/WhatsApp reminders
- Mobile app (React Native)
- Application status tracking
- Offline PWA

## 4. Assumptions
- Scheme data manually official sources se curate hoga.
- Demo ke liye Gujarat + central schemes kaafi hain.
- LLM API ka free/low-cost tier available hai.

## 5. Constraints
- Hackathon time limit (24-48 hrs)
- Free-tier hosting (Vercel/Render/MongoDB Atlas)
- Scheme data ki accuracy official sites par depend karti hai.

## 6. Data Sources (Verify karke use karein)
- https://scholarships.gov.in (National Scholarship Portal)
- https://www.myscheme.gov.in
- https://mysy.guj.nic.in (Gujarat MYSY)
- Related ministry official websites
