# Website Content Manager: Realtime & Live Firestore Database Architecture Plan

## Goal
Make **all Website Content Manager pages** (`home`, `about`, `courses`, `locations`, `contact`, `faq`, `student-info`, `news`, `online-enrolments`, `refund-policy`, `privacy-notice`, `complaints`, `winda`) completely fully functional, with live data details instantly editable, two-way synchronized in real-time with Google Firebase Firestore, and permanently preserved with zero data loss.

---

## 1. Architecture & Diagnostic Analysis

### Current State
1. **Selection & Editing UX**:
   - In `pages/admin/WebsiteManager.tsx`, selecting a page currently opens a full-screen fixed overlay (`fixed inset-0 z-40 bg-gray-100 flex flex-col`) rather than displaying an intuitive split workspace in the dashboard area (which shows the blank *"Select a Page to Edit"* screen from the user's screenshot).
   - If an admin clicks on a page in the sidebar, they want immediate inline editing or high-visibility section control where they can inspect, edit, and save data with real-time feedback.
2. **Realtime Firestore Pipeline**:
   - In `services/storageService.ts`, `savePageContent` attempts background writes to `site_pages` in Firestore and `page_{id}` in the generic data collection, but:
     - `withTimeout` uses a strict 3000ms race that can silently abort if network latency is slightly elevated.
     - Individual page documents in Firestore need a dedicated collection schema (`site_pages` -> `{pageId}`) with a clean fallback.
     - When any admin edits or changes sections on a page, other tabs and the live public website need instant reactive updates via `onSnapshot` without requiring manual browser refreshes.
3. **Data Details Fidelity Across All Pages**:
   - Ensure every page's sections (`hero`, `features`, `training-programs`, `locations-list`, `contact-form`, `content`, `accordion`, `cta`, `team`) have all data details (headings, subheadings, badges, buttons, cards, images, coordinates, hours, policies) exposed with clear, high-contrast editable inputs.
   - Provide an explicit **"Sync to Firestore"** button and live status badge for each page so admins know with 100% certainty that the data is live in the database.

---

## 2. Planned Tasks

- [x] **Task 1: Firestore Realtime Sync Engine Enhancement (`services/storageService.ts` & `services/firebaseClient.ts`)**
  - Implement reliable, atomic upsert of page documents to Firestore collection `site_pages` with exponential backoff and offline queue.
  - Enhance `subscribeToCollection('site_pages')` to ensure all 13 website pages (`home`, `about`, `courses`, `locations`, `contact`, `faq`, etc.) are actively monitored and immediately updated in local cache upon remote change.
  - Expose `syncPageToFirestore(pageId)` to allow on-demand forced live sync with latency and document verification.
  - *Verify*: Calling `savePageContent` persists both locally and to Firestore collection `site_pages` within <500ms with verified document ID.

- [x] **Task 2: Website Content Manager Dashboard & Editor Redesign (`pages/admin/WebsiteManager.tsx`)**
  - Replace the blank placeholder dashboard with a rich **Page Overview & Live Editor**:
    - When a page is selected from the sidebar, smoothly transition to the editor with clear breadcrumbs, live sync status badge (`Synced with Firestore`), and direct section management.
    - Add a **Live Page Quick Switcher** and **Search Bar** to instantly find any section or field across all pages.
    - Add **"Save & Push to Live Website"** with instant status indicator and audio/visual success confirmation.
    - Provide a **"Fetch Latest from Firestore"** button to pull remote cloud data immediately.
  - *Verify*: Selecting any page (e.g. `Home Page`, `About Us`, `Locations`, `Contact`) loads all editable sections with live field inputs.

- [x] **Task 3: Comprehensive Section Data Detail Fields for Every Page**
  - Ensure all 9 section types have fully functional detail controls:
    - **Hero**: Title, Subheading, Background Image URL, Primary/Secondary CTA Buttons with URLs, Badges.
    - **Training Programs (GWO Blueprint)**: Program Title, Tag, Validity Label, Modules list (title, description, icon, color).
    - **Campus Locations**: Coordinates, address, phone, email, facility photo uploader.
    - **Contact Form & Facility Showcase**: Heading, Subheading, Multi-slide facility carousel items.
    - **Accordions / FAQs**: Add/remove/reorder accordion items with category tags and markdown support.
    - **Features & Operational Highlights**: Title, description, icon picker, stat cards.
    - **Team / Instructors**: Instructor cards, qualifications, certifications, photos.
  - *Verify*: Edit any field, click Save, refresh page, and observe the updated data on the live website.

- [x] **Task 4: Realtime Cross-Tab & Public Website Live Propagation**
  - Ensure all public pages (`Home.tsx`, `About.tsx`, `Contact.tsx`, `Locations.tsx`, `FAQ.tsx`) react immediately to `sitePagesUpdated` events fired by Firestore real-time listener.
  - *Verify*: Modify Home hero text in Website Manager, check Home page, and confirm text changes live without hard refresh.

- [x] **Task 5: Production Build & System Verification**
  - Run `npm run build` and ensure 0 TypeScript or JSX compiler errors.
  - Verify clean integration and execution of validation scripts.

---

## 3. Success Criteria (Done When)
- [x] Every page in Website Content Manager is selectable and editable with full data details.
- [x] Saving any page updates both local storage and the Cloud Firestore `site_pages` collection with verified timestamps.
- [x] Remote changes sync across tabs and live pages in real-time.
- [x] Production build succeeds with 0 errors.
