# 🎨 Designer Review Checklist

**Project**: SHARAKH Platform UI Redesign  
**Date**: July 13, 2026  
**Viewport**: iPhone 14 (390px × 844px)  
**Theme**: Light Mode  

---

## 📱 Page-by-Page Review

### ✅ PAGE 1: Partner Login (`/login`)

**Visual Elements to Verify**:
- [ ] Page background is light gray (`#F4F5F7`) - NOT dark
- [ ] Card is pure white with heavy rounded corners (32px)
- [ ] Card has shadow but NO yellow border
- [ ] Logo (🚜) is in yellow circle inside card at top
- [ ] Text "SHARAKH" next to logo in card
- [ ] Subtitle text below logo
- [ ] Email input field: light background, rounded corners
- [ ] Password input field: light background, rounded corners  
- [ ] Labels are dark black, uppercase, small font
- [ ] Login button is bright yellow (#FFCD11), full width
- [ ] Button has proper rounded corners (12px)
- [ ] Focus state shows yellow ring around inputs
- [ ] Error alert (if visible) has red background
- [ ] Sign-up link text is yellow
- [ ] RTL layout is correct (Arabic text right-aligned)
- [ ] All text is readable and properly sized

**Dimensions to Check**:
- [ ] Card width: Max ~400px, centered on screen
- [ ] Input height: 56px (h-14)
- [ ] Button height: 56px (h-14)
- [ ] Padding inside card: 32px (p-8)
- [ ] Border radius on card: 24-32px
- [ ] Border radius on inputs/button: 12px

**Interactions to Test**:
- [ ] Hover on button shows slight background change
- [ ] Focus on inputs shows yellow ring
- [ ] Keyboard navigation works
- [ ] No horizontal scroll

---

### ✅ PAGE 2: Driver Login (`/driver/login?p=demo`)

**Visual Elements to Verify**:
- [ ] Same light theme as Partner Login
- [ ] Yellow bar at top with logo and title
- [ ] Logo (🚜) in yellow circle
- [ ] Title "SHARAKH OPS" in black
- [ ] Language selector buttons (6 languages)
- [ ] Active language button: yellow background, black text
- [ ] Inactive language buttons: gray background
- [ ] Username input field: light background
- [ ] Password input field: light background
- [ ] Password toggle icon (eye button) visible
- [ ] Login button: yellow (#FFCD11), full width
- [ ] Helper text at bottom
- [ ] Error message section (if no valid partner link)
- [ ] Proper spacing between sections
- [ ] All text colors and sizes correct

**Languages to Verify**:
- [ ] عربي (Arabic) - Should be selected/highlighted
- [ ] اردو (Urdu)
- [ ] বাংলা (Bengali)
- [ ] नेपाली (Nepali)
- [ ] Filipino
- [ ] English

**Interactions to Test**:
- [ ] Click language buttons - they should highlight
- [ ] Hover states on buttons
- [ ] Focus rings on inputs
- [ ] No horizontal scroll on any viewport

---

### ✅ PAGE 3: Partner Dashboard (`/mockups/partner-dashboard`)

**Visual Elements to Verify**:

**Header Section**:
- [ ] Yellow gradient background (135deg angle)
- [ ] Curved bottom border (32px radius)
- [ ] Logo icon (🚜) in top-left
- [ ] Hamburger menu (☰) in top-right
- [ ] Title: "أهلاً، شريك" (Hello, Partner)
- [ ] Subtitle: Date display (Arabic format)
- [ ] Header shadow visible

**Stats Grid (2x2)**:
- [ ] 4 cards arranged in 2x2 grid
- [ ] Cards overlap with header (negative margin)
- [ ] Card 1: "إجمالي الدخل" (💰) - 125,450
- [ ] Card 2: "صافي الأرباح" (📈) - 98,200
- [ ] Card 3: "الدورات المفتوحة" (⏱️) - 2
- [ ] Card 4: "السائقون النشطون" (👥) - 8
- [ ] Each card has white background with shadow
- [ ] Numbers are large (24px) and bold
- [ ] Labels are small, uppercase, gray
- [ ] Icon emoji visible in each card

**Recent Operations Section**:
- [ ] Section title: "آخر العمليات"
- [ ] 3 transaction items visible
- [ ] Each item shows: name, description, amount
- [ ] Amounts are color-coded:
  - [ ] Green (#10B981) for income: +5,250
  - [ ] Red (#EF4444) for expenses: -850, -2,000
- [ ] Currency symbol "ر.س" displayed
- [ ] Proper spacing between items

**Quick Actions Section**:
- [ ] Section title: "إجراءات سريعة"
- [ ] 4 buttons in 2x2 grid
- [ ] Button 1 (primary): "دورة جديدة" - yellow background
- [ ] Buttons 2-4 (secondary): white background, gray border
- [ ] Buttons: "إضافة سائق", "عرض الدورات", "الإعدادات"
- [ ] Proper button sizing and spacing
- [ ] No horizontal scroll

**Colors to Verify**:
- [ ] Header gradient: #FFCD11 to #FFD700
- [ ] Text: #1A1A1A (dark black)
- [ ] Secondary text: #A0A0A0
- [ ] Cards: #FFFFFF
- [ ] Borders: #E5E7EB
- [ ] Background: #F4F5F7

---

### ✅ PAGE 4: Driver Dashboard (`/mockups/driver-dashboard`)

**Visual Elements to Verify**:

**Sticky Header**:
- [ ] Yellow gradient background at top
- [ ] Fixed/sticky positioning (stays at top when scrolling)
- [ ] Driver name: "أحمد الراشد"
- [ ] Logo (🚜) on left side
- [ ] Hamburger menu (☰) on right side
- [ ] Proper height and padding

**Balance Card**:
- [ ] Large balance display: 12,450
- [ ] Label: "رصيدك" (Your Balance)
- [ ] Amount font size: Large (48px)
- [ ] Currency: "ر.س"
- [ ] White card with shadow
- [ ] Center-aligned text

**Stats Grid (2x2)**:
- [ ] 4 cards showing: Income, Expenses, Advances, Net
- [ ] Card 1: "الدخل" - +45,200 (GREEN, #10B981)
- [ ] Card 2: "المصاريف" - -8,500 (RED, #EF4444)
- [ ] Card 3: "التقدمات" - -5,000 (ORANGE, #F59E0B)
- [ ] Card 4: "الصافي" - +31,700 (BLACK, #1A1A1A)
- [ ] Numbers in Barlow Condensed font
- [ ] Proper color coding

**Recent Transactions**:
- [ ] Section title: "آخر العمليات"
- [ ] 3 transactions shown
- [ ] Each shows: date/time, description, amount
- [ ] Amounts color-coded (green for income, red for expense)
- [ ] Proper formatting and spacing

**Bottom Navigation**:
- [ ] Fixed at bottom of screen
- [ ] White background
- [ ] 5 navigation items: 🏠 📊 [space] 💰 ⚙️
- [ ] Active item highlighted in yellow
- [ ] Rounded top corners (20px)
- [ ] Height: 72px (sufficient for touch)
- [ ] Shadow on top border

**Floating Action Button (FAB)**:
- [ ] Yellow circle (#FFCD11) overlapping nav
- [ ] Size: 56px diameter
- [ ] Position: Center, above nav
- [ ] Plus icon (+) in center
- [ ] Strong shadow visible
- [ ] Proper z-index (appears above nav)

**Interactions to Test**:
- [ ] Bottom nav doesn't hide content
- [ ] FAB button is clickable
- [ ] Scroll doesn't break layout
- [ ] Header stays sticky

---

### ✅ PAGE 5: Add Transaction Modal (`/mockups/add-transaction`)

**Visual Elements to Verify**:

**Modal Container**:
- [ ] Bottom sheet modal design
- [ ] Slides up from bottom with animation
- [ ] Rounded top corners (32px)
- [ ] White background
- [ ] Strong shadow: `-8px blur`
- [ ] Handle bar at top (gray line, 40px wide)

**Title**:
- [ ] Title: "إضافة عملية" (Add Transaction)
- [ ] Center-aligned
- [ ] Large font (20px), bold (900 weight)
- [ ] Dark black color (#1A1A1A)

**Type Selector**:
- [ ] Label: "نوع العملية" (Transaction Type)
- [ ] Two radio buttons side-by-side
- [ ] Option 1: "📈 دخل" (Income) - DEFAULT SELECTED
- [ ] Option 2: "📉 مصروف" (Expense)
- [ ] Selected state: 
  - [ ] Yellow border (2px, #FFCD11)
  - [ ] Light yellow background (#FFFBF0)
  - [ ] Black text
- [ ] Unselected state:
  - [ ] Gray border (#E5E7EB)
  - [ ] Light gray background (#F9FAFB)

**Amount Input**:
- [ ] Label: "المبلغ (ر.س)" (Amount in SAR)
- [ ] Default value: 850
- [ ] Number input type
- [ ] Light background (#F9FAFB)
- [ ] Left-to-right (LTR) text alignment
- [ ] Placeholder: "0.00"
- [ ] Helper text: "أدخل المبلغ بالريال السعودي"

**Category Dropdown**:
- [ ] Label: "الفئة" (Category)
- [ ] Placeholder: "اختر الفئة..." (Select category)
- [ ] Options:
  - [ ] نقل/رحلة (Trip/Transport)
  - [ ] وقود (Fuel)
  - [ ] صيانة (Maintenance)
  - [ ] رسوم (Fees)
  - [ ] أخرى (Other)
- [ ] Light background
- [ ] Proper dropdown styling

**Description Textarea**:
- [ ] Label: "الوصف" (Description)
- [ ] Default text: "نقل حي الملز - العاصمة"
- [ ] Min height: 80px
- [ ] Light background
- [ ] RTL text alignment
- [ ] Helper text: "اختياري: أضف ملاحظات عن العملية"

**Date/Time Input**:
- [ ] Label: "التاريخ والوقت" (Date and Time)
- [ ] Format: datetime-local
- [ ] Default: "2026-07-13T14:45"
- [ ] Light background
- [ ] Proper input styling

**Action Buttons**:
- [ ] Primary button: "✓ حفظ العملية" (Save Transaction)
  - [ ] Yellow background (#FFCD11)
  - [ ] Black text (#1A1A1A)
  - [ ] Bold font (900 weight)
  - [ ] Full width
  - [ ] Proper padding
- [ ] Secondary button: "إلغاء" (Cancel)
  - [ ] Gray background (#F0F0F0)
  - [ ] Gray text (#A0A0A0)
  - [ ] Full width
  - [ ] Below primary button

**Spacing**:
- [ ] Proper padding: 16px
- [ ] Proper gaps: 16px between form groups
- [ ] Button margin-top: 20px

---

## 🎨 Design System Verification

### Colors Used ✅
```
Primary Yellow:     #FFCD11 (buttons, highlights, active states)
Text Black:         #1A1A1A (headings, labels, primary text)
Background Gray:    #F4F5F7 (page background)
Card White:         #FFFFFF (all card containers)
Success Green:      #10B981 (income, positive amounts)
Danger Red:         #EF4444 (expenses, negative amounts)
Accent Orange:      #F59E0B (advances, warnings)
Border Gray:        #E5E7EB (dividers, borders)
Muted Gray:         #A0A0A0 (secondary text, hints)
```

**Verification**:
- [ ] All yellows are #FFCD11 (no variations)
- [ ] All blacks are #1A1A1A (consistent)
- [ ] No colors are approximated
- [ ] Color contrast is ≥4.5:1 (WCAG AA)

### Fonts Used ✅
```
Arabic:     Cairo (weights: 400, 500, 700, 900)
English:    Barlow Condensed (weights: 400, 500, 700, 900)
```

**Verification**:
- [ ] Arabic text uses Cairo font
- [ ] English/numbers use Barlow Condensed
- [ ] Font weights are correct (bold = 900, etc.)
- [ ] RTL text is properly aligned

### Spacing Grid ✅
```
Base Unit:  4px
Scales:     4, 8, 12, 16, 20, 24, 28, 32...
```

**Verification**:
- [ ] All spacing uses 4px multiples
- [ ] Padding is consistent (12px, 14px, 16px, etc.)
- [ ] Gap spacing is consistent (8px, 12px)
- [ ] No arbitrary spacing

### Border Radius ✅
```
Buttons/Inputs: 12px
Cards:          16px
Modals:         20-32px
```

**Verification**:
- [ ] All buttons have 12px radius
- [ ] All cards have 16px radius
- [ ] Headers/modals have 20-32px radius
- [ ] Consistency throughout

---

## 🎯 Sign-Off Checklist

**Designer Name**: _________________  
**Date**: _________________

- [ ] All visual elements match specification
- [ ] Colors are pixel-perfect
- [ ] Typography is correct
- [ ] Spacing and alignment are accurate
- [ ] RTL layout works properly
- [ ] Mobile responsiveness verified (390x844)
- [ ] Interactions are smooth
- [ ] Accessibility standards met
- [ ] No visual bugs or inconsistencies
- [ ] Ready for production deployment

**Overall Assessment**:
- [ ] APPROVED - Ready to deploy
- [ ] APPROVED WITH MINOR NOTES
- [ ] NEEDS REVISION

**Comments**:
_[Add any feedback or notes]_

---

**Designer Signature**: ___________________  
**Date**: ___________________

---

Generated: 2026-07-13  
Viewport: 390x844 (iPhone 14)  
Theme: Light Mode  
Language: Arabic (RTL)
