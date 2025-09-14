# Premium Resume Website

A production-ready Next.js 14 application that automatically transforms your PDF resume into a beautiful, modern personal website. Built with TypeScript, Tailwind CSS, and deployed on Vercel with zero configuration required.

## ✨ Features

### 🚀 Zero Setup Experience
- **Automatic Detection**: Simply place `resume.pdf` in `/public/docs/` and the site "just works"
- **Smart Parsing**: Extracts contact info, experience, skills, education, and projects from your PDF
- **Graceful Fallbacks**: Beautiful default content when parsing is uncertain
- **Content Overrides**: Fine-tune any section via `/content/overrides.json`

### 🎨 Premium Design
- **Modern UI**: Glassmorphism effects, subtle animations, and premium typography
- **Responsive**: Perfect on all devices with mobile-first design
- **Dark/Light Mode**: System-aware theme switching with smooth transitions
- **Micro-interactions**: Framer Motion animations that respect `prefers-reduced-motion`

### 📱 Professional Sections
- **Hero**: Name, role, location, and call-to-action buttons
- **Highlights**: 3-6 key value propositions auto-extracted from resume
- **Skills**: Organized by category with visual chips (Technical, Soft Skills, Certifications, Languages)
- **Experience**: Timeline view with role details and achievements
- **Projects**: Portfolio cards with technologies and links
- **Education & Certifications**: Academic background and professional credentials

### 🔍 Advanced PDF Viewer
- **Pixel-Perfect Rendering**: PDF.js integration with virtualized pages
- **Full-Text Search**: FlexSearch-powered with highlighted results
- **Navigation**: Table of contents, page jumping, zoom controls
- **Accessibility**: Keyboard navigation, screen reader support, WCAG compliant

### ⚡ Performance & SEO
- **Lighthouse Score**: 90+ across Performance, Accessibility, SEO, Best Practices
- **Next.js 14**: App Router, Server Components, and optimized fonts
- **SEO Ready**: Dynamic metadata, Open Graph, structured data
- **Fast Loading**: Optimized images, lazy loading, and code splitting

## 🚀 Quick Start

### 1. Add Your Resume
```bash
# Place your resume in the docs folder
cp your-resume.pdf public/docs/resume.pdf
```

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Deploy to Vercel
```bash
npm run build
# Deploy via Vercel CLI or connect your GitHub repo
```

That's it! Your resume website is live at `localhost:3000` and ready for production.

## 📁 Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page (auto-detects resume.pdf)
│   ├── resume/            # PDF viewer page
│   └── globals.css        # Global styles and CSS variables
├── components/
│   ├── sections/          # Resume sections (Hero, Skills, etc.)
│   ├── pdf-viewer/        # PDF.js integration components
│   ├── ui/               # shadcn/ui components
│   └── providers/        # React context providers
├── lib/
│   ├── resume-parser.ts  # PDF text extraction and parsing
│   ├── pdf-utils.ts      # PDF.js utilities
│   └── utils.ts          # Helper functions
├── content/
│   └── overrides.json    # Content customization file
└── public/
    └── docs/
        └── resume.pdf    # Your resume goes here
```

## 🎛️ Customization

### Content Overrides

Edit `/content/overrides.json` to customize any parsed content:

```json
{
  "contact": {
    "name": "Your Name",
    "email": "you@example.com",
    "location": "City, State"
  },
  "summary": "Your professional summary...",
  "highlights": [
    "Key achievement #1",
    "Key achievement #2"
  ],
  "skills": [
    {
      "name": "TypeScript",
      "category": "technical",
      "level": "advanced"
    }
  ],
  "theme": {
    "primaryColor": "hsl(221, 83%, 53%)",
    "accentColor": "hsl(210, 40%, 96%)"
  }
}
```

### Color Themes

Customize colors in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Accent color for highlights
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        }
      }
    }
  }
}
```

Update CSS variables in `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;        /* Blue */
  --secondary: 210 40% 96%;             /* Light gray */
  --accent: 210 40% 96%;                /* Accent color */
}

.dark {
  --primary: 217.2 91.2% 59.8%;        /* Lighter blue for dark mode */
  --secondary: 217.2 32.6% 17.5%;      /* Dark gray */
}
```

### Popular Color Schemes

**Professional Blue** (Default)
```css
--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96%;
```

**Modern Purple**
```css
--primary: 262.1 83.3% 57.8%;
--secondary: 270 95.2% 97.4%;
```

**Elegant Green**
```css
--primary: 142.1 76.2% 36.3%;
--secondary: 138 76.5% 96.7%;
```

**Warm Orange**
```css
--primary: 24.6 95% 53.1%;
--secondary: 60 54.5% 98.6%;
```

## 🔧 Advanced Configuration

### Environment Variables

```bash
# .env.local
SITE_URL=https://your-domain.com
VERCEL_URL=your-vercel-deployment.vercel.app
```

### Custom Parsing

Extend the resume parser in `lib/resume-parser.ts`:

```typescript
// Add custom skill detection
const customSkills = ['Your Framework', 'Your Tool']
const detectedSkills = [...technicalSkills, ...customSkills]

// Custom section parsing
private parseCustomSection(text: string): CustomSection[] {
  // Your parsing logic here
}
```

### PDF Processing Options

Configure PDF.js in `lib/pdf-utils.ts`:

```typescript
const loadingTask = pdfjsLib.getDocument({
  url,
  cMapUrl: '/cmaps/',
  cMapPacked: true,
  // Add custom options
  verbosity: 0,
  fontExtraProperties: true
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set in Vercel dashboard:
   - `SITE_URL`: Your custom domain
   - Any custom environment variables

3. **Custom Domain**
   Add your domain in Vercel dashboard → Settings → Domains

### Other Platforms

**Netlify**
```bash
npm run build
# Upload 'out' folder or connect GitHub repo
```

**GitHub Pages**
```bash
npm run build
npm run export
# Deploy 'out' folder to gh-pages branch
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Development

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript checking
```

### Adding Components

```bash
# Add shadcn/ui components
npx shadcn-ui@latest add [component-name]

# Example: Add dialog component
npx shadcn-ui@latest add dialog
```

### PDF.js Setup

PDF.js worker is configured automatically. For custom setups:

```typescript
// In your component
import * as pdfjsLib from 'pdfjs-dist'

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
}
```

## 🎯 Best Practices

### Resume PDF Tips

1. **Use Standard Fonts**: Arial, Helvetica, Times New Roman parse better
2. **Clear Structure**: Use consistent headings and bullet points
3. **Contact Info**: Place email, phone, location at the top
4. **Keywords**: Include relevant technical terms and skills
5. **File Size**: Keep under 2MB for optimal loading

### Content Strategy

1. **Highlights**: Focus on quantifiable achievements
2. **Skills**: Group by category (Technical, Soft, Certifications)
3. **Experience**: Use action verbs and specific metrics
4. **Projects**: Include live links and GitHub repositories
5. **Keywords**: Use industry-relevant terms for SEO

### Performance Optimization

1. **Images**: Use WebP format, optimize sizes
2. **Fonts**: Preload critical fonts, use font-display: swap
3. **JavaScript**: Code splitting, lazy loading
4. **PDF**: Optimize file size, enable compression

## 🐛 Troubleshooting

### Common Issues

**PDF Not Loading**
```bash
# Check file path and permissions
ls -la public/docs/
# Ensure resume.pdf exists and is readable
```

**Parsing Issues**
```bash
# Check browser console for errors
# Verify PDF is not corrupted
# Try with a different PDF
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Styling Issues**
```bash
# Regenerate Tailwind classes
npm run build
# Check for CSS conflicts in browser dev tools
```

### Debug Mode

Enable debug logging:

```typescript
// In lib/resume-parser.ts
console.log('Parsed sections:', sections)
console.log('Extracted skills:', skills)
```

## 📄 License

MIT License - feel free to use this for your personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and PDF.js**

Transform your resume into a stunning web presence in minutes, not hours.