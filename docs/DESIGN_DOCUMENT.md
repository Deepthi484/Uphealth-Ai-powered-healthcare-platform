# UpHealth – Design Document

**Project:** UpHealth – AI-Powered Health Platform  
**Version:** 1.0  
**Last Updated:** [Insert Date]

---

## 1. Introduction

This design document describes the architecture, use cases, workflows, and technical design of UpHealth—a platform that provides migraine prediction, heart risk assessment, disease detection insights, and personalized health guidance through AI and machine learning.

---

## 2. Overall System Architecture

UpHealth follows a **three-tier, service-oriented architecture**:

- **Presentation Layer (Frontend):** Next.js 15 application running on port 3001. Handles all user interaction, forms, dashboards, and result visualization. Communicates with backend services via REST APIs.
- **Application Layer (Backend):**
  - **Node.js/Express (port 5000):** User authentication (JWT), signup/login, profile management, and orchestration. Connects to MongoDB for user and session data.
  - **FastAPI (port 8000):** AI/ML microservice. Hosts health-risk and migraine prediction models (joblib), and the symptom analyzer that calls external LLM APIs (e.g., Gemini). Returns structured predictions and recommendations.
- **Data Layer:** MongoDB Atlas for user accounts, profiles, and optional prediction history. Environment variables (e.g., `.env`) store secrets and configuration.

**Key design decisions:** Separation of auth (Node) and AI (FastAPI) allows independent scaling and technology choice. CORS is configured so the frontend (localhost:3001) can call both backends. All sensitive operations are protected by JWT and validated input schemas.

---

## 3. Use-Case Diagram (Summary)

**Primary Actor: Patient/User**

- **Sign Up / Log In** – Create account, authenticate, manage session (JWT).
- **Manage Profile** – View and update personal and health-related information.
- **Run Migraine Prediction** – Submit migraine-related inputs; receive prediction type and recommendations.
- **Run Heart Risk Assessment** – Submit vital signs and risk factors; receive risk level and recommendations.
- **Use Symptom Analyzer** – Enter free-text symptoms; receive AI-generated summary, possible diagnoses, risk assessment, doctor recommendations, and prevention tips.
- **View Dashboard** – Access all features and recent activity from a single hub.

**Secondary Actor (optional):** Clinician/Admin – May view aggregated or anonymized usage for quality improvement (future scope).

**System boundaries:** UpHealth provides the UI and APIs; external systems include MongoDB Atlas, and optionally third-party LLM APIs (e.g., Google Gemini) for the symptom analyzer.

---

## 4. Activity Diagram – Symptom Analyzer Flow

1. **Start** – User opens Symptom Analyzer page (authenticated).
2. **Enter symptoms** – User types or pastes symptom description in text area.
3. **Validate input** – Client checks non-empty; optional client-side length/format checks.
4. **Submit request** – Frontend sends POST to FastAPI `/api/symptom-analyzer/analyze` with JSON body `{ "symptoms": "..." }`.
5. **Backend receives** – FastAPI validates request, loads API key from config.
6. **Call LLM** – Service sends prompt + symptoms to external LLM API (e.g., Gemini).
7. **Parse response** – Extract and validate JSON from LLM output (with fallback on parse failure).
8. **Return structured result** – Response includes symptom summary, possible diagnoses, risk assessment, doctor recommendations, prevention, home care.
9. **Display results** – Frontend shows tabs (Overview, Diagnosis, Risk, Doctor, Prevention, Home Care) and handles loading/error states.
10. **End** – User may clear and run again or navigate away.

**Error paths:** Network failure → “Failed to fetch” / “Network error.” LLM or parse failure → Fallback message or 503. Invalid/missing API key → Clear error message to user.

---

## 5. Activity Diagram – Authentication Flow

1. **User visits Login/Signup** – Unauthenticated user opens `/login` or `/signup`.
2. **Submit credentials (login)** or **Submit registration data (signup)** – Form validation on client.
3. **POST to Node backend** – `/api/auth/login` or `/api/auth/signup`.
4. **Backend validates** – Check required fields; for login: verify password; for signup: check duplicate email, hash password, create user.
5. **Issue JWT** – Backend returns token and user object.
6. **Store token** – Frontend stores JWT (e.g., localStorage) and optionally user object.
7. **Redirect** – To dashboard or profile. Subsequent API calls send `Authorization: Bearer <token>`.
8. **Protected routes** – Frontend and backend verify token; invalid/expired token leads to 401 and redirect to login.

---

## 6. Component / Solution Diagram (Logical View)

- **Frontend (Next.js):** Pages (Home, Login, Signup, Dashboard, Migraine, Heart Assessment, Symptom Analyzer, Profile), shared UI components, protected-route wrapper, API client (fetch to Node and FastAPI).
- **Node Backend:** Routes (auth, optional prediction proxy), middleware (CORS, JSON body parser), User model, database connection (MongoDB).
- **FastAPI Backend:** Routers (symptom analyzer, health-risk, migraine), Pydantic models, model-loading (joblib), external LLM client, CORS middleware.
- **External:** MongoDB Atlas, Gemini (or similar) API.
- **Cross-cutting:** Environment config (`.env`), logging, error handling, security (JWT, CORS, input validation).

---

## 7. Data Flow – Prediction Requests

- **Migraine / Health Risk:** User fills form on frontend → POST to FastAPI with structured fields → FastAPI loads joblib model, builds DataFrame, runs prediction → Returns prediction, confidence, recommendations, vital-sign analysis (health risk) → Frontend displays results.
- **Symptom Analyzer:** User enters text → POST to FastAPI → FastAPI calls LLM with prompt → Parses LLM response to fixed schema → Returns JSON → Frontend displays in tabs.

---

## 8. Security and Privacy (Design Decisions)

- **Authentication:** JWT with configurable expiry; secrets in environment variables.
- **Passwords:** Hashed (e.g., bcrypt) before storage; never logged or returned.
- **CORS:** Restricted to known frontend origins (e.g., localhost:3000, localhost:3001).
- **Input validation:** Pydantic (FastAPI) and Express validation to prevent malformed or oversized payloads.
- **Privacy:** User data used only for providing the service; terms and privacy notice define collection, use, and retention. No sale of personal data.

---

## 9. Deployment and Environment

- **Development:** Frontend `npm run dev` (port 3001), Node backend `npm run dev` (5000), FastAPI `uvicorn fastapi_app:app --reload --port 8000`. MongoDB Atlas connection string and API keys in `.env`.
- **Production (outline):** Build Next.js (`npm run build`), run with `npm start`; Node and FastAPI can run behind a reverse proxy (e.g., Nginx); environment-specific `.env`; MongoDB Atlas in production cluster; optional containerization (Docker) for backend services.

---

## 10. Diagrams Checklist (To Be Added via Lucidchart/Other Tool)

For the single PDF submission, include at least:

1. **Overall Architecture Diagram** – Three tiers (Frontend, Node, FastAPI, DB, external API).
2. **Use-Case Diagram** – Actors (Patient, optional Clinician) and use cases (Sign Up, Log In, Profile, Migraine, Heart Risk, Symptom Analyzer, Dashboard).
3. **Activity Diagram – Symptom Analyzer** – Steps from user input to result display and error paths.
4. **Activity Diagram – Auth** – Login/Signup flow and token usage.
5. **Solution / Component Diagram** – Main components and their interactions.

Export each diagram as image or PDF from Lucidchart, then insert into this document or merge all into one PDF as required.

---

*End of Design Document*
