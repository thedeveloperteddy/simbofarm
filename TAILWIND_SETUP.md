# Tailwind CSS Configuration Guide

This project uses **Tailwind CSS v4** with the new Vite plugin for optimal performance and development experience.

## 🎨 Configuration Overview

### Files Created/Modified:
- `client/tailwind.config.js` - Tailwind configuration with custom theme
- `client/postcss.config.js` - PostCSS configuration with Tailwind v4 plugin
- `client/src/index.css` - Global styles with CSS variables and theme
- `client/vite.config.ts` - Vite configuration with Tailwind plugin

### Key Features:
- ✅ **Tailwind CSS v4** with new `@import "tailwindcss"` syntax
- ✅ **CSS Variables** for dynamic theming
- ✅ **Dark Mode** support with custom variant
- ✅ **Shadcn/ui** compatibility
- ✅ **Production Optimized** builds
- ✅ **Hot Module Replacement** in development

## 🚀 Development Usage

### Start Development Servers:
```bash
# Windows (Recommended)
scripts\dev.bat

# Or manually:
# Terminal 1: Laravel
php artisan serve --host=0.0.0.0

# Terminal 2: React
cd client && npm run dev
```

### Development Features:
- ⚡ **Instant HMR** - Styles update without page refresh
- 🎨 **CSS Variables** - Dynamic color theming
- 🌙 **Dark Mode** - Automatic dark mode detection
- 📱 **Responsive** - Mobile-first design utilities

## 🔨 Production Build

### Build for Production:
```bash
# Windows (Recommended)
scripts\build.bat

# Or via Composer:
composer run build:production

# Or manually:
cd client && npm run build
cp -r client/dist/* public/build/
npm run build
```

### Production Features:
- 🗜️ **Minified CSS** - Optimized for production
- 🎯 **Purge CSS** - Only used styles included
- 📦 **Asset Bundling** - Efficient asset delivery
- 🔒 **CORS Ready** - Headers for cross-origin requests

## 🎨 Customization

### Theme Colors:
Colors are defined using CSS variables in `client/src/index.css`:

```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  --accent: oklch(0.97 0 0);
  /* ... more colors */
}
```

### Custom Components:
The config includes shadcn/ui compatible design system:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      // ... more colors
    }
  }
}
```

## 🌙 Dark Mode

Dark mode is automatically handled using the `@custom-variant dark` syntax:

```css
@custom-variant dark (&:is(.dark *));
```

Usage:
```jsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">
    Adaptive text
  </h1>
</div>
```

## 📱 Responsive Design

Tailwind's responsive utilities work out of the box:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Responsive grid -->
</div>
```

## 🔧 Troubleshooting

### Common Issues:

1. **Styles not updating in development**
   - Ensure `npm run dev` is running
   - Check browser console for errors
   - Verify Vite HMR is working

2. **Build errors**
   - Run `npm install` to ensure dependencies
   - Check PostCSS configuration
   - Verify Tailwind v4 plugin is installed

3. **Production styles not loading**
   - Ensure assets are built: `composer run build`
   - Check `public/build/` directory exists
   - Verify manifest.json is generated

### Debug Commands:
```bash
# Check Tailwind version
npm list tailwindcss

# Verify build output
ls -la public/build/

# Test CSS compilation
cd client && npx tailwindcss -i ./src/index.css -o ./dist/output.css
```

## 🚀 Deployment

### Production Deployment:
```bash
# Build assets
composer run build:production

# Deploy optimizations
composer run deploy

# Verify deployment
php artisan config:cache
php artisan route:cache
```

### Environment Variables:
```env
APP_ENV=production
APP_DEBUG=false
```

## 📚 Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Vite Tailwind Plugin](https://github.com/tailwindcss/tailwindcss-vite)
- [Shadcn/ui Components](https://ui.shadcn.com/)

## 🎯 Best Practices

1. **Use CSS Variables** for dynamic theming
2. **Organize Components** with utility-first approach
3. **Optimize Builds** with proper purging
4. **Test Dark Mode** across all components
5. **Monitor Bundle Size** in production builds
