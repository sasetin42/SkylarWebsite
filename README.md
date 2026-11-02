<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Skylar Education Asia Inc. — Website

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Jzwimvuc6RcQmK6CsAkp8LeWRinQ6mmC

## Hosting

This project is deployed to **Firebase Hosting only** (`skylar-asia`).
There is no Vercel, Supabase or any other hosting/database provider connected —
all data, auth, file storage and rules live in Firebase (Firestore + Storage).

```bash
npm run deploy   # vite build && firebase deploy --project skylar-asia --only hosting
```

Firebase configuration files: `.firebaserc`, `firebase.json`, `firestore.rules`,
`storage.rules`. Production URL: https://skylar-asia.web.app

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
