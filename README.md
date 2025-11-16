# Interactive Mondrian-Inspired Generative Artwork  
### Individual Animated Version — User Interaction Driven  
IDEA9103 Creative Coding
Roger(Ruikang) Zhang
rzha0368

---

## 1. How to Interact With the Work

This artwork is fully driven by user input. To experience the animation:

- Click anywhere on the canvas.
- Each click creates:
  - A cross shape (four black line segments) that grows outward over 0.5 seconds.
  - A coloured rectangle (yellow, red, or blue) in one of the four quadrants.
  - A large grey watercolor-like ink blot drawn behind everything else.
- Each click also fades all existing crosses and rectangles slightly.  
  After 50 clicks, old elements disappear.
- The header text changes colour every time you click.

The artwork evolves through continuous clicking, building a layered Mondrian-like composition.

---

## 2. My Individual Approach to Animating the Group Code

Our group created a shared p5.js base framework.  
My individual version transforms the system into an interaction-driven artwork.

Changes I introduced:

- Replaced timed automation with fully user-driven creation.
- Each click becomes a “composition action” that contributes to the artwork.
- Added fading logic: shapes gradually disappear after repeated clicks.
- Added the watercolor ink background system.
- Added header colour cycling.

My animation focuses on giving users the power to construct the composition interactively.

---

## 3. Chosen Animation Driver: Interaction

From the four allowed drivers (audio, interaction, Perlin noise, time),  
I chose interaction.

Reasoning:

- Mondrian’s compositions are deliberate and constructed by hand.  
  Interaction allows the user to become the “painter.”
- Each click introduces a new geometric unit, reflecting Mondrian’s modular style.
- Interaction enables real-time generative composition that cannot be achieved through timed or noise-based animation alone.

---

## 4. What I Animate and How This Differs From My Group Members

My animated properties include:

- Cross lines that grow in four random directions.
- Quadrant rectangles that fade in.
- A durability system that fades shapes over 50 user clicks.
- Permanent watercolor ink strokes drawn behind everything.
- Header text that changes colour with interaction.

Other group members used completely different drivers:

- One used Perlin noise to distort curves.
- One used time-based animation to pulse colours.
- One used audio-reactive behaviour for shape vibration.

I am the only member whose work is built entirely around direct user input.

---

## 5. Artistic Inspirations

### Piet Mondrian – Composition  
I based my piece on Mondrian’s structured geometry:  
vertical and horizontal lines dividing the canvas into coloured regions.

This inspired:

- The black cross structure  
- The rectangular colour blocks  
- The fading layers that resemble older paint becoming background

### Watercolor Style  
Two sources influenced the ink effect:

1. Watercolor Effect & Paper Texture in p5.js  
   https://www.youtube.com/watch?v=MEYdsoZua7E  
   I adapted the idea of layered transparent shapes to simulate diffusion.

2. Spray Painting Code (p5.js)  
   https://editor.p5js.org/StevesMakerspace/sketches/e4rxSKgYE  
   I learned how jittered radial points can create soft organic boundaries.

These influences helped create the grey ink blots that accumulate behind the crosses and colour blocks.

---

## 6. Technical Explanation

### Cross Growth  
Each click generates four random lengths:  
left, right, up, down.  
These animate outward from the click centre over 0.5 seconds using linear interpolation.

### Quadrant Block Placement  
One quadrant is chosen randomly.  
The block’s width and height come directly from the two lengths that define its sides.  
It fades in smoothly over time.

### Durability System  
Every shape stores a counter called clickAge.  
On each user click, all shapes increase their age by one.  
Opacity = 1 - clickAge / 50.  
After 50 clicks, the shape is removed.

### Watercolor Ink Layer  
Ink is drawn on a separate graphics layer using:

- multiple irregular shapes  
- transparency  
- jittered vertices  
- radial variation  

This layer accumulates permanently and never fades.

### Header Colour Cycling  
Each click randomly chooses one of four colour options.

### Tools Used  
Only p5.js is used, with animation based on:

- millis()  
- alpha transparency  
- shape drawing  
- createGraphics()  
- arrays of objects storing state  
- randomness (as taught in course Weeks 1–9)

---

## 7. Changes Made to Group Code

My work differs from the group code in the following ways:

- Removed A/B mode switching.
- Removed setInterval logic.
- Replaced time-driven animation with user-driven animation.
- Added the durability fading system.
- Added quadrant placement logic.
- Added independent ink layer rendering.

---

## 8. External Techniques and Attribution

Two external references influenced the watercolor effect:

1. Watercolour diffusion method from a YouTube tutorial  
   https://www.youtube.com/watch?v=MEYdsoZua7E

2. Spray-paint jitter technique from a p5.js sketch  
   https://editor.p5js.org/StevesMakerspace/sketches/e4rxSKgYE

I rewrote both methods in simplified form and included comments in the code referencing these sources.

---

## 9. Run the Work

GitHub Pages link:  
(Insert your link)

Repository link:  
(Insert your link)
