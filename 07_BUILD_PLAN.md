# 07 - Build Plan (48 Hours)

## Team Split (3-4 members ke liye)
| Role | Kaam |
|---|---|
| Frontend Dev | React pages, form, results, i18n, voice |
| Backend Dev | Express APIs, eligibility engine, MongoDB |
| AI/Integration Dev | LLM service, chatbot, prompts, fallback |
| Data + Presentation | Schemes ka data collect/verify, slides, demo script |

> Agar 2 log ho: ek frontend, ek backend + AI. Data dono milke.

## Timeline

### Phase 1: Setup & Data (Hour 0-6)
- [ ] GitHub repo, client/server folders
- [ ] MongoDB Atlas cluster, connection test
- [ ] Scheme schema + seed script
- [ ] 15-20 schemes ka JSON data (official site se verify)
- [ ] UI wireframe (paper/Figma)

### Phase 2: Core Backend (Hour 6-14)
- [ ] Express app, middleware, error handler
- [ ] `GET /schemes`, `GET /schemes/:slug`
- [ ] Eligibility engine + `POST /match`
- [ ] Engine ke unit tests (5-6 cases)

### Phase 3: Core Frontend (Hour 10-22)
- [ ] Vite + Tailwind + Router setup
- [ ] Home page + language switcher
- [ ] Multi-step profile form
- [ ] Results page + SchemeCard
- [ ] Scheme detail page + documents checklist
- [ ] Frontend-backend integration

### Phase 4: AI Features (Hour 20-30)
- [ ] `/ai/explain` + fallback
- [ ] Chatbot (RAG) + ChatWidget
- [ ] Prompt tuning Hindi/Gujarati ke liye

### Phase 5: Extras (Hour 28-38)
- [ ] Voice input
- [ ] Near-miss hints UI
- [ ] WhatsApp share
- [ ] Reminder (email + cron)
- [ ] Admin login + scheme add/edit (agar time ho)

### Phase 6: Polish & Deploy (Hour 38-44)
- [ ] Mobile responsive check
- [ ] Loading states, error messages
- [ ] Deploy (Vercel + Render)
- [ ] Live URL test mobile par

### Phase 7: Presentation (Hour 44-48)
- [ ] Slides
- [ ] Demo script 3 baar practice
- [ ] Backup: demo video record karo

## Priority Rule
Agar time kam pade to **sirf ye 5 cheezein** banao:
1. Profile form
2. Eligibility engine
3. Results + detail page
4. AI explanation
5. Hindi + English

Baaki sab "Future Scope" mein bata do.

## Git Workflow
- `main` (stable), `dev`, `feature/<name>`
- Chhote commits, har 1-2 ghante mein push
- Merge conflicts se bachne ke liye alag folders par kaam karo

## Risk & Solution
| Risk | Solution |
|---|---|
| LLM API limit/fail | Fallback template explanation |
| Data galat | Official source link + `lastVerifiedOn` |
| Time kam | MVP scope follow karo |
| Demo internet fail | Local build + recorded video backup |
| Gujarati translation weak | Pehle Hindi/English perfect karo, phir Gujarati |
