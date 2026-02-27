# Agent Instructions for Sagar's Portfolio

This document contains key information and instructions for agents working on this repository.

## Project Overview
- **Framework:** [Astro](https://astro.build/) (v5+) with TypeScript in strict mode.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) integrated as a Vite plugin.
- **Deployment:** GitHub Pages at `https://sagar.im/`.
- **Base Path:** `/` (configured in `astro.config.mjs`).

## Design & Typography
- **Primary Theme:** Light mode only (white background, dark zinc-900 text) with bright orange brand color (`#ff5f1f`).
- **Typography:**
  - Headings: 'Instrument Serif' (No italics, font-thin).
  - Body: 'Host Grotesk'.
- **Responsive Design:** Uses fluid typography with `vw` units.
- **Hero Section:** Minimalist design, left-aligned hero title with vertical spacing.

## Content Management
- **Content Collections:** Located in `src/content/`. Apps are managed as individual Markdown files in `src/content/apps/`.

## Development Workflow
- **Package Manager:** `npm`.
- **Pre-commit Hook:** Managed via **Husky**. On every commit, a screenshot utility runs to update the `screenshots/` directory.
- **Screenshots:**
  - Script: `scripts/take-screenshots.mjs`.
  - Commands: `npm run take-screenshots`.
  - Artifacts: `screenshots/desktop.png` and `screenshots/mobile.png`.
- **UI Verification:** Playwright is used for UI testing.
  - To run tests locally: `npm run dev -- --host > dev_server.log 2>&1 & sleep 5 && npx playwright test`.

## Coding Guidelines
- **CSS:** Use Tailwind v4 theme variables defined in `src/styles/global.css`.
- **Images:** The horizontal 'Apps' list uses `snap-x snap-mandatory` for mobile-friendly scrolling. Use the `no-scrollbar` utility to hide scrollbars where appropriate.
- **Planning:** Always establish a formal plan using `set_plan` after clarifying requirements. Use deep planning mode to confirm assumptions via `message_user` or `request_user_input`.
- **Verification:** Always verify changes using Playwright or manual checks before submitting.
