# NatureBlend Submission Guide

This document provides instructions for preparing the final submission materials for the NatureBlend app.

## Screenshot Capture Guide

### Required Screenshots


#### Customer App

1. **User Onboarding**
   - User type selection screen
   - Login screen
   - Signup screen

2. **Product Browsing**
   - Home screen with recommendations
   - Explore/category view
   - Search results

3. **Product Details**
   - Product detail view showing sustainability metrics
   - Product benefits
   - Reviews section

4. **Shopping Experience**
   - Cart view
   - Checkout process
   - Payment screen

5. **Order Management**
   - Order confirmation
   - Order tracking
   - Order history

6. **User Profile**
   - Profile view
   - Settings
   - Wallet/payment methods

#### Vendor App

1. **Dashboard**
   - Main dashboard with metrics
   - Analytics charts
   - Recent activity

2. **Product Management**
   - Product listing
   - Add/edit product form
   - Product categories

3. **Order Processing**
   - Orders list
   - Order detail view
   - Order status management

4. **Store Management**
   - Store profile
   - Settings
   - Earnings/wallet

### Capturing Instructions

#### iOS Simulator
1. Run the app in iOS simulator
2. Press `Cmd + S` to take a screenshot
3. Screenshots are saved to your desktop
4. Rename and move to the appropriate directory in `/docs/screenshots/`

#### Android Emulator
1. Run the app in Android emulator
2. Press `Cmd + S` (macOS) or the screenshot button in the emulator controls
3. Screenshots are saved to your computer
4. Rename and move to the appropriate directory in `/docs/screenshots/`

#### Physical Device
1. Run the app on your device
2. Use device's screenshot method (e.g., Power + Volume Down for Android)
3. Transfer screenshots to computer
4. Place in appropriate directory

## Video Demo Guide

### Recording Setup

#### Using iOS Simulator
1. Run the app in iOS simulator
2. Use QuickTime Player (File > New Screen Recording)
3. Select the simulator window for recording
4. Follow the demo script below

#### Using Android Emulator
1. Run the app in Android emulator
2. Use screen recording software (e.g., QuickTime, OBS)
3. Record the emulator window
4. Follow the demo script below

### Demo Script

#### Introduction (15 seconds)
- Show the app icon and splash screen
- Briefly mention that NatureBlend is a dual-sided marketplace for wellness products

#### Customer Flow (90 seconds)
1. Start at the user type selection screen
2. Choose "Customer" option
3. Show the login process (use test credentials)
4. Browse the product catalog
   - Show category filtering
   - Demonstrate search functionality
5. Select a product and show detailed view
   - Highlight sustainability metrics
   - Show add to cart functionality
6. Navigate to cart
   - Adjust quantities
   - Proceed to checkout
7. Complete the checkout process
   - Enter delivery information
   - Select payment method
   - Place order
8. Show order confirmation and tracking

#### Vendor Flow (90 seconds)
1. Return to user type selection (or restart app)
2. Choose "Vendor" option
3. Log in with vendor credentials
4. Show the dashboard with metrics
5. Navigate to product management
   - Show existing products
   - Demonstrate adding a new product
6. Go to order management
   - Show incoming orders
   - Demonstrate order processing workflow
7. Show analytics section with sales data
8. Briefly show vendor profile/settings

#### Conclusion (15 seconds)
- Highlight key features again
- Mention technologies used (React Native, Expo)
- Show app icon again

### Video Processing

1. Trim the beginning and end as needed
2. Add text overlays for important features (optional)
3. Export in MP4 format with reasonable quality (720p minimum)
4. Keep file size under 100MB if possible
5. Upload to a hosting service (YouTube, Google Drive, etc.)
6. Add the link to the README.md file

## Final Submission Checklist

- [ ] App runs without errors on iOS and Android
- [ ] All key features are functional
- [ ] Screenshots captured for all required screens
- [ ] Demo video recorded and uploaded
- [ ] Documentation complete (README.md, architecture.md)
- [ ] Code is clean, commented, and follows consistent style
- [ ] Source code repository is publicly accessible