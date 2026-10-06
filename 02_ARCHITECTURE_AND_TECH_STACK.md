# 02 - Architecture & Tech Stack (MERN)

## 1. Tech Stack
| Layer | Technology | Kaam |
|---|---|---|
| Frontend | React JS (Vite) + Tailwind CSS | UI, multi-step form, results |
| Routing | React Router | Pages navigation |
| State | Context API / Zustand | Profile + language state |
| i18n | react-i18next | Hindi / Gujarati / English UI |
| Voice | Web Speech API | Voice input |
| HTTP | Axios | API calls |
| Backend | Node.js + Express.js | REST APIs, eligibility engine |
| Database | MongoDB + Mongoose (Atlas free tier) | Schemes, admin, feedback |
| AI | LLM API (Gemini / OpenAI / Claude) | Explanation + chatbot |
| Auth | JWT + bcrypt | Admin login |
| Scheduler | node-cron + Nodemailer | Deadline reminders |
| Validation | Joi / Zod | Input validation |
| Security | helmet, cors, express-rate-limit | API protection |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas | Free hosting |

## 2. High-Level Architecture

```
[ React Frontend ]
   | 1. Profile (POST /api/match)
   v
[ Express Backend ]
   |-- Validation middleware
   |-- Eligibility Engine (pure JS logic)  --> MongoDB (schemes)
   |-- AI Service (LLM API)  <-- RAG context from MongoDB
   v
[ Response: eligible / near-miss + AI explanation ]
```

## 3. Request Flow (Main Use Case)
1. User language choose karta hai aur form bharta hai.
2. React `POST /api/match` ko profile bhejta hai.
3. Backend profile validate karta hai.
4. MongoDB se active schemes fetch hote hain.
5. Eligibility engine har scheme ko evaluate karta hai (eligible / near-miss / not eligible).
6. Result turant frontend ko jaata hai.
7. Frontend alag call se `POST /api/ai/explain` karta hai taaki UI block na ho.
8. LLM user ki bhasha mein explanation deta hai.
9. User chatbot (`POST /api/ai/chat`) se follow-up pooch sakta hai.

## 4. Chatbot (RAG) Flow
1. User sawal bhejta hai (+ optional schemeId).
2. Backend relevant scheme documents MongoDB se nikaalta hai (keyword/text index search).
3. Scheme data ko context bana kar LLM ko prompt mein deta hai.
4. System prompt: "Sirf diye gaye context se jawab do. Pata na ho to bolo pata nahi."
5. Answer user ki bhasha mein return.

> Hackathon ke liye vector DB ki zarurat nahi. MongoDB text index + scheme ID context kaafi hai.

## 5. Privacy Design
- User profile (income, category) **database mein store nahi hota**. Sirf request mein process hota hai.
- Analytics mein sirf anonymous counts (kitne log match hue, feedback) save hote hain.
- Reminder email optional hai aur sirf reminder ke liye use hota hai.

## 6. Error Handling & Fallback
| Situation | Behaviour |
|---|---|
| LLM API fail/slow | Rule-based result + template explanation dikhao |
| DB down | Friendly error + retry |
| Invalid input | 400 with field-wise messages |
| Rate limit cross | 429 message |

## 7. Kya ye MERN approach sahi hai?
**Haan.** Reasons:
- Aap web zyada jaante ho, aur React + Node same language (JavaScript) hai, to learning curve kam.
- Scheme data JSON-like hota hai, MongoDB ke document model mein naturally fit hota hai.
- Different schemes ke rules alag structure ke ho sakte hain, MongoDB flexible schema ye handle karta hai.
- Eligibility engine Node mein likhna aasan hai, aur LLM API calls bhi simple hain.
- Poora free tier par deploy ho sakta hai.
- Team mein frontend/backend alag-alag log parallel kaam kar sakte hain.
