# Simple Machines Project Memory

This file serves as a memory and documentation log for the Simple Machines interactive learning website.

## Project Overview
An interactive web application designed for elementary school natural science education, covering:
- Lever Principle (槓桿原理)
- Pulley & Wheel/Axle (輪軸與滑輪)
- Power Transmission (動力傳送)
- Life Applications (生活應用)
- Quiz Challenge (闖關大挑戰)

## Architectural Design
- **Structure**: Pure static HTML (`index.html`) using Vanilla CSS (`style.css`) and Vanilla JavaScript (`app.js`).
- **Dynamic Render**: SVGs for the "Life Applications" section are dynamically injected and drawn via the `draw` methods in `lifeItemsData` in `app.js`.
- **Animations**: Driven by CSS keyframes in `style.css` and applied to SVG group classes (e.g., `.anim-driver-body`, `.anim-flag-body`).
- **Cache Busting**: Version query parameters (e.g., `?v=2`) are appended to style/script tags in `index.html` to ensure users load the latest stylesheet and script changes without browser cache issues.

---

## Recent Visual & Animation Improvements

### 1. Movable Pulley (動滑輪)
- **Rope Alignment**: Shifted left ceiling hook, circle anchor, and rope line coordinates from `x = 210` to `x = 226` (which is `cx - r = 250 - 24`) so the rope attaches tangentially and wraps perfectly around the left side of the pulley wheel.
- **Rotation Direction**: Changed rotation from clockwise to counter-clockwise (`rotate(-angle)`) during upward movement to match correct physical rolling principles.

### 2. Screwdriver (螺絲起子)
- **Animation Motion**: Replaced the continuous 360-degree spin with a realistic hand rotation cycle: turns slowly clockwise by 1/8 of a circle ($45^\circ$), then turns counter-clockwise back by 1/8 of a circle, repeating continuously.
- **Easing**: Applied `ease-in-out` timing to the rotation to mimic human acceleration and deceleration when twisting.

### 3. Bicycle (腳踏車)
- **Visual Design**: Upgraded from two isolated floating sprockets to a full, recognizable bicycle illustration. Added a sleek gray tube frame, seat post, saddle, fork, and handlebars.
- **Rotating Wheels**: Integrated full front and rear wheels (rims, tires, and 8 spokes) that rotate in sync with the sprockets.
- **Complete Chain Loop**: Replaced two separate straight lines with a continuous closed-loop `<path>` that wraps around the edges of the sprockets and runs along the top and bottom. Dash animations flow around the entire loop.

### 4. Flagpole (升旗桿)
- **Synchronized Pulling Hand**: Moved hand's initial `cy` from `140` to `70` and added `anim-hand-pull` animation. The hand now pulls down in sync with the flag climbing up.
- **Sliding Label Guides**: Bound the dashed label guide lines to the `anim-hand-pull` and `anim-flag-body` groups, allowing the guide lines and text pointers to slide up and down with the hand and the flag.
- **Synchronized Pulley & Rope Flow**:
  - The top pulley rotates back and forth (`pulley-rotate`) only when the flag is moving.
  - The loop rope is split into `anim-rope-left` and `anim-rope-right` to flow in opposite directions (left rope moves down, right rope moves up) and pause when the flag stops.
