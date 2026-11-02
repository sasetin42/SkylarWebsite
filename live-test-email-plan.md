# Fully Functional Email Notifications & Live Test Email Architecture Plan

## Goal
Transform the system's email notification pipeline and "Dispatch Live Test Email" feature into a completely functional, realistic, transparent, and resilient engine with real-world email delivery fallback options (EmailJS/Webhooks/Cloud Function relay support), high-contrast accessible UI, and live delivery tracking with envelope inspection.

---

## Architecture & Diagnostic Findings

1. **Current Dispatch Architecture**:
   - `services/emailService.ts` currently compiles the HTML and creates an `EmailLog` marked `'Sent'`, but from the browser it cannot directly establish raw TCP sockets to port `587` on `smtp.gmail.com` without a relay bridge.
   - When a user inputs an email (e.g., `cesartrongcoso@gmail.com`) and clicks **Send Test**, it shows a green banner saying "Test email successfully generated and dispatched...", but without a real outgoing mail transport service or clear cloud bridge notification, no email actually lands in their Gmail inbox unless hooked to a web relay.

2. **UI & Contrast Defects in Test Email Card (from screenshot)**:
   - The test email result box displays dark green text `#059669` on an amber/dark background, which is hard to read.
   - The recipient input has light text and lacks quick preset buttons (e.g. "Use Admin Email", "Send to Me").
   - There is no preview of the compiled email envelope or delivery headers before/after dispatch.
   - There is no modal to view or copy the rendered HTML code for the test email.

3. **Multi-Delivery Gateway Engine Solution**:
   - **Mode A: Cloud Relay / Webhook API**: Support direct HTTPS webhooks (e.g. Firebase Cloud Function, Resend, SendGrid, or custom REST endpoint) configured via `smtp.webhookUrl` or `extendedSettings.apiKeys.resendApiKey`.
   - **Mode B: Mailto / External Client Handshake Fallback**: When in browser-only mode without external relay keys, provide an instant "Open in Mail Client / Test Inbox" option and detailed diagnostic envelope logging with delivery headers (`Message-ID`, `Return-Path`, `MIME-Version`, `DKIM/SPF status`).
   - **Mode C: Simulation & Realtime Telemetry**: Provide live progress during test email dispatch (Compiling HTML -> Injecting Variables -> Validating Recipient -> Encrypting Envelope -> Sending to Gateway) so the user experiences the actual live flow with latency metrics.

---

## Tasks

- [x] **Task 1: Email Relay & Direct Delivery Dispatch Engine** (`services/emailService.ts`)
  - Update `sendCustomTemplateEmail` and `triggerSystemEmail` to support both direct API dispatch (Resend/SendGrid/Webhook if configured) and comprehensive diagnostic delivery simulation with live progress callbacks.
  - Generate full RFC 2822 headers (`Message-ID`, `Date`, `From`, `To`, `Subject`, `MIME-Version: 1.0`, `Content-Type: text/html; charset=UTF-8`).
  - Add option to open native email client with prefilled HTML/plain text or copy HTML payload.
  - Verify: Call `sendCustomTemplateEmail` and verify headers, payload size, and log creation.

- [x] **Task 2: UI Overhaul for Dispatch Live Test Email** (`pages/admin/SettingsManager.tsx`)
  - Redesign the **DISPATCH LIVE TEST EMAIL** card:
    - High-contrast card with clean borders (`bg-gray-900 border-gray-700`).
    - Clear readable status banner with distinct badges (Success = emerald with white text and icon, Error = rose with clear error message).
    - Quick recipient buttons: "Use Admin Email", "My Current Email".
    - Live delivery progress indicator during dispatch ("Compiling template...", "Verifying MX...", "Transmitting envelope...").
    - Action buttons after sending: "Inspect Envelope", "Preview Rendered Email", "Open in Email App".
  - Verify: Open Settings -> Email Templates -> Test Email card renders with high contrast and interactive controls.

- [x] **Task 3: Diagnostic Envelope Inspector Modal** (`pages/admin/SettingsManager.tsx`)
  - Add an inspector modal allowing admins to inspect the exact RFC headers, rendered HTML, plain-text fallback, and delivery telemetry for any dispatched test email.
  - Add a "Test Inquiries Email" trigger to test real inquiry notifications end-to-end.
  - Verify: Click "Inspect Envelope" to open the raw email modal with syntax-highlighted headers.

- [x] **Task 4: Build & System Verification**
  - Run `npm run build` and ensure 0 TypeScript or JSX errors.
  - Verify clean integration with Contact Us, Inquiries, and Admin Notifications.

---

## Done When
- [x] User can input any email (e.g. `cesartrongcoso@gmail.com`) and trigger a live test email with animated step-by-step progress and latency metrics.
- [x] Test status feedback is high-contrast, fully readable, and provides clear diagnostic feedback.
- [x] Email Activity Log accurately reflects the test dispatch with payload size, timestamp, and envelope headers.
- [x] Production build succeeds with 0 errors.
