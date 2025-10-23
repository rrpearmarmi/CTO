# ADVAI Waitlist Landing Page 🚀

An **extraordinary, award-worthy waitlist landing page** for ADVAI featuring advanced 3D neural network visualizations, immersive interactions, and cutting-edge web technologies.

## ✨ Features

### 🌐 Hero Section - Neural Network Background
- **Full-viewport Three.js scene** with animated 3D neural network nodes
- **Real-time pulsing nodes** with organic connection pathways
- **Mouse/touch interaction** with magnetic attraction effects
- **Camera parallax** on scroll with depth-of-field blur
- **Holographic color shifts** (purple → cyan → pink gradient overlays)
- **Particle data streams** flowing between nodes
- **Audio waveform visualization** reacting to ambient sound

### 📝 Kinetic & Liquid Typography
- Hero text using **variable fonts** with fluid weight/width animations
- **"Breathing" text effect** (subtle scale pulse 1.0 → 1.02)
- **Split-text animation** with staggered word/letter reveals
- **Magnetic text effect**: letters repel from cursor on hover
- **Gradient text** with animated gradient position (shimmer)
- **Scramble/decode animation** on load (Matrix-style reveal)

### 💎 Glassmorphic Floating Card
- Central card with **ultra-frosted glass** effect (backdrop-blur-xl)
- **Multi-layer depth** with shadow layers at different Z-depths
- **Animated gradient border** rotating 360°
- **3D tilt effect** following cursor (à la Apple)
- **Inner glow** on edges
- **Morphing blob shapes** behind glass for depth
- Subtle **CSS 3D transforms** for floating effect

### ⚡ Email Input - Reimagined
- Input field **morphs** from thin line to full field on focus
- **Floating label** with physics-based spring animation
- **Liquid mercury effect** on hover (metallic shimmer)
- **Morphing validation icons** (checkmark emerges from liquid)
- **Success state**: card explodes into particles, reforms showing confirmation

### 🎯 Submit Button - Interactive
- **Magnetic hover effect** (morphs toward cursor)
- **Liquid fill animation** on hover (fills like water)
- **WebGL shader ripple** effect on click
- **Loading state**: button becomes pulsing neural node
- **Success animation**: dissolves into particles forming checkmark

### 🎨 Background Shaders
- **Primary**: Custom GLSL shader with flowing liquid metallic effect
- **Secondary layer**: Perlin noise-based fog/mist responding to scroll
- **Tertiary**: Radial gradient mesh following cursor
- **Color palette**: Deep space blues, electric purples, neon cyans, pearl whites
- **Ray-marching** for volumetric lighting effects

### 📜 Scroll Experience
- **Smooth scrolling** powered by Lenis
- **GSAP ScrollTrigger** for advanced scroll animations
- **Scroll-linked animations**: elements appear from fog/blur
- **Velocity-based motion blur** on fast scrolling
- Custom scroll progress indicators

### 🎯 Micro-Interactions
- **Custom cursor** with animated ring and particle trail
- **Magnetic fields** on interactive elements
- **Feature cards** with hover-reveal animations
- **Bento grid layout** with unique shader backgrounds
- **Sound design**: subtle interaction feedback

### 📱 Mobile Experience
- **Touch ripple effects** with particle explosions
- **Gyroscope-based parallax** (tilt phone, elements shift)
- **Simplified shader effects** for performance
- **Haptic feedback** on interactions (where supported)
- **Responsive design** optimized for all screen sizes

## 🛠 Technical Stack

- **Next.js 14+** with App Router
- **React Three Fiber (R3F)** + Drei for 3D
- **Framer Motion** for orchestrated animations
- **Custom GLSL shaders** (fragment + vertex)
- **GSAP ScrollTrigger** for scroll animations
- **Lenis** for smooth scrolling
- **Tone.js** for audio interactions
- **React Spring** for physics-based animations
- **TypeScript** for type safety
- **CSS Modules** for styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## 📂 Project Structure

```
/app
  /api/waitlist         # Waitlist submission API route
  globals.css           # Global styles
  layout.tsx            # Root layout
  page.tsx              # Homepage

/components
  AdvancedWaitlistPage.tsx          # Main landing page component
  AdvancedWaitlistPage.module.css   # Page styles
  
  /graphics
    NeuralBackground.tsx            # 3D neural network scene
    MiniNeural.tsx                  # Footer mini neural viz
    ShaderBackground.tsx            # Background shaders
    
  /ui
    AudioVisualizer.tsx             # Audio waveform visualizer
    CustomCursor.tsx                # Custom cursor with trails
    DataTicker.tsx                  # Scrolling data ticker
    GlassCard.tsx                   # Glassmorphic card component
    KineticText.tsx                 # Animated typography
    SmoothScroll.tsx                # Lenis smooth scroll wrapper
```

## ⚡ Performance Optimizations

- **Lazy loading** of heavy 3D scenes
- **GPU instancing** for particles
- **Debounced mouse tracking**
- **Reduced motion media query** support
- **Fallback 2D version** for low-end devices
- **Maintains 60fps** on modern devices
- **Code splitting** with dynamic imports

## ♿ Accessibility Features

- Proper **ARIA labels** throughout
- **Keyboard navigation** for all interactions
- **Reduced motion alternatives**
- **High contrast mode** support
- **Screen reader optimized**
- **Focus indicators** with animated outlines
- **Semantic HTML** structure

## 🎨 Unique Elements

1. **AI Consciousness Indicator** - Pulsing brain-like visualization
2. **Real-time Data Stream Ticker** - Mock data flowing animation
3. **Testimonial Cards** - Morph in from liquid effect
4. **FAQ Accordion** - 3D fold animations
5. **Footer Neural Network** - Mini neural visualization
6. **Email Confirmation Modal** - Celebration animation
7. **Trust Badges** - Holographic effects
8. **Scroll Progress** - Neural pathway indicator

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Add any API keys or configuration here
NEXT_PUBLIC_API_URL=your_api_url
```

### Customization

- **Colors**: Edit CSS variables in `app/globals.css`
- **3D Settings**: Modify node count and connections in `NeuralBackground.tsx`
- **Content**: Update text and copy in `AdvancedWaitlistPage.tsx`
- **Animations**: Adjust timing in component-specific modules

## 📊 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers with WebGL support

## 🐛 Troubleshooting

### 3D Scene Not Rendering
- Ensure WebGL is enabled in browser
- Check GPU acceleration is enabled
- Try disabling browser extensions

### Performance Issues
- Enable "Reduced Motion" in system preferences
- Close other GPU-intensive applications
- Use a more powerful device

### Smooth Scroll Not Working
- Check if Lenis is properly initialized
- Ensure no CSS `overflow` conflicts
- Verify JavaScript is enabled

## 📝 License

© 2024 ADVAI. All rights reserved.

## 🤝 Contributing

This is a proprietary project. For feature requests or bug reports, please contact the development team.

## 🎯 Future Enhancements

- [ ] Horizontal scroll section for app mockups
- [ ] A/B testing variants
- [ ] Analytics integration
- [ ] Email service provider integration
- [ ] Enhanced mobile gestures
- [ ] Additional shader effects
- [ ] Voice interaction support

---

**Built with ❤️ using cutting-edge web technologies**
