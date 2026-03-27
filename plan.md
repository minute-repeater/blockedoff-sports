# SportCalendar UI Redesign Plan

## Overview
Complete visual overhaul: light/dark toggle (light baseline), distinctive typography, card elevation, micro-interactions, entrance animations, background atmosphere.

## Steps

### 1. Font swap in layout.tsx
- Replace Geist Sans/Mono with **DM Sans** (body) + **Outfit** (headings)
- Both are free Google Fonts via next/font/google

### 2. Complete globals.css rewrite
- Light mode as `:root` default
- Dark mode via `[data-theme="dark"]` selector
- Light: #fafbfc bg, #ffffff surfaces, #e5e7eb borders, #111827 text
- Dark: #0c1222 bg, #162032 surfaces, #1e3050 borders, #e8ecf4 text
- Subtle dot-grid background pattern (CSS radial-gradient)
- Card shadow utilities
- @keyframes fadeInUp for entrance animations
- Glassmorphism header styles
- Theme transition timing

### 3. Theme toggle in page.tsx header
- Sun/moon SVG icon button
- localStorage persistence
- System preference detection on mount
- `data-theme` attribute on `<html>`

### 4. Card & component restyling in page.tsx
- Tournament cards: box shadows, hover lift (translateY -2px), shadow increase
- Event cards: left accent color bar (4px)
- Subscribe CTA: gradient accent background, subtle glow
- Sport/filter pills: scale on hover
- Better spacing and padding throughout
- Staggered entrance animation classes on cards

### 5. About page + tournament page updates
- Apply same light/dark theme variables
- Consistent card styling

### 6. Manifest + metadata updates
- Update theme_color for light mode
- Ensure OG colors work

### 7. Build & verify
