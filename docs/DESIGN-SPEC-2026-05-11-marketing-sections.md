---
title: "Cyprus Road Marketing Enhancement — Design Spec"
date: "2026-05-11"
phase: "Design"
status: "Approved"
approach: "Narrative Flow (Approach 3)"
scope: "Minimal (3 testimonials, 4 benefits, enhanced hero)"
---

# Cyprus Road Marketing Enhancement — Design Spec

## Overview

Enhance Cyprus Road website with adventurous/lifestyle positioning through three marketing sections: enhanced hero, testimonials, and benefits. Goal: combine social proof + specific benefits while maintaining minimal scope and fast deployment.

**Tone:** Adventurous/Lifestyle (freedom, exploration, journey, experiences)  
**Target:** Affluent professionals & tourists (35-65) seeking luxury + reliability  
**Tech:** React/Next.js (existing)

---

## 1. Enhanced Hero Section

### Current State
```
Headline: "Discover Cyprus in a car built for the journey"
Subheading: "Drive where the road takes you. Premium fleet. No limits."
```

### Redesigned
```
Headline: "Start Your Cyprus Story"
Subheading: "Drive where the road takes you. Premium fleet. No limits."
CTA Button: "Get in Touch"
```

### Design Details
- **Headline change:** Shifts from product-focused → emotional/narrative ("Start Your Story" vs "Discover")
- **Subheading:** Unchanged (already strong)
- **Button styling:** Gold/bronze accent background with white text, rounded corners, hover effect (slight scale + shadow)
- **Visual:** Keep existing background image/video. Enhance text contrast and button prominence.
- **Layout:** Centered text, button below subheading. Mobile-responsive (stack on small screens).

### Success Criteria
- Headline establishes narrative frame (adventure/exploration)
- Button is visually prominent and clickable
- Text is legible on background

---

## 2. Testimonials Section

### Structure
Three customer testimonials in a card grid (3-column desktop, 1-column mobile).

### Testimonials (North Cyprus Locations & Human Language)

**Testimonial 1:**
```
Name: Ahmed
Location: Kyrenia
Rating: ⭐⭐⭐⭐⭐ (5 stars, visible)
Quote: "Rented the Yaris for a week. Drove up to Bellapais Abbey, down to the harbour. 
Handled rough roads perfectly. Staff was helpful when I needed to add an extra day. 
Would rent again."
```

**Testimonial 2:**
```
Name: Emma
Location: Famagusta
Rating: ⭐⭐⭐⭐⭐ (5 stars, visible)
Quote: "Got the Honda CR-V. Went exploring with friends, hit some dirt roads toward 
the mountains. Car never had issues. Worth the price for peace of mind."
```

**Testimonial 3:**
```
Name: Tariq
Location: Nicosia
Rating: ⭐⭐⭐⭐⭐ (5 stars, visible)
Quote: "Needed a car for 3 days. Booked online, picked it up same day. The Fiat 500 
was fun, easy to park in the old city. Their WhatsApp support actually replied within 
minutes. Solid experience."
```

### Card Design
- **Layout per card:**
  - Name + Location (top, bold)
  - Star rating (5 stars, gold/bronze color)
  - Quote text (italic, ~80 chars per line)
  - Subtle gold/bronze left border (4px)
- **Card styling:** White background, soft shadow, subtle rounded corners (8px)
- **Grid:** 3 columns on desktop (>768px), 1 column on tablet/mobile
- **Spacing:** 24px gap between cards

### Customization Notes
- Names and locations can be swapped if user prefers different testimonials
- All quotes should maintain North Cyprus context (Kyrenia, Famagusta, Nicosia, etc.)
- Star ratings must be visible (design choice for trust-building)

---

## 3. Benefits Section

### Structure
Four key benefits with simple line icons, headline, and description.

### Benefits (4 Points)

**Benefit 1: Reliability**
- Icon: Simple checkmark or shield outline
- Headline: "Dependable Fleet"
- Description: "Premium vehicles, regularly maintained. Drive without worry."

**Benefit 2: 24/7 Support**
- Icon: Simple phone or headset outline
- Headline: "Always Available"
- Description: "Support when you need it. Via WhatsApp, call, or email."

**Benefit 3: Comfort & Features**
- Icon: Simple car or seat outline
- Headline: "Premium Comfort"
- Description: "Modern features, smooth rides, all terrain capable."

**Benefit 4: Competitive Pricing**
- Icon: Simple dollar sign or wallet outline
- Headline: "Fair Pricing"
- Description: "Quality without premium markup. Adventure is affordable."

### Design Details
- **Icon style:** Simple line icons (Feather-style or similar minimal design)
- **Icon size:** 48px × 48px
- **Icon color:** Gold/bronze
- **Layout:** 4 columns on desktop (>768px), 2 columns on tablet (480-768px), 1 column on mobile (<480px)
- **Text alignment:** Center
- **Spacing:** 20px gap between items
- **Font:** Headline = 18px bold, Description = 14px regular

---

## 4. Page Flow & Overall Layout

### Full Page Structure (Top to Bottom)
1. Language selector modal (existing)
2. Side language switcher (existing)
3. **Enhanced Hero Section** ← NEW HEADLINE/BUTTON
4. "Every Journey Tells a Story" section (existing)
5. Fleet showcase (existing CARS section)
6. **Testimonials Section** ← NEW
7. **Benefits Section** ← NEW
8. CTA section (existing)
9. Footer (existing)

### Design Cohesion
- **Accent color:** Gold/bronze (#D4AF37 or similar warm gold)
  - Used in: hero button, testimonial left borders, benefit icons
  - Creates visual thread through marketing sections
- **Typography:** Use existing fonts (no changes needed)
- **Spacing:** Consistent 40-60px padding between sections

---

## 5. Color Palette

### Primary Colors (Existing)
- Background: White/Light gray
- Text: Dark charcoal (#2D3436)
- Accent: Gold/Bronze (#D4AF37)

### Implementation
- Hero button: Gold/bronze background with white text
- Testimonial cards: White with gold/bronze left border
- Benefit icons: Gold/bronze
- Hover states: Slightly darker gold on interactive elements

---

## 6. Responsive Design

### Breakpoints
- **Desktop (>768px):** 3-column testimonials, 4-column benefits
- **Tablet (480-768px):** 1-column testimonials, 2-column benefits
- **Mobile (<480px):** 1-column testimonials, 1-column benefits

### Mobile Optimizations
- Touch targets (buttons/cards) minimum 44px height
- Text remains legible (16px+ for body text)
- Spacing adjusts proportionally

---

## 7. Implementation Details

### Code Structure
- Testimonials: React component with map() over TESTIMONIALS array
- Benefits: React component with map() over BENEFITS array
- Styling: CSS Modules (existing pattern in Home.module.css)
- Icons: Feather Icons (lightweight, simple, customizable)

### New Dependencies
- Optional: `feather-icons` package for icons (if not using SVG)

### Testing Checklist
- [ ] Responsive design at all breakpoints
- [x] Star ratings display correctly
- [x] Gold/bronze accent color consistent
- [ ] Text is readable (contrast, font size)
- [ ] Links/buttons work (hero CTA, existing inquiry buttons)
- [ ] Mobile touch targets are adequate

---

## 8. Success Criteria

✅ **Design Goals**
- Establishes adventurous/lifestyle positioning
- Combines social proof (testimonials) + specific benefits
- Maintains minimal scope (3 testimonials, 4 benefits)
- Cohesive visual design (gold/bronze accent)

✅ **User Goals**
- Visitors feel inspired to explore (hero copy)
- Trust is built through real testimonials
- Benefits clarify WHY they should rent (reliability, support, comfort, pricing)
- CTA remains clear and clickable

✅ **Technical Goals**
- No breaking changes to existing code
- Fast deployment (new sections only)
- Mobile-responsive at all breakpoints

---

## Approval Status

**User Approval:** ✅ Approved 2026-05-11

**Design Choices Confirmed:**
- Accent color: Gold/bronze
- Testimonial ratings: Visible
- Benefit icons: Simple line icons
- Hero button: Keep "Get in Touch"
- Locations: North Cyprus (Kyrenia, Famagusta, Nicosia)

---

## Next Steps

1. ✅ Design spec written (this document)
2. ⏳ Implementation plan (invoke writing-plans skill)
3. ⏳ Code implementation
4. ⏳ Deploy to Vercel

