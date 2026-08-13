# Orange Glassmorphism Design System

## Foundations

- **Base background**: near-black / charcoal layers
- **Accent**: mission-orange (`#ff7a2f`) and softer orange highlight (`#ffb076`)
- **Surface model**: translucent dark panels with controlled blur and subtle white/orange borders
- **Mood**: mission-control instrumentation, not consumer SaaS orange

## Typography

- **Display**: Space Grotesk
- **Body**: Inter
- **Small telemetry / utility tone**: uppercase, wide tracking, orange-soft or faint white

## Surface hierarchy

1. page background and grid
2. standard glass panels (`.glass`)
3. stronger narrative panels (`.glass-strong`)
4. accent CTAs (`.btn-primary`)
5. neutral support CTAs (`.btn-secondary`)

## Component rules

- Avoid wrapping every sentence in its own card
- Use glass as a hierarchy tool, not a default
- Sponsor logos must dominate their own cards; containers should not feel emptier than the brand
- Long mobile pages should collapse detail density on the homepage and push deep content into dedicated routes

## Accessibility rules

- maintain high text contrast
- do not rely on blur for readability
- respect `prefers-reduced-motion`
- keep the website useful even if the 3D layer never loads
