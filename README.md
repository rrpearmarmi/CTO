# ADVAI Waitlist Landing Page

A modern, visually stunning waitlist landing page for the ADVAI mobile app featuring advanced visual effects including WebGL shaders, glassmorphism, and smooth animations.

## Features

- **Modern Design**: Clean, professional aesthetic with a cutting-edge feel
- **Advanced Visual Effects**:
  - WebGL shader background with liquid glass effects
  - Glassmorphic cards with frosted glass backdrop-filter
  - Animated gradient orbs
  - Parallax scrolling effects
  - Smooth micro-interactions
- **Responsive**: Mobile-first design that works on all devices
- **Accessible**: High-contrast color palette and ARIA labels
- **Performant**: Optimized for 60fps animations
- **Animations**: Framer Motion for scroll-triggered reveals and hover states

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Framer Motion**: Smooth animations and transitions
- **Three.js**: WebGL shader implementation
- **CSS Modules**: Scoped styling
- **React 18**: Latest React features

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/waitlist/      # API endpoint for email collection
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── graphics/
│   │   ├── GradientOrbs   # Animated gradient blobs
│   │   ├── ParallaxTrail # Parallax effect trails
│   │   └── ShaderBackground # WebGL liquid glass shader
│   └── WaitlistPage       # Main landing page component
└── package.json
```

## Key Components

### ShaderBackground
WebGL-powered background with GLSL shaders creating liquid glass and gradient noise effects using simplex noise algorithms.

### GradientOrbs
Animated floating gradient orbs that create depth and visual interest with CSS animations.

### ParallaxTrail
Subtle parallax trails that respond to scroll position using Framer Motion.

### WaitlistPage
Main component featuring:
- Hero section with headline and subheader
- Email signup form with validation
- Feature cards with glassmorphic design
- Timeline section
- Footer with CTA

## Customization

Update colors in `app/globals.css`:
```css
:root {
  --accent-primary: #6d5dfc;
  --accent-secondary: #31d7ff;
  --accent-tertiary: #ff7ac7;
}
```

Modify shader colors in `components/graphics/ShaderBackground.tsx` by adjusting the `gradientA`, `gradientB`, and `gradientC` vectors.

## Performance

- Shader rendering is optimized for 60fps
- Reduced motion preferences are respected
- Images and assets are optimized
- CSS animations use GPU-accelerated properties

## License

MIT
