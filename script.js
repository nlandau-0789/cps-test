// --- Conversion helpers ---
// RGB (0–1) → Linear RGB
const srgbToLinear = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
// Linear RGB → sRGB
const linearToSrgb = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

// sRGB → OKLab
function rgbToOklab(r, g, b) {
  const lR = srgbToLinear(r);
  const lG = srgbToLinear(g);
  const lB = srgbToLinear(b);

  const l = 0.4122214708 * lR + 0.5363325363 * lG + 0.0514459929 * lB;
  const m = 0.2119034982 * lR + 0.6806995451 * lG + 0.1073969566 * lB;
  const s = 0.0883024619 * lR + 0.2817188376 * lG + 0.6299787005 * lB;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  };
}

// OKLab → sRGB
function oklabToRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_ = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [
    Math.min(Math.max(linearToSrgb(r), 0), 1),
    Math.min(Math.max(linearToSrgb(g), 0), 1),
    Math.min(Math.max(linearToSrgb(b_), 0), 1)
  ];
}

// --- Interpolation ---
// Hex → RGB → OKLab → interpolate → RGB → hex
function lerpOklabColor(hex1, hex2, t) {
  const rgb1 = [
    parseInt(hex1.slice(1, 3), 16) / 255,
    parseInt(hex1.slice(3, 5), 16) / 255,
    parseInt(hex1.slice(5, 7), 16) / 255
  ];
  const rgb2 = [
    parseInt(hex2.slice(1, 3), 16) / 255,
    parseInt(hex2.slice(3, 5), 16) / 255,
    parseInt(hex2.slice(5, 7), 16) / 255
  ];

  const c1 = rgbToOklab(...rgb1);
  const c2 = rgbToOklab(...rgb2);

  const L = c1.L + (c2.L - c1.L) * t;
  const a = c1.a + (c2.a - c1.a) * t;
  const b = c1.b + (c2.b - c1.b) * t;

  const [r, g, b_] = oklabToRgb(L, a, b);
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b_)}`;
}

let count = 0;

setInterval(() => {
    document.getElementById("clicker").innerText = count;
    document.getElementById("clicker").style.fontSize = (8 + count/3) + "em";
    document.getElementById("clicker").style.backgroundColor = lerpOklabColor("#ff5f5f", "#5fff5f", Math.min(count / 25, 1));
}, 10);

function count_click() {
    count += 1;
    console.log(count);
    setTimeout(() => {
        count -= 1;
    }, 1000);
}