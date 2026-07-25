# LaSu - AI Language Support (Web App & Backend)

[![Next.js](https://img.shields.io/badge/Next.js-15.0__App__Router-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

&nbsp;&nbsp;
[![MongoDB](https://img.shields.io/badge/MongoDB-Document__Store-4ea94b?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
&nbsp;&nbsp;
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-Utility__First-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
&nbsp;&nbsp;


LaSu (derived from **La**nguage **Su**pport) is a full-stack language learning platform consisting of a **Next.js web application** and an official **Manifest V3 Chrome Extension**. It helps users expand their vocabulary while browsing by providing AI-powered translations, contextual examples, pronunciation, and synchronized learning progress across devices.

This repository contains the web application and central API backend responsible for authentication, data synchronization, AI translation requests, analytics, and communication with the Chrome Extension.
&nbsp;&nbsp;

🔗 **Production Web Application:** [lasu.online](https://lasu.online)  
🧩 **Official Browser Extension:** [LaSu - AI Language Support](https://chromewebstore.google.com/detail/jllhdgojepfdpmlppkccogdobopmiaok)

## ✨ Features

- 🤖 AI-powered word and sentence translation
- 🌍 Context-aware example generation
- 📚 Personal vocabulary history
- 🎯 Interactive practice mode
- 📈 Learning statistics and progress tracking
- 👥 Community feed and leaderboards
- 📧 Daily and weekly email summaries
- 🔄 Automatic synchronization between the Chrome Extension and web dashboard

---

## 🛠️ System Architecture & Engineering Highlights

```text
 ┌─────────────────────────┐         ┌────────────────────────┐
 │  Chrome Extension (MV3) │         │     Web Dashboard      │
 │ (Content Script/Worker) │         │ (Next.js client layer) │
 └────────────┬────────────┘         └───────────┬────────────┘
              │                                  │
              │   Secure HTTPS REST Requests     │
              └─────────────────┬────────────────┘
                                │
                                ▼
                  ┌───────────────────────────┐
                  │      Next.js Backend      │
                  │   (API Routes + Custom)   │
                  └─────────────┬─────────────┘
                                │
       ┌────────────────────────┼────────────────────────┐
       ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  OpenAI API  │         │   MongoDB    │         │   EmailJS    │
│(LLM Context) │         │(Data Layer)  │         │ (CRON Task)  │
└──────────────┘         └──────────────┘         └──────────────┘
```

### 🧠 AI Translation Pipeline

- Sends selected text from the Chrome Extension or web application to the backend.
- Generates translations using the OpenAI API with prompts optimized for both single words and complete sentences.
- Returns translations, pronunciation, example sentences, and additional learning data in a consistent response format.

### 🛡️ Security

- **Origin Validation:** Accepts requests only from trusted domains and the official Chrome Extension.
- **Rate Limiting:** Protects AI endpoints from abuse using a sliding-window rate limiter.
- **Hybrid Persistence:** Anonymous users store data locally, while authenticated users automatically synchronize their learning history with MongoDB.

### 📊 Performance & Background Processing

- **Precomputed Analytics:** Stores aggregated community statistics in a dedicated cache collection to reduce expensive database aggregations.
- **Separated Community Data:** Uses dedicated collections for community features, reducing query complexity and preserving user privacy.
- **Scheduled Tasks:** Secure CRON jobs generate daily and weekly email summaries without affecting normal application performance.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS, Zustand |
| Backend | Next.js API Routes, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | NextAuth.js (Google OAuth) |
| AI | OpenAI API |
| Storage | Cloudinary |
| Caching | Upstash Redis |
| Deployment | Vercel |

## 📁 Repository Directory Blueprint

```text
├── src/
│   ├── app/                   
│   │   ├── dashboard/         
│   │   │   ├── community/     
│   │   │   ├── history/      
│   │   │   ├── practice/     
│   │   │   ├── profile/      
│   │   │   ├── stats/        
│   │   │   └── welcome/      
│   │   ├── privacy/           
│   │   ├── globals.css       
│   │   ├── layout.tsx         
│   │   ├── page.tsx           
│   │   └── providers.tsx     
│   ├── components/           
│   ├── hooks/                 
│   ├── lib/                  
│   ├── models/                
│   ├── pages/                 
│   │   └── api/              
│   ├── store/                 
│   └── types/                
├── middleware.ts           
├── tsconfig.json             
└── next.config.ts            
```

---

## ⚡ Setup & Local Development

### Prerequisites
* Node.js (v18.x or subsequent LTS releases)
* An active MongoDB instance (Local or Atlas Cloud)
* OpenAI API credentials

### Installation Pipeline

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mota6em/lasu-app.git
   cd lasu-app
   ```

2. **Install locked dependencies via exact matching:**
   ```bash
   npm ci
   ```

3. **Configure Environment Matrix:**
 
Create a `.env.local` configuration file in the project workspace root. The production architecture expects variables grouped cleanly by subsystem boundaries:

```env
# ==============================================================================
# 1. CORE NEXT.JS RUNTIME & AUTHENTICATION (NextAuth.js Layer)
# ==============================================================================
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ==============================================================================
# 2. DATA PERSISTENCE LAYER (Distributed Topology)
# ==============================================================================
MONGODB_URI=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ==============================================================================
# 3. EXTERNAL CORE APIS & INTEGRATIONS
# ==============================================================================
OPENAI_API_KEY=
OPENAI_MODEL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ==============================================================================
# 4. SYSTEM UTILITIES & BACKGROUND MAILERS (SMTP Transport)
# ==============================================================================
EMAIL_USER=
EMAIL_PASS=

# ==============================================================================
# 5. SECURE ROUTING GATEWAYS & SYSTEM HANDSHAKES
# ==============================================================================
EXTENSION_SECRET=
LASU_GEN_SECRET=
LASU_API_SEC_KEY=
CRON_SECRET=
RESET_COUNTERS_CRON_SECRET=
COMMUNITY_STATS_CRON_SECRET=
```
4. **Launch the development runtime:**
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` to inspect your local server builds and database hooks.

---

## 🛡️ Production Deployment

LaSu is designed for serverless deployment on **Vercel**, where both the web application and API routes run as serverless functions.

1. Link your main branch destination directly to the Vercel workspace.
2. Mirror your local `.env.local` keys inside your Vercel Project Environment Settings.
3. Deploy. Edge handlers take over management of serverless API instances automatically.

---

## 📄 License & Academic Origins

LaSu was developed by **Motasem Abubaraka** as part of a BSc thesis at **Eötvös Loránd University (ELTE), Faculty of Informatics**.
 
 
**All rights reserved.**
