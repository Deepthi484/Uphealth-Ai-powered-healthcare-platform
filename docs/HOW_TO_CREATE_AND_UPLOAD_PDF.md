# How to Create and Upload the Design Document PDF

## Step 1: Create Diagrams (e.g., in Lucidchart)

1. Go to [Lucidchart](https://www.lucidchart.com) (free tier is enough).
2. Create these diagrams and **export each as PNG or PDF**:
   - **Overall Architecture Diagram** – Boxes for Frontend (Next.js), Node Backend, FastAPI, MongoDB, External API; arrows for HTTP/REST.
   - **Use-Case Diagram** – Stick figure (Patient), ovals for use cases (Sign Up, Login, Profile, Migraine, Heart Risk, Symptom Analyzer, Dashboard), system boundary rectangle.
   - **Activity Diagram – Symptom Analyzer** – Swimlane or flowchart: Start → Enter symptoms → Submit → Backend → LLM → Parse → Return → Display → End; add error branches.
   - **Activity Diagram – Auth** – Login/Signup flow with decision points and token storage.
   - **Solution/Component Diagram** – Main components (Frontend, Node, FastAPI, DB) and their connections.

## Step 2: Merge Everything into One Document

**Option A – Word/Google Docs**

1. Open `DESIGN_DOCUMENT.md` in VS Code or copy its content into **Google Docs** or **Microsoft Word**.
2. For each diagram: Insert → Image (or drag-and-drop) the PNG/PDF exports from Lucidchart into the right sections (e.g., Section 2 for Architecture, Section 3 for Use Case, etc.).
3. Add a title page and table of contents if required. Save as a single `.docx` or keep in Google Docs.

**Option B – Keep using Markdown**

1. Place exported diagram images in the `docs` folder (e.g., `architecture.png`, `use-case.png`).
2. In `DESIGN_DOCUMENT.md`, add under each section something like:  
   `![Architecture Diagram](./architecture.png)`
3. Use a converter (see Step 3) that supports images (e.g., Pandoc, or open the MD in a viewer that renders images and print to PDF).

## Step 3: Convert to a Single PDF

**From Google Docs:** File → Download → PDF Document (.pdf). All content and inserted images become one PDF.

**From Word:** File → Save As → PDF, or File → Export → Create PDF.

**From Markdown (with Pandoc):**  
`pandoc DESIGN_DOCUMENT.md -o DESIGN_DOCUMENT.pdf --resource-path=./`  
(Install Pandoc if needed; images in the same folder or path will be embedded.)

**From VS Code:** Install an extension like “Markdown PDF”, open `DESIGN_DOCUMENT.md`, right‑click → “Markdown PDF: Export (pdf)”. If you added image paths, ensure paths are correct so they appear in the PDF.

## Step 4: Upload the Single PDF

1. Name the file clearly (e.g., `UpHealth_Design_Document.pdf`).
2. Upload this **one** PDF to the assignment/submission portal as required.
3. Ensure the file is under any size limit and opens correctly.

---

**Summary:** Create diagrams in Lucidchart → Export as images/PDFs → Insert into one document (Doc/Word or Markdown with images) → Convert that single document to PDF → Upload the single PDF.
