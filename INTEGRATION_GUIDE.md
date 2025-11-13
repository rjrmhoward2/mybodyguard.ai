# MyBodyGuard.ai Landing Page - Integration Guide

## Table of Contents
1. [Shopify Integration](#shopify-integration)
2. [Beehiiv Email Integration](#beehiiv-email-integration)
3. [Google Analytics Setup](#google-analytics-setup)
4. [Image Requirements](#image-requirements)
5. [Deployment Checklist](#deployment-checklist)

---

## 1. Shopify Integration

### Current Setup
Your Shopify store URL: `https://mybodyguard-ai.myshopify.com/`

### How It's Integrated
All merchandise links point directly to your Shopify store:
- Navigation "Shop" link
- "Shop the Movement" button in Movement section
- "Shop Merch" link in footer

### Making It Seamless

**Option A: Direct Links (Current - Easiest)**
- No changes needed
- Users click and go to Shopify
- Shopify handles all commerce

**Option B: Custom Domain (Recommended)**
1. Set up custom domain in Shopify: `shop.mybodyguard.ai`
2. Update all links in HTML to use custom domain
3. Benefits: Looks more professional, maintains branding

**Option C: Buy Buttons (Advanced)**
Embed Shopify buy buttons directly on landing page:

1. In Shopify Admin:
   - Go to Sales Channels → Online Store → Themes
   - Customize → Add Section → Product
   - Generate buy button code

2. In your HTML:
```html
<!-- Replace merchandise placeholder with: -->
<div id="product-component-1234567890"></div>
<script src="https://mybodyguard-ai.myshopify.com/buy-button.js"></script>
```

### Testing
- [ ] Verify all Shopify links work
- [ ] Test checkout flow
- [ ] Confirm pricing displays correctly
- [ ] Test on mobile devices

---

## 2. Beehiiv Email Integration

### Two Integration Methods

### Method 1: Beehiiv Embed Form (Easiest)

1. **Get Embed Code from Beehiiv:**
   - Log into Beehiiv
   - Go to Audience → Grow
   - Create embed form
   - Copy embed code

2. **Replace Current Form:**
   In `mybodyguard-landing.html`, replace the entire `<form class="waitlist-form">` section (lines ~650-680) with your Beehiiv embed code.

3. **Style the Embedded Form:**
   Add this CSS to match your design:
```css
/* Beehiiv form overrides */
.beehiiv-form {
    background: white !important;
    padding: 2rem !important;
    border-radius: 1.5rem !important;
}

.beehiiv-form input {
    border: 2px solid #E5E7EB !important;
    border-radius: 0.5rem !important;
}
```

### Method 2: API Integration (Advanced)

1. **Get API Key:**
   - Beehiiv Settings → API
   - Generate API key
   - Store securely (never in frontend code!)

2. **Create Backend Endpoint:**
   You'll need a simple backend (Node.js example):

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/subscribe', async (req, res) => {
    const { email, name } = req.body;
    
    try {
        const response = await fetch('https://api.beehiiv.com/v2/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                name: name,
                publication_id: 'YOUR_PUBLICATION_ID'
            })
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

3. **Update JavaScript:**
   In `mybodyguard-script.js`, update the `submitToBeehiiv` function:

```javascript
async function submitToBeehiiv(formData) {
    const response = await fetch('YOUR_BACKEND_URL/api/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    
    return response.json();
}
```

### Method 3: Zapier Integration (No Code)

1. Create Zapier account
2. Make Zap: Webhooks by Zapier → Beehiiv
3. Update JavaScript to send to Zapier webhook:

```javascript
async function submitToBeehiiv(formData) {
    const response = await fetch('YOUR_ZAPIER_WEBHOOK_URL', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
    
    return response.json();
}
```

### Testing
- [ ] Submit test email
- [ ] Verify email appears in Beehiiv
- [ ] Check confirmation email arrives
- [ ] Test unsubscribe flow

---

## 3. Google Analytics Setup

### Step 1: Get Tracking ID

1. Create Google Analytics 4 property
2. Get Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Update HTML

In `mybodyguard-landing.html`, line ~11, replace `GA_MEASUREMENT_ID` with your actual ID:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YOUR-ACTUAL-ID');
</script>
```

### Step 3: Verify Events

The JavaScript already tracks these events:
- `hero_cta_click` - Hero section CTA clicked
- `solution_cta_click` - Solution section CTA clicked
- `vagalsync_click` - VagalSync link clicked
- `professionalfi_click` - ProfessionalFi link clicked
- `merch_shop_click` - Shop button clicked
- `waitlist_submit` - Waitlist form submitted
- `outbound_click` - Any external link clicked
- `page_load` - Page performance

### Step 4: Set Up Goals

In Google Analytics:
1. Go to Events
2. Create conversions from:
   - `waitlist_submit`
   - `merch_shop_click`

### Testing
1. Install Google Analytics Debugger extension
2. Navigate your site
3. Verify events appear in GA4 DebugView
4. Check real-time reports

---

## 4. Image Requirements

### Hero Section
**Filename:** `hero-guardian.png` or `hero-guardian.jpg`
- **Size:** 800x800px minimum
- **Format:** PNG with transparency preferred
- **Content:** Guardian concept art, 3D render, or animated guardian
- **Location:** Replace `.guardian-placeholder` div (line ~98)

### Merchandise Photo
**Filename:** `merch-hero.jpg`
- **Size:** 1200x1400px
- **Format:** JPG (high quality)
- **Content:** Person wearing "THIS BODY is protected by ai" shirt
- **Angles:** Front view, well-lit, lifestyle shot
- **Location:** Replace `.merch-mock` div (line ~450)

### Additional Merchandise
**Filenames:** `merch-variant-1.jpg` through `merch-variant-4.jpg`
- **Size:** 600x700px
- **Content:** Different colorways and styles
- **Location:** Add to slogans section or create gallery

### Guardian Mockup (Optional)
**Filename:** `guardian-interface.png`
- **Size:** 1000x800px
- **Format:** PNG
- **Content:** Screenshot of guardian software interface
- **Location:** Replace `.mockup-screen` content (line ~238)

### Favicon
**Filename:** `favicon.ico`
- **Sizes:** 16x16, 32x32, 48x48
- **Content:** Shield icon or "MB" logo
- **Add to HTML:** `<link rel="icon" href="favicon.ico">`

### How to Add Images

Replace placeholder divs with actual images:

```html
<!-- BEFORE (current placeholder) -->
<div class="guardian-placeholder">
    <div class="guardian-shield">🛡️</div>
    <div class="guardian-pulse"></div>
</div>

<!-- AFTER (with real image) -->
<img src="images/hero-guardian.png" alt="MyBodyGuard AI Guardian" class="hero-image">
```

---

## 5. Deployment Checklist

### Pre-Launch Checks

#### Content
- [ ] Replace `GA_MEASUREMENT_ID` with actual Google Analytics ID
- [ ] Update Beehiiv form or API integration
- [ ] Add real images (hero, merchandise, mockups)
- [ ] Update social media links in footer
- [ ] Add actual press kit link
- [ ] Update contact email if different
- [ ] Review all copy for typos

#### Links
- [ ] Test all navigation links
- [ ] Verify Shopify links work
- [ ] Check VagalSync URL is correct: `https://myvagalsync.com/`
- [ ] Check ProfessionalFi URL is correct
- [ ] Test all CTA buttons
- [ ] Verify anchor links scroll correctly

#### Technical
- [ ] Optimize images (compress without quality loss)
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test form submission
- [ ] Verify Google Analytics tracking
- [ ] Check page load speed (aim for <2 seconds)
- [ ] Test with slow 3G connection

#### SEO
- [ ] Verify meta description is correct
- [ ] Check title tag
- [ ] Add favicon
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Set up Google Search Console
- [ ] Submit sitemap to Google

### Hosting Options

#### Option 1: Static Hosting (Easiest)
**Recommended:** Netlify, Vercel, or Cloudflare Pages

**Netlify Deploy:**
1. Create account at netlify.com
2. Drag and drop your files
3. Set custom domain: `mybodyguard.ai`
4. Enable HTTPS (automatic)

**Cost:** Free for static sites

#### Option 2: Traditional Hosting
**Recommended:** SiteGround, Bluehost, DreamHost

1. Upload files via FTP
2. Point domain to hosting
3. Enable SSL certificate

**Cost:** $3-10/month

#### Option 3: Cloud Hosting
**Recommended:** AWS S3 + CloudFront

1. Upload to S3 bucket
2. Enable static website hosting
3. Set up CloudFront for CDN
4. Point domain to CloudFront

**Cost:** ~$1-5/month for low traffic

### Post-Launch

#### Week 1
- [ ] Monitor Google Analytics daily
- [ ] Check form submissions
- [ ] Review bounce rate (aim for <50%)
- [ ] Monitor page load speed
- [ ] Fix any reported bugs

#### Week 2-4
- [ ] A/B test CTA button colors
- [ ] Experiment with hero copy
- [ ] Add social proof when available
- [ ] Create blog content
- [ ] Start email drip campaign

---

## 6. Customization Guide

### Changing Colors

All colors are defined in CSS variables (line 7-30 in CSS file):

```css
:root {
    --primary-blue: #0066FF;     /* Main brand color */
    --accent-cyan: #00C2FF;      /* Accent highlights */
    --accent-purple: #7B61FF;    /* Secondary accent */
}
```

To change the entire color scheme:
1. Update these three variables
2. Colors automatically update site-wide

### Adding Sections

To add a new section:

```html
<section class="section your-section-name">
    <div class="container">
        <div class="section-header center">
            <span class="section-tag">Your Tag</span>
            <h2>Your Heading</h2>
            <p class="section-description">Your description</p>
        </div>
        <!-- Your content here -->
    </div>
</section>
```

### Modifying Layout

The layout uses CSS Grid for most sections. To change column counts:

```css
/* Current: 3 columns */
.problem-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Change to 2 columns */
.problem-grid {
    grid-template-columns: repeat(2, 1fr);
}
```

---

## 7. Troubleshooting

### Form Not Submitting
1. Check browser console for errors
2. Verify email validation is passing
3. Test with a simple email (test@test.com)
4. Check network tab for failed requests

### Images Not Loading
1. Verify file paths are correct
2. Check image file names match HTML
3. Ensure images are in correct directory
4. Try absolute URLs for testing

### Analytics Not Tracking
1. Verify GA tracking ID is correct
2. Check if ad blocker is interfering
3. Test in incognito mode
4. Use GA Debugger extension

### Mobile Menu Not Working
1. Check JavaScript console for errors
2. Verify JavaScript file is loaded
3. Test in different mobile browsers
4. Check for JavaScript conflicts

---

## 8. Need Help?

### Quick Fixes
- **Broken Link:** Search HTML for the URL and update
- **Wrong Color:** Update CSS variables (see Customization)
- **Form Issues:** Check browser console for error messages
- **Layout Problems:** Test in Chrome DevTools responsive mode

### Resources
- **HTML/CSS Help:** MDN Web Docs (developer.mozilla.org)
- **Shopify Docs:** help.shopify.com
- **Beehiiv Docs:** support.beehiiv.com
- **Google Analytics:** support.google.com/analytics

---

## Next Steps

1. **Immediate (Today):**
   - Add real images
   - Update Google Analytics ID
   - Set up Beehiiv integration
   - Test all links

2. **This Week:**
   - Deploy to hosting
   - Connect domain
   - Set up SSL
   - Test on multiple devices

3. **Before Kickstarter:**
   - Add countdown timer
   - Create press kit page
   - Set up email drip campaign
   - Build social proof section

Good luck with your launch! 🛡️🚀