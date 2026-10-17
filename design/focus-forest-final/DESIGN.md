---
name: Forest of Focus
colors:
  surface: '#fcf9f0'
  surface-dim: '#dcdad1'
  surface-bright: '#fcf9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ea'
  surface-container: '#f1eee5'
  surface-container-high: '#ebe8df'
  surface-container-highest: '#e5e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#424843'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f3f1e8'
  outline: '#727973'
  outline-variant: '#c1c8c2'
  surface-tint: '#456553'
  primary: '#032517'
  on-primary: '#ffffff'
  primary-container: '#1b3b2b'
  on-primary-container: '#83a590'
  inverse-primary: '#abcfb8'
  secondary: '#4c6358'
  on-secondary: '#ffffff'
  secondary-container: '#cee9da'
  on-secondary-container: '#52695e'
  tertiary: '#2f1c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b2f00'
  on-tertiary-container: '#d09131'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7ebd4'
  primary-fixed-dim: '#abcfb8'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#2d4d3c'
  secondary-fixed: '#cee9da'
  secondary-fixed-dim: '#b3ccbf'
  on-secondary-fixed: '#092017'
  on-secondary-fixed-variant: '#354c41'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#feb956'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#fcf9f0'
  on-background: '#1c1c17'
  surface-variant: '#e5e2da'
typography:
  display-timer:
    fontFamily: Plus Jakarta Sans
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 96px
    letterSpacing: -0.04em
  display-timer-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 46px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Noto Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 25px
    letterSpacing: 0em
  body-sm:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

The design system establishes a tranquil, restorative digital sanctuary for deep work and intentional focus. Rejecting hyper-stimulating, gamified productivity tropes, it embraces an aesthetic of calm stewardship, meditative flow, and organic tactile presence.

### Visual Style: Soft Tactile Minimalism & Clay Organicism
The interface blends warm minimalism with subtle claymorphism and organic tactile depth:
- **Surface Quality:** Velvety matte layers inspired by pressed paper, smooth river stones, and mossy woodland soil.
- **Physicality:** Generously rounded forms (squircle profiles) paired with layered, ambient naturalistic shadows and subtle inner highlights that emulate soft tactile stones or clay tags.
- **Emotional Resonance:** Quietude, sustained calm, and gentle momentum without cortisol-spiking notifications or aggressive time crunches.

## Colors

The palette is rooted in woodland flora, unbleached linen, and quiet daylight.

- **Primary (`#1B3B2B` - Deep Forest):** Imparts weight, ground, and clarity. Used for primary call-to-actions, primary timers, selected controls, and critical headings.
- **Secondary (`#8FA89B` - Sage Green):** Used for ambient containers, active session tracks, progress indicators, and peaceful states. Tonal step-downs (`#D4E2D4`, `#EBF3E8`) build soft surface hierarchy.
- **Tertiary (`#E09F3E` - Warm Amber/Sunlight Accent):** Used sparingly to celebrate completed focus blocks, harvest milestones, active streak markers, and glowing resting states.
- **Neutral (`#FAF7EE` - Warm Cream Canvas):** The base atmospheric background. Paired with `#F5F1E4` (Oatmeal) and `#FFFFFF` for tactile foreground cards and floating dials.
- **Text & Contrast (`#14281D` / `#1C2826` - Charcoal Moss):** High contrast legibility without the harshness of pure black, preserving optical comfort during long sessions.

## Typography

The typography pairs the geometric, humanist softness of **Plus Jakarta Sans** for digits, prominent headers, and system status tags with **Noto Sans** (with fallback to system Pretendard/Noto Sans KR) for natural, rhythmic Korean body text and copy.

### Guidelines
- **Timer Display:** Strict tabular figures (`tnum`) ensure time counter numerals do not jitter during active sessions.
- **Line Heights:** Generously loosened line heights (`1.6` to `1.7x` for Korean prose) prevent visual fatigue during quiet contemplative reads.
- **Word Break:** Use `word-break: keep-all;` on all Korean text nodes to avoid unnatural word wrapping.

## Layout & Spacing

The layout is built as a single-viewport centric, calm sanctuary that adapts cleanly across screen sizes.

### Structure
- **Mobile (< 768px):** Single-column vertical flow with generous bottom clearance for thumbs. Margins set to `1.25rem`. Focus dial sits centered with collapsible session parameters.
- **Tablet (768px - 1024px):** Centered card layout with a max-width container of `680px` providing a dedicated, distraction-free stage.
- **Desktop (> 1024px):** Balanced 12-column grid or centered double-pane layout (`max-w-5xl`). The primary focus dial commands the central 7 columns, while the tree ambient log/forest journal occupies the adjacent 5 columns.

Margins prioritize breathing room: at least `2.5rem` on desktop outer wrappers to isolate user attention from browser clutter.

## Elevation & Depth

Visual hierarchy uses **Tactile Clay Layering** rather than harsh directional dropshadows. Elements mimic rounded organic forms resting gently on a soft surface.

- **Base Canvas:** `#FAF7EE` (Warm unbleached cream), completely flat.
- **Level 1 (Ambient Inset/Recessed Surfaces):** Used for track troughs and inactive input wells.
  - Box-shadow: `inset 0 2px 4px 0 rgba(20, 40, 29, 0.05)`.
  - Background: `#F5F1E4`.
- **Level 2 (Quiet Cards & Surfaces):** Main timer island and stats panels.
  - Background: `#FFFFFF` or `#FDFCF7`.
  - Box-shadow: `0 4px 20px -2px rgba(27, 59, 43, 0.05), 0 1px 3px 0 rgba(27, 59, 43, 0.03)`.
  - Border: `1px solid rgba(143, 168, 155, 0.22)`.
- **Level 3 (Tactile Interactive Elements - Buttons, Active Pills):**
  - Primary button: `#1B3B2B` with a warm ambient ground shadow: `0 8px 24px -4px rgba(27, 59, 43, 0.28), 0 2px 6px -1px rgba(27, 59, 43, 0.16)`.
  - Clay secondary button: `#EBF3E8` with a dual subtle highlight: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px 0 rgba(27, 59, 43, 0.06)`.
- **Level 4 (Floating Dialogs & Completed Forest Garden Modal):**
  - Backdrop: `rgba(20, 40, 29, 0.35)` with `backdrop-filter: blur(8px)`.
  - Shadow: `0 20px 40px -8px rgba(20, 40, 29, 0.18)`.

## Shapes

The form language is thoroughly organic, rounded, and smooth. Sharp corners are avoided completely.

- **Pill & Heavy Rounding (Scale 3):** Standard buttons, badges, chips, and quick-onboarding inputs adopt full pill geometry (`rounded-full`).
- **Feature Cards & Modal Dials:** Formed with `rounded-3xl` (24px to 32px radii), invoking river stones and smooth clay tablets.
- **Interactive States:** Soft squash-and-stretch feedback on interactions (`transform: scale(0.98)` on active press) reinforces the gentle, tactile physicality.

## Components

### 1. Primary Action & Focus Buttons
- **Touch Target:** Minimum 56px height on mobile; 64px on main focus action.
- **Appearance:** Pill-shaped (`rounded-full`), Deep Forest (`#1B3B2B`) fill with crisp Warm Cream text (`#FAF7EE`), accompanied by deep organic shadow.
- **Micro-interactions:** On hover, brightness subtly lifts with `-translate-y-0.5`. On click/active, smoothly depresses (`scale-98`) with reduced shadow.

### 2. Time Control Chips & Preset Selectors
- **Structure:** Pill tags (e.g., "25분 몰입", "50분 심층", "5분 휴식").
- **Default State:** Oatmeal tint (`#F5F1E4`), border `1px solid rgba(143, 168, 155, 0.25)`, text Deep Moss (`#1B3B2B`).
- **Selected State:** Soft Sage fill (`#D4E2D4`), text `#14281D`, bolstered by a subtle inner white bevel glow.

### 3. Tactile Card Containers
- **Appearance:** `rounded-3xl`, padded generously (`2rem`), background `#FFFFFF` over `#FAF7EE` canvas.
- **Borders:** Ultra-delicate leaf-tinted border (`rgba(143, 168, 155, 0.2)`).

### 4. Input Fields & Quick Onboarding
- **Style:** Pill-shaped text field optimized for instant nickname entry (e.g., "숲에서 사용할 이름을 입력하세요").
- **Background:** `#F5F1E4` recessed inset, transitioning to `#FFFFFF` with a warm Amber (`#E09F3E`) glow ring upon focus.
- **Microcopy:** Friendly, low-pressure tone ("비밀번호 없이 3초 만에 시작해요").

### 5. Checkboxes, Toggles & Organic Radios
- **Design:** Custom circular clay toggles. When enabled, toggles smoothly slide with an organic spring curve into Warm Amber or Deep Forest with a leaf or seed glyph inside.

### 6. Forest Growth Dial & Habitat Status (App-Specific)
- **Ring Component:** Circular progress indicator with rounded stroke caps. Track uses `#EBF3E8`, active growth uses a fluid gradient between `#8FA89B` and `#1B3B2B`.
- **Center Habitat:** Dynamic SVG woodland illustration (sprout 🌱 -> sapling 🌿 -> dense oak 🌳) that gently breathes (`scale` oscillation over 4s) during active focus sessions.