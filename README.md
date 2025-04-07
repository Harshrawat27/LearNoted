# LearNoted

LearNoted is a comprehensive web learning assistant designed to enhance your browsing experience by providing instant vocabulary lookups, text highlighting, and YouTube timestamp saving—all in one centralized dashboard.

![LearNoted Logo](public/learnoted-logo-white.svg)

## Features

### 🔍 Instant Word Lookup
- Look up word definitions with a simple keyboard shortcut (Cmd+M / Ctrl+M)
- Get instant meanings, synonyms, and usage examples without leaving your page
- All lookups are automatically saved to your personal dashboard

### 🖌️ Smart Highlighting
- Highlight and save important text across any website
- Organize highlights by color and category
- Access your highlights from any device with browser sync

### 📹 YouTube Timestamp Saving
- Save key moments in YouTube videos with a single click
- Add notes to mark important points and insights
- Create a personalized learning timeline for future reference

### 🌗 Dark/Light Mode
- Support for both light and dark themes
- Automatic detection of system preferences
- Toggle between modes with a single click

## Tech Stack

LearNoted is built with modern web technologies:

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js with GitHub and Google providers
- **Payment Processing**: PayPal API
- **Content Management**: Sanity.io (for the blog)
- **Deployment**: Vercel
- **UI Components**: Recharts, Lucide React

## Project Structure

```
app/
├── api/               # API routes for backend functionality
├── auth/              # Authentication-related pages
├── blog/              # Blog pages and components
├── components/        # Reusable UI components
├── dashboard/         # User dashboard pages
├── lib/               # Utility functions and libraries
├── models/            # Mongoose models for MongoDB
├── types/             # TypeScript type definitions
public/                # Static assets
```

## Key Components

### Authentication System
- Uses NextAuth.js for secure authentication
- Supports GitHub and Google OAuth providers
- JWT tokens for secure API requests and Chrome extension integration

### Dashboard
- Sections for user profile, saved words, highlights, and YouTube timestamps
- Infinite scroll pagination for better performance
- Search functionality for finding saved content

### Subscription Management
- Free tier with limited functionality
- Pro plan ($5 for 90 days) with unlimited features
- Non-recurring payment model to prevent unwanted charges

### Blog Platform
- Sanity.io integration for content management
- Categories, authors, and post organization
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB database
- PayPal Developer account (for payment processing)
- Sanity.io account (for blog content)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/learnoted.git
cd learnoted
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Chrome Extension

LearNoted includes a Chrome extension that enables:
- Word lookup functionality
- Highlighting capabilities
- YouTube timestamp saving

The extension code is available in a separate repository. Install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/learnoted/pblcjennfkjfaieknemicnjkbplodfnf).

## Deployment

The application is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel dashboard
3. Deploy the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created by Harsh Rawat - [GitHub](https://github.com/harshrawat66)
