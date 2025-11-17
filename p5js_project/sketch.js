// Setup
const COL_Y = [245, 208, 40];
const COL_R = [206, 41, 35];
const COL_B = [44, 96, 185];
const COL_K = [0];

const BAND_RATIO = 0.01;
const CROSS_MS   = 500;
const RECT_MS    = 500;
const MAX_CLICKS = 50;
const HEADER_TEXT = 'PRESS THE SCREEN AT LEAST 50 TIMES PLZ';

let events = [];
let headerDiv;
let headerColorIndex = 0;
const HEADER_COLORS = [COL_Y, COL_R, COL_B, [0, 0, 0]];
let inkLayer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  noStroke();
  textFont("sans-serif");

  inkLayer = createGraphics(windowWidth, windowHeight);
  inkLayer.noStroke();
  inkLayer.clear();

  headerInit();
  headerLayout();
  updateHeaderColor();
}

// Resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  inkLayer = createGraphics(windowWidth, windowHeight);
  inkLayer.noStroke();
  inkLayer.clear();

  headerLayout();
}

// Draw
function draw() {
  background(210);
  image(inkLayer, 0, 0);

  const now = millis();
  const t = bandThickness();

  for (let ev of events) {
    const lifeFactor = max(0, 1 - ev.clickAge / MAX_CLICKS);

    const pc = constrain((now - ev.t0) / CROSS_MS, 0, 1);
    drawCross(ev, t, pc, lifeFactor);

    if (pc >= 1 && ev.phase === "cross") {
      ev.phase = "rect";
      ev.rectT0 = now;
    }

    if ((ev.phase === "rect" || ev.phase === "done") && ev.rect) {
      const pr = ev.phase === "done"
        ? 1
        : constrain((now - ev.rectT0) / RECT_MS, 0, 1);
      drawRectAnimated(ev.rect, pr, lifeFactor);
      if (pr >= 1 && ev.phase === "rect") {
        ev.phase = "done";
      }
    }
  }
}

// Click
function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  drawInk(mouseX, mouseY);
  updateHeaderColor();

  for (let ev of events) ev.clickAge++;
  events = events.filter(ev => ev.clickAge < MAX_CLICKS);

  const baseMax = min(width, height) * (0.12 + random() * 0.18);
  const minLen = baseMax * 0.35;
  const maxLen = baseMax;

  const leftLen  = randLen(minLen, maxLen);
  const rightLen = randLen(minLen, maxLen);
  const upLen    = randLen(minLen, maxLen);
  const downLen  = randLen(minLen, maxLen);

  const rectInfo = makeLocalRect(mouseX, mouseY, leftLen, rightLen, upLen, downLen);

  const ev = {
    x: mouseX,
    y: mouseY,
    leftLen,
    rightLen,
    upLen,
    downLen,
    t0: millis(),
    phase: "cross",
    rect: rectInfo,
    rectT0: 0,
    clickAge: 0
  };

  events.push(ev);
}

// Thickness
function bandThickness() {
  return min(width, height) * BAND_RATIO;
}
function randLen(minL, maxL) {
  return random(minL, maxL);
}

// Cross
function drawCross(ev, t, progress, lifeFactor) {
  const cx = ev.x, cy = ev.y;
  const p = constrain(progress, 0, 1);
  const a = 255 * lifeFactor;

  fill(...COL_K, a);
  rectMode(CORNER);

  const rightLen = ev.rightLen * p;
  rect(cx, cy - t / 2, rightLen, t);

  const leftLen = ev.leftLen * p;
  rect(cx - leftLen, cy - t / 2, leftLen, t);

  const upLen = ev.upLen * p;
  rect(cx - t / 2, cy - upLen, t, upLen);

  const downLen = ev.downLen * p;
  rect(cx - t / 2, cy, t, downLen);
}

// Rectangle
function makeLocalRect(cx, cy, leftLen, rightLen, upLen, downLen) {
  const t = bandThickness();
  const quad = random(["tl", "tr", "bl", "br"]);
  // top-left, top-right, bottom-left, bottom-right

  const wLeft  = leftLen  - t / 2;
  const wRight = rightLen - t / 2;
  const hUp    = upLen    - t / 2;
  const hDown  = downLen  - t / 2;
  // Available width/height inside each quadrant (line thickness subtracted)

  let x, y, w, h;

  if (quad === "tl") {
    w = wLeft; h = hUp;
    x = cx - leftLen; y = cy - upLen;
  } else if (quad === "tr") {
    w = wRight; h = hUp;
    x = cx + t / 2; y = cy - upLen;
  } else if (quad === "bl") {
    w = wLeft; h = hDown;
    x = cx - leftLen; y = cy + t / 2;
  } else {
    w = wRight; h = hDown;
    x = cx + t / 2; y = cy + t / 2;
  }

  if (w <= 2 || h <= 2) return null;
  // If this quadrant has no space (too small), skip creating a rectangle

  const col = random([
    color(...COL_Y),
    color(...COL_R),
    color(...COL_B)
  ]);

  return { x, y, w, h, col };
}

// RectAnimation
function drawRectAnimated(rectObj, progress, lifeFactor) {
  if (!rectObj) return;
  const col = rectObj.col;
  const alpha = 220 * progress * lifeFactor;
  fill(red(col), green(col), blue(col), alpha);
  noStroke();
  rectMode(CORNER);
  rect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
}

// Ink – background watercolor-inspired effect
function drawInk(cx, cy) {
  // This ink / spray effect is adapted and simplified from a spray painting technique by Steve's Makerspace:
  // https://editor.p5js.org/StevesMakerspace/sketches/e4rxSKgYE
  // I rewrote it to use grey tones and larger soft blobs for an ink / wash look.
  inkLayer.push();
  inkLayer.translate(cx, cy);
  inkLayer.noStroke();

  const baseGray = random(80, 150);

  // Draw several overlapping blot shapes with slightly different orientation and tone
  for (let k = 0; k < 4; k++) {
    inkLayer.push();
    inkLayer.rotate(random(TWO_PI));
    inkLayer.fill(
      baseGray + random(-20, 20),
      baseGray + random(-20, 20),
      baseGray + random(-20, 20),
      18
    );
    inkLayer.beginShape();
    for (let a = 0; a < TWO_PI; a += 0.4) {
      // Jittered radius to make edges irregular (spray / watercolor feel)
      const r = random(90, 200);
      const x = cos(a) * r;
      const y = sin(a) * r;
      inkLayer.vertex(x, y);
    }
    inkLayer.endShape(CLOSE);
    inkLayer.pop();
  }

  inkLayer.pop();
}

// Header
function headerInit() {
  const div = document.createElement('div');
  div.id = 'headerText';
  div.textContent = HEADER_TEXT;
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.fontFamily = 'sans-serif';
  div.style.fontWeight = '700';
  div.style.letterSpacing = '0.12em';
  div.style.margin = '10px 0';
  document.body.prepend(div);
  headerDiv = div;
}

function headerLayout() {
  const div = document.getElementById('headerText');
  if (!div) return;
  const fs = Math.max(18, Math.min(44, Math.round(window.innerWidth / 24)));
  div.style.fontSize = fs + 'px';
}

// HeaderColor
function updateHeaderColor() {
  let next = headerColorIndex;
  while (next === headerColorIndex) {
    next = floor(random(HEADER_COLORS.length));
  }
  headerColorIndex = next;
  const col = HEADER_COLORS[headerColorIndex];
  const css = `rgb(${col[0]},${col[1]},${col[2]})`;
  if (headerDiv) headerDiv.style.color = css;
}
