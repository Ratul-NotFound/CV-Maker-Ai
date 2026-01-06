# CV Maker AI - Template-Based System

Professional CV generator using premium templates. No external APIs required.

## Features

- ✅ **Instant Generation** - CVs generated in <1 second
- ✅ **100% Free** - No API costs
- ✅ **8 Premium Templates** - World-class, professional designs
- ✅ **5 CV Types** - Modern, Executive, Creative, Europass, Scopus
- ✅ **10 Industries** - Custom color palettes for each
- ✅ **PDF Export** - Download ready-to-use PDFs
- ✅ **Fully Offline** - No internet required after initial load

## Premium Templates

### Modern CVs (5 Templates - Rotates Randomly)
1. **Template 5** - Minimalist Professional (ATS-optimized)
2. **Template 6** - Professional Elegant
3. **Template 7** - Modern Vibrant
4. **Template 8** - Two-Column Sidebar (Icons, skill bars)
5. **Template 12** - Ultra Minimalist (Apple-style)

### Executive CV
- **Template 9** - Elegant Executive (Harvard-style, sophisticated)

### Creative CV
- **Template 10** - Creative Bold (Vibrant, artistic, portfolio-ready)

### Academic CV (Europass/Scopus)
- **Template 11** - Academic Professional (Formal, publication-ready)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Environment Setup

Create `.env` file (see `.env.example`):

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase configs

# Firebase Admin
FIREBASE_CLIENT_EMAIL=your_service_account@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-cv/
│   │       ├── route.js              # Main API endpoint
│   │       └── premium-templates.js  # 3 premium templates
│   ├── create-cv/                    # CV creation page
│   ├── dashboard/                    # User dashboard
│   └── ...
├── components/                        # React components
├── lib/                              # Utility functions
└── styles/                           # Global styles
```

## CV Types

- **Modern** - Clean, professional, ATS-optimized
- **Executive** - Elegant design for leadership roles
- **Creative** - Bold, vibrant for creative professionals
- **Europass** - Official EU format
- **Scopus** - Academic/research format

## Industries

Technology • Finance • Healthcare • Education • Marketing  
Engineering • Law • Creative • Research • Consulting

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Database**: Firebase/Firestore
- **Auth**: Firebase Authentication
- **PDF**: Puppeteer + Chromium

## License

Private project - All rights reserved

---

**Last Updated**: January 2, 2026  
**Version**: 1.0.0 (Template-only)
