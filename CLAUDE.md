# Claude Code Instructions for Mejor Precio NSS

## Development Commands

### Build and Quality Checks
```bash
npm run build
npm run lint
npm run typecheck
```

**Note**: User will handle build testing - do not run `npm run build` automatically during development.

## Project Structure

### Hero Banner
- Component: `/src/components/ui/hero-banner.tsx`
- Images: `/public/banner/` (background.jpg, decoration.png, right-photo.png)
- Layered design with responsive layout (540px desktop, 320px mobile)

### Key Features
- Smooth scroll CTA button to categories section
- Three-layer image system: background → right photo → split decorations
- Spanish content (no i18n needed)