# 🎨 Design Specifications - PartnerOps (Sharakh)

## PIXEL-PERFECT Implementation Guide

This document details the exact pixel-perfect implementation of the Sharakh platform design system.

---

## 📐 Design System Foundation

### 1. Color Palette (Exact Hex Values - DO NOT VARY)

```css
--cat-yellow:     #FFCD11  /* Primary action color */
--cat-black:      #1A1A1A  /* Primary text color */
--cat-dark:       #111111  /* Dark backgrounds */
--cat-red:        #EF4444  /* Errors, expenses, danger */
--cat-green:      #10B981  /* Success, income, positive */
--cat-white:      #FFFFFF  /* Light backgrounds, cards */
--cat-gray:       #2A2A2A  /* Secondary cards */
--cat-mid:        #3D3D3D  /* Borders, dividers */
--cat-light:      #F0F0F0  /* Light accents */
--cat-muted:      #A0A0A0  /* Secondary text */
--bg-light:       #F4F5F7  /* Light page background */
--border-light:   #E5E7EB  /* Light borders */
```

### 2. Typography

#### Font Families
```css
--font-cairo:     'Cairo', sans-serif              /* Arabic text */
--font-barlow:    'Barlow Condensed', sans-serif   /* English text, numbers */
--font-primary:   'Cairo', 'Barlow Condensed', sans-serif
```

#### Font Weights
```
Regular (400):  Body text, descriptions
Medium (500):   Emphasis, labels
Bold (700):     Headings, important text
Black (900):    Page titles, large numbers
```

#### Font Sizes & Usage
```
Text               Size    Weight    Line Height   Letter Spacing
─────────────────────────────────────────────────────────────────
Page Title         28px    900       1.1           -0.5px
Section Title      16px    900       1.2           -0.3px
Heading            14px    700       1.2           0.02em
Body               13px    400       1.6           0
Label              12px    700       1              0.08em
Caption            10px    400       1.4           0.04em
Number (Large)     32px    900       1              -0.5px
Number (Medium)    20px    900       1              -0.3px
```

### 3. Layout Grid System

**Base**: 4px grid spacing

```
Spacing Scale:
1 unit   = 4px   (very small)
2 units  = 8px   (small)
3 units  = 12px  (small-medium)
4 units  = 16px  (standard)
5 units  = 20px  (medium)
6 units  = 24px  (medium-large)
7 units  = 28px  (large)
8 units  = 32px  (large)
10 units = 40px  (very large)
12 units = 48px  (huge)
```

### 4. Border Radius

```
none   = 0        (sharp corners)
sm     = 4px      (slight roundness)
md     = 6px      (medium roundness)
lg     = 8px      (rounded)
xl     = 12px     (more rounded)
2xl    = 16px     (very rounded)
3xl    = 20px     (extra rounded)
full   = 9999px   (pill shape, circles)
```

### 5. Box Shadows

```
none       = none
xs         = 0 1px 2px rgba(0,0,0,0.05)
sm         = 0 2px 8px rgba(0,0,0,0.08)
md         = 0 4px 12px rgba(0,0,0,0.1)
lg         = 0 4px 20px rgba(0,0,0,0.04)    /* PRIMARY */
xl         = 0 8px 30px rgba(0,0,0,0.12)
fab-shadow = 0 6px 20px rgba(255,205,17,0.3)  /* FAB only */
```

---

## 🎯 Component Specifications

### Form Elements

#### Input Fields
```
Height:           56px (h-14)
Border Radius:    12px (rounded-xl)
Border:           1px solid #E5E7EB
Background:       #FFFFFF
Text Color:       #1A1A1A
Font Size:        14px
Padding:          0 12px
Gap to Label:     6px below label

Focus State:
├─ Ring:           2px solid #FFCD11
├─ Border Color:   transparent
└─ Transition:     all 150ms ease

Placeholder:
├─ Color:         #A0A0A0 (--cat-muted)
└─ Font Style:    normal

Disabled State:
├─ Opacity:       0.5
├─ Cursor:        not-allowed
└─ Background:    #F4F5F7
```

#### Labels
```
Position:     Above input, block display
Font Size:    11px
Font Weight:  700
Color:        #1A1A1A
Text Transform: uppercase
Letter Spacing: 0.08em
Margin Bottom: 6px
```

### Buttons

#### Primary Button (Yellow)
```
Height:           56px (h-14)
Width:            100% (fullWidth) or auto
Background:       #FFCD11
Text Color:       #1A1A1A (always dark)
Text Transform:   uppercase
Font Weight:      900
Font Size:        14px
Letter Spacing:   0.03em
Border Radius:    12px (rounded-xl)
Padding:          0 24px (horizontal)
Border:           none

Hover State:
├─ Background:     #E6B800 (darken)
└─ Transform:      scale(1.05)

Active State:
├─ Transform:      scale(0.95)
└─ Transition:     transform 100ms ease

Disabled State:
├─ Opacity:       0.4
└─ Cursor:        not-allowed

Focus State:
├─ Outline:       2px solid #FFCD11
└─ Outline Offset: 2px
```

#### Secondary Button (White)
```
Height:           56px
Width:            auto
Background:       #FFFFFF
Text Color:       #1A1A1A
Border:           1px solid #E5E7EB
Border Radius:    12px
Other props:      Same as primary

Hover State:
├─ Background:     #F9FAFB
└─ Border Color:   #D1D5DB
```

#### Danger Button (Red)
```
Similar to Secondary but:
├─ Text Color:     #EF4444
├─ Border Color:   #EF4444
└─ Hover Background: rgba(239,68,68,0.06)
```

### Cards

#### Standard Card
```
Background:       #FFFFFF
Border:           1px solid #E5E7EB
Border Radius:    16px (rounded-2xl)
Padding:          16px (p-4) or 20px (p-5)
Box Shadow:       0 4px 20px rgba(0,0,0,0.04)
Transition:       all 200ms ease

Hover State (optional):
├─ Shadow:        0 8px 30px rgba(0,0,0,0.1)
└─ Transform:     translateY(-2px)
```

#### Card Header (if applicable)
```
Border Bottom:    1px solid #E5E7EB
Padding Bottom:   12px
Margin Bottom:    12px
Font Size:        13px
Font Weight:      700
Color:            #1A1A1A
Text Transform:   uppercase
Letter Spacing:   0.08em
```

---

## 📱 Page Layouts

### Driver Dashboard

#### Layout Structure
```
┌─────────────────────────────────────┐
│  HEADER (Yellow Gradient)           │  height: 60px, sticky
│  Logo, Name, Status, Notification   │  bg: linear-gradient(135deg, #FFCD11, #FFD700)
├─────────────────────────────────────┤
│  DRIVER BALANCE CARD                │  margin-top: 16px
│  Large Amount Display               │  font-size: 32px, Barlow Condensed
├─────────────────────────────────────┤
│  STATS GRID (2x2)                   │  grid-cols: 2
│  Income | Expenses                  │  gap: 10px
│  Advances | Net                     │  padding: 0 16px
├─────────────────────────────────────┤
│  TRANSACTIONS SECTION               │  margin-top: 16px
│  Title: "آخر المعاملات"             │  padding: 0 16px
│  Transaction List                   │  padding-bottom: 100px
├─────────────────────────────────────┤
│  BOTTOM NAV (Fixed)                 │  fixed bottom: 0
│  [Home] [Tx] [FAB] [Invoice] [User] │  height: 72px
│         ┌───────┐                   │  FAB: absolute -top-6
│         │   +   │                   │  width: 56px, height: 56px
│         └───────┘                   │
└─────────────────────────────────────┘
```

#### Color Coding for Transactions
```
Transaction Type    | Color   | Icon | Sign
─────────────────────────────────────────
Income             | #10B981 |  ↑   |  +
Expense            | #EF4444 |  ↓   |  -
Transfer           | #3B82F6 |  ⟳   |  ±
Transfer to Partner| #A0A0A0 |  →   |  →
```

### Partner Dashboard

#### Layout Structure
```
┌─────────────────────────────────────┐
│  HEADER (Yellow Curved)             │  height: 200px
│  Logo, Title "أهلاً", Date          │  border-radius-b: 32px
│  Hamburger Menu                     │  linear-gradient: #FFCD11 → #FFD700
├─────────────────────────────────────┤ ─────← negative margin -mt-16
│  STATS GRID (2x2 Mobile, 4 Desktop) │  z-index: 10
│  [Card] [Card]                      │  gap: 12px
│  [Card] [Card]                      │  px: 16px
├─────────────────────────────────────┤
│  RECENT OPERATIONS                  │  margin-top: 24px
│  Title: "آخر العمليات"              │  padding: 0 16px
│  Transaction List                   │
├─────────────────────────────────────┤
│  QUICK ACTIONS                      │  grid-cols: 2
│  [Primary CTA] [Secondary]          │  gap: 10px
│  [Secondary] [Secondary]            │
│                                     │  padding-bottom: 100px
├─────────────────────────────────────┤
│  BOTTOM NAV                         │  fixed, height: 72px
│  [Home] [Drivers] [Equipment]...   │  5 items
└─────────────────────────────────────┘
```

### Login Pages

#### Layout Structure
```
┌──────────────────────────────────┐
│                                  │  min-height: 100vh
│  bg: #F4F5F7                     │  display: flex
│  centered content                │  flex-direction: column
│                                  │  align-items: center
│  ┌────────────────────────────┐  │  justify-content: center
│  │  WHITE CARD                │  │
│  │  ┌──────────────────────┐  │  │  width: 90%, max-width: 400px
│  │  │  🚜 Logo            │  │  │  bg: #FFFFFF
│  │  │  Title              │  │  │  border-radius: 24px
│  │  │  Subtitle           │  │  │  padding: 32px
│  │  │  ─────────────────  │  │  │  box-shadow: 0 8px 24px ...
│  │  │  [Email Input]      │  │  │  gap: 16px between elements
│  │  │  [Password Input]   │  │  │
│  │  │  [Forgot Link]      │  │  │
│  │  │  ─────────────────  │  │  │
│  │  │  [Login Button]     │  │  │
│  │  │  [Sign Up Link]     │  │  │
│  │  └──────────────────┘  │  │  │
│  └────────────────────────┘  │  │
│                              │  │
│  [Language Selector]         │  │  (if applicable)
│                              │  │
│  [Error Messages]            │  │  (if applicable)
│                              │  │
└──────────────────────────────┘  │

Key Metrics:
├─ Card Width:         90% (mobile), max-400px
├─ Card Padding:       32px
├─ Border Radius:      24px (rounded-3xl)
├─ Input Height:       56px
├─ Button Height:      56px
├─ Gap Between Elements: 16px
└─ Background Color:   #F4F5F7
```

---

## 🔄 Responsive Behavior

### Mobile (390px)
```
• Bottom navigation visible
• 1-column layouts
• Full-width cards (margin: 0 16px)
• Hamburger menu for navigation
• FAB button visible on driver dashboard
• 2x2 grid for stats
```

### Tablet (768px)
```
• Bottom navigation visible
• 2-column layouts
• Stats grid: 4 columns
• Sidebar starts to appear (hidden by default)
• Cards with margin padding
```

### Desktop (1920px)
```
• Bottom navigation hidden (replaced by sidebar)
• Multi-column layouts
• Full-width content with max-width container
• Cards with consistent margin
• Sidebar visible on left
• Top navigation bar (optional)
```

---

## 🎭 States & Animations

### Button States
```
Default    → Hover (scale 1.05) → Active (scale 0.95)
           ↓
           Disabled (opacity 0.4, cursor not-allowed)
           ↓
           Focus (ring 2px #FFCD11)
```

### Input States
```
Empty      → Focused (ring 2px #FFCD11)
           ↑
           Error (ring 2px #EF4444)
           ↑
           Filled (border #E5E7EB)
           ↑
           Disabled (opacity 0.5)
```

### Card States
```
Default    → Hover (shadow increase, transform up -2px)
           ↓
           Active/Selected (border-left 4px #FFCD11)
```

### Transitions
```
Border Color:      150ms ease
Background Color:  200ms ease
Transform:         100ms ease
Opacity:          200ms ease
Box Shadow:       200ms ease
All Combined:     250ms ease
```

---

## ♿ Accessibility

### Focus States
- All interactive elements have visible focus rings
- Focus ring color: #FFCD11
- Focus ring width: 2px
- Focus ring offset: 2px

### Color Contrast
- Text on #FFCD11: Use #1A1A1A (WCAG AAA)
- Text on #FFFFFF: Use #1A1A1A (WCAG AAA)
- Text on #F4F5F7: Use #1A1A1A (WCAG AAA)
- Text on dark backgrounds: Use #FFFFFF (WCAG AA)

### Keyboard Navigation
- All buttons/links keyboard accessible
- Tab order logical and visible
- Enter/Space activates buttons
- Escape closes modals

### Screen Readers
- Semantic HTML (button, input, nav, main, etc.)
- ARIA labels for icon-only buttons
- Form labels associated with inputs
- Skip to content links

---

## 📋 Implementation Checklist

### Colors
- [ ] All colors use exact hex values (no RGB, no rgba unless needed)
- [ ] #FFCD11 never varies (primary consistency)
- [ ] Gradients use linear-gradient(135deg, #FFCD11, #FFD700)
- [ ] All background colors from palette

### Typography
- [ ] Cairo font imported for Arabic
- [ ] Barlow Condensed imported for numbers
- [ ] Font weights: 400, 500, 700, 900
- [ ] Line heights: 1, 1.2, 1.6
- [ ] Letter spacing applied correctly

### Layout
- [ ] dir="rtl" on root elements
- [ ] 4px base grid system
- [ ] Responsive breakpoints: 390px, 768px, 1920px
- [ ] Bottom navigation fixed on mobile
- [ ] FAB button absolute positioned (-top-6)

### Components
- [ ] Inputs: h-14, rounded-xl, 1px border
- [ ] Buttons: h-14, rounded-xl, uppercase text
- [ ] Cards: rounded-2xl, box-shadow lg
- [ ] Stats grid: 2x2 mobile, 4 cols desktop
- [ ] Headers: gradient background, sticky

### States
- [ ] Focus rings: 2px #FFCD11
- [ ] Hover effects: scale 1.05 for buttons
- [ ] Active effects: scale 0.95
- [ ] Disabled: opacity 0.4
- [ ] Error: ring 2px #EF4444

---

## 🎨 Design Files & Assets

### Fonts
```
Cairo:              https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;900
Barlow Condensed:   https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;700;900
```

### Icons
- Lucide React: https://lucide.dev
- Emojis: Unicode (🚜, 💰, 📊, etc.)

### Breakpoints
```
Mobile:   320px - 640px   (focus: 390px)
Tablet:   641px - 1024px  (focus: 768px)
Desktop:  1025px+         (focus: 1920px)
```

---

## ✅ Verification Checklist

Before considering a component "pixel-perfect":

- [ ] Colors match exactly (use color picker)
- [ ] Spacing matches (use browser DevTools)
- [ ] Font sizes correct (check computed styles)
- [ ] Border radius exact (h-14 = 56px height, etc.)
- [ ] Shadows match specification
- [ ] Responsive behavior matches all breakpoints
- [ ] RTL layout correct
- [ ] Focus states visible
- [ ] Hover states working
- [ ] No layout shifts on state changes
- [ ] Performance: First Paint < 1s, LCP < 2.5s

---

**Last Updated**: 2026-07-13
**Status**: ✅ PRODUCTION SPECIFICATIONS
**Version**: 1.0

