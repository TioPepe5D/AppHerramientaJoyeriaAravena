// ---------- Themes ----------
const hexToRgb = (hex) => {
  const m = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i.exec((hex||"").trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map(c=>c+c).join('');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
};
const rgbStr = (rgb) => rgb ? `${rgb[0]}, ${rgb[1]}, ${rgb[2]}` : "0, 0, 0";
const mix = (a, b, t) => [Math.round(a[0]+(b[0]-a[0])*t), Math.round(a[1]+(b[1]-a[1])*t), Math.round(a[2]+(b[2]-a[2])*t)];
const toHex = (rgb) => '#' + rgb.map(n => Math.max(0,Math.min(255,n)).toString(16).padStart(2,'0')).join('');
const lighten = (hex, t) => { const c = hexToRgb(hex); return c ? toHex(mix(c, [255,255,255], t)) : hex; };
const darken = (hex, t) => { const c = hexToRgb(hex); return c ? toHex(mix(c, [0,0,0], t)) : hex; };
const luminance = (hex) => { const c = hexToRgb(hex); if (!c) return 0; return (0.299*c[0]+0.587*c[1]+0.114*c[2])/255; };

const THEMES = {
  dark: {
    label: "Dark", icon: "🌙",
    vars: {
      "--bg": "#05060a", "--bg-2": "#0a0d14",
      "--panel": "#0f131c", "--panel-2": "#141924",
      "--line": "#1e2636", "--line-2": "#2a3448",
      "--ink": "#eaf1fb", "--ink-dim": "#a8b6cc", "--ink-mute": "#6b7a93",
      "--gold": "#5b9fd6", "--gold-2": "#8ec5ec", "--gold-deep": "#0a2540",
      "--accent-rgb": "91, 159, 214",
      "--accent-bright-rgb": "142, 197, 236",
      "--accent-deep-rgb": "10, 37, 64",
      "--surface-overlay-rgb": "10, 9, 7",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "255, 255, 255",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#05060a",
  },
  light: {
    label: "Light", icon: "☀️",
    vars: {
      "--bg": "#f7f4ee", "--bg-2": "#ffffff",
      "--panel": "#ffffff", "--panel-2": "#fbf8f1",
      "--line": "#e6dfd0", "--line-2": "#cfc4ad",
      "--ink": "#1a1a1a", "--ink-dim": "#4a4a4a", "--ink-mute": "#888888",
      "--gold": "#b8860b", "--gold-2": "#d4a017", "--gold-deep": "#6b4e00",
      "--accent-rgb": "184, 134, 11",
      "--accent-bright-rgb": "212, 160, 23",
      "--accent-deep-rgb": "107, 78, 0",
      "--surface-overlay-rgb": "245, 240, 230",
      "--shadow-color-rgb": "60, 50, 30",
      "--highlight-rgb": "255, 255, 255",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#f7f4ee",
  },
  claude: {
    label: "Claude", icon: "✦",
    vars: {
      "--bg": "#1a1714", "--bg-2": "#221d18",
      "--panel": "#2a231d", "--panel-2": "#322a23",
      "--line": "#3d342b", "--line-2": "#4d4138",
      "--ink": "#f4ede4", "--ink-dim": "#c4b8a8", "--ink-mute": "#8a7e6f",
      "--gold": "#d97757", "--gold-2": "#f4a380", "--gold-deep": "#5c2e1d",
      "--accent-rgb": "217, 119, 87",
      "--accent-bright-rgb": "244, 163, 128",
      "--accent-deep-rgb": "92, 46, 29",
      "--surface-overlay-rgb": "10, 7, 5",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "255, 240, 230",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#1a1714",
  },
};

const DEFAULT_CUSTOM = { bg: "#0e0e12", panel: "#1a1a22", ink: "#eeeeee", accent: "#9b6bff" };

const buildCustomTheme = (c) => {
  const bg = c.bg || DEFAULT_CUSTOM.bg;
  const panel = c.panel || DEFAULT_CUSTOM.panel;
  const ink = c.ink || DEFAULT_CUSTOM.ink;
  const accent = c.accent || DEFAULT_CUSTOM.accent;
  const isLight = luminance(bg) > 0.5;
  const accentRgb = hexToRgb(accent) || [155,107,255];
  const accentBright = lighten(accent, 0.25);
  const accentDeep = darken(accent, 0.55);
  const inkRgb = hexToRgb(ink) || [238,238,238];
  return {
    "--bg": bg,
    "--bg-2": isLight ? darken(bg, 0.04) : lighten(bg, 0.04),
    "--panel": panel,
    "--panel-2": isLight ? darken(panel, 0.03) : lighten(panel, 0.04),
    "--line": isLight ? darken(panel, 0.10) : lighten(panel, 0.10),
    "--line-2": isLight ? darken(panel, 0.18) : lighten(panel, 0.18),
    "--ink": ink,
    "--ink-dim": isLight ? lighten(ink, 0.30) : darken(ink, 0.30),
    "--ink-mute": isLight ? lighten(ink, 0.55) : darken(ink, 0.50),
    "--gold": accent,
    "--gold-2": accentBright,
    "--gold-deep": accentDeep,
    "--accent-rgb": rgbStr(accentRgb),
    "--accent-bright-rgb": rgbStr(hexToRgb(accentBright)),
    "--accent-deep-rgb": rgbStr(hexToRgb(accentDeep)),
    "--surface-overlay-rgb": isLight ? "245, 240, 230" : "10, 9, 7",
    "--shadow-color-rgb": isLight ? "60, 50, 30" : "0, 0, 0",
    "--highlight-rgb": isLight ? rgbStr(inkRgb) : "255, 255, 255",
    "--btn-fg": luminance(accent) > 0.55 ? "#1a1a1a" : "#ffffff",
  };
};

const applyTheme = (themeId, customConfig) => {
  let vars;
  let metaColor;
  if (themeId === 'custom') {
    vars = buildCustomTheme(customConfig || DEFAULT_CUSTOM);
    metaColor = vars["--bg"];
  } else {
    const t = THEMES[themeId] || THEMES.dark;
    vars = t.vars;
    metaColor = t.metaColor;
  }
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', metaColor);
};

const APP_PASSWORD = ".";

const TEAM = ["Diego","Benjamín","Jordan","Cristopher","Valentina","Amanda","Martín"];