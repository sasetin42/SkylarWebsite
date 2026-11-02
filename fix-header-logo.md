# Task: Fix Brand Logo (Header & Loading Screen)

## Summary
Applied the official brand logo (wind turbine emblem + typography) across the Loading Screen and Header with crisp contrast adaptation.

## Tasks Completed
- [x] Phase 0: Discovery & Asset Extraction
  - Found official brand asset (3101 x 1126 px transparent PNG)
  - Generated public/skylar-official-logo.png and public/skylar-official-logo-white.png
- [x] Phase 1: Loading Screen Fix (App.tsx)
  - Resolved logo to use official white logo on dark loading screen
  - Removed destructive invert filter preventing the blank rectangular blowout
- [x] Phase 2: Header Fix (Navbar.tsx)
  - Configured adaptive brand logo for hero transparent and scrolled solid states
- [x] Phase 3: Footer Fix (Footer.tsx)
  - Sourced white brand logo cleanly on dark footer background
- [x] Phase 4: Build Verification
  - npm run build passed with zero errors
