# Yojana Saathi - One-Stop Scholarship & Government Scheme Finder

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

> Tagline: "Aapka haq, aapke tak."

## 1. Project Overview
Yojana Saathi ek MERN-stack web application hai jo students, kisan aur aam logo ko bataati hai ki wo kaun si **scholarships aur sarkari yojanaon** ke eligible hain, documents kaunse chahiye, apply kaise karna hai aur deadline kya hai. Sab kuch simple **Hindi / Gujarati / English** mein.

## 2. Problem Statement
**"Scattered portals and complex rules prevent deserving citizens from claiming millions in public and private aids."**

- Bahut saari scholarships aur yojanayein unclaimed reh jaati hain.
- Logo ko schemes ki jaankari nahi hoti aur portals kaafi confusing/English mein hote hain.
- Eligibility aur documents ki clarity nahi hoti, jisse log chote margin (jaise Rs. 1000 ki income) se form fill karna miss kar dete hain.

## 3. Solution
User 6-8 simple sawalo ke jawab deta hai. System:
1. **Rule engine (Node.js code)** se accurate eligibility check karta hai.
2. **LLM (AI)** se result simple bhasha mein samjhata hai.
3. **RAG chatbot** se follow-up sawalo ke jawab deta hai (sirf scheme data ke andar se).
4. Documents checklist, deadline reminder aur WhatsApp share deta hai.

## 4. Target Users
- Students (school, UG, PG)
- Kisan aur gramin parivaar
- Mahilayein, divyang, minority/SC/ST/OBC varg ke log
- Wo log jo English ya technical portals mein comfortable nahi hain

## 5. USP (Judges ko kya alag dikhega)
| Point | Detail |
|---|---|
| Hybrid AI | Eligibility code se, explanation AI se. Hallucination ka risk kam |
| Local language + Voice | Hindi/Gujarati + voice input |
| Near-miss hints | "Sirf Rs. 20,000 income zyada hai, ye dusri scheme dekho" |
| Privacy first | User ka sensitive data DB mein save nahi hota |
| WhatsApp share | Gaon mein sabse zyada use hone wala channel |

## 6. Documentation Index
| File | Content |
|---|---|
| `README.md` | Project overview (ye file) |
| `01_REQUIREMENTS.md` | Functional + non-functional requirements |
| `02_ARCHITECTURE_AND_TECH_STACK.md` | MERN architecture, tools, flow |
| `03_DATABASE_SCHEMA.md` | MongoDB collections aur schemas |
| `04_API_DOCUMENTATION.md` | Backend REST APIs |
| `05_ELIGIBILITY_ENGINE_AND_AI.md` | Rule engine, LLM, RAG ka design aur code |
| `06_FOLDER_STRUCTURE_AND_SETUP.md` | Folder structure, setup, env variables |
| `07_BUILD_PLAN.md` | 48-hour plan, team split, checklist |
| `08_PRESENTATION_GUIDE.md` | Pitch, demo script, Q&A |
| `09_SAMPLE_SCHEME_DATA.md` | Seed data ke sample schemes |

## 7. Disclaimer
Ye platform sirf jaankari ke liye hai. Apply karne se pehle hamesha official website par eligibility, income limit aur deadline verify karein.

## 8. How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running on `localhost:27017`
- A Gemini API Key in `backend/.env` (`GEMINI_API_KEY=your_key_here`)

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *The backend will run on `http://localhost:5000`.*

### Frontend Setup
1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

## 9. Contact & Support
For any queries, technical support, or feedback regarding Yojana Saathi, feel free to reach out:
- **Name:** Harsh Agrawal
- **Email:** agrawalharsh6269@gmail.com
- **Phone:** +91 9714246474
