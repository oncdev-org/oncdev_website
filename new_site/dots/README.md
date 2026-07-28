# Google Antigravity Background Dots Effect

This repository contains a premium, interactive recreation of the background dots animation found on [antigravity.google](https://antigravity.google).

## Features
- **GPU-Accelerated Simulation (GPGPU):** Calculates particle positions, velocities, and scales on the GPU using double-buffered framebuffers (`WebGLRenderTarget` + floating-point textures).
- **Blue Noise Point Distribution:** Employs *Bridson's Poisson Disk Sampling* algorithm in 2D to create an organic, evenly spaced point field (preventing visual clustering).
- **Interactive Cursor Dynamics:** Particles deform dynamically around a wandering cursor or user mouse movement using Simplex noise distortion field equations.
- **Dual Themes:** Clean, immersive light and dark theme configurations matching the platform visual defaults.
- **Live Controls Card:** Glassmorphism UI panel to tweak parameters live (Density, Particle Scale, Interaction Radius, Displacement Force, Custom Gradient Presets, Autopilot mode).

## Structure
- [index.html](file:///C:/Users/plato/OneDrive/Documentos/myfiles/code/projects/OnCube-dev_website/site/dots/index.html) - Structural templates, CDN integrations, and the glassmorphic card settings menu.
- [styles.css](file:///C:/Users/plato/OneDrive/Documentos/myfiles/code/projects/OnCube-dev_website/site/dots/styles.css) - Responsive layouts, premium sliders, Outfit typography, and custom styling.
- [app.js](file:///C:/Users/plato/OneDrive/Documentos/myfiles/code/projects/OnCube-dev_website/site/dots/app.js) - Complete JS application wrapping Three.js setups, shaders (Ian McEwan simplex noise chunks), and custom math libraries.

## How to run locally
Run the following commands in the directory:
```bash
# Starts a local static web server
npm start
```
Then navigate to [http://localhost:8080](http://localhost:8080) in your web browser.
