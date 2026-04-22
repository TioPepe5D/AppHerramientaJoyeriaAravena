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
  emerald: {
    label: "Esmeralda", icon: "🌿",
    vars: {
      "--bg": "#0a1410", "--bg-2": "#0f1c17",
      "--panel": "#142822", "--panel-2": "#1b352c",
      "--line": "#26473b", "--line-2": "#365e4f",
      "--ink": "#e8f5ee", "--ink-dim": "#a8c4b6", "--ink-mute": "#6f8a7d",
      "--gold": "#34d399", "--gold-2": "#6ee7b7", "--gold-deep": "#064e3b",
      "--accent-rgb": "52, 211, 153",
      "--accent-bright-rgb": "110, 231, 183",
      "--accent-deep-rgb": "6, 78, 59",
      "--surface-overlay-rgb": "5, 15, 11",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "230, 255, 240",
      "--btn-fg": "#0a1410",
    },
    metaColor: "#0a1410",
  },
  sunset: {
    label: "Sunset", icon: "🌅",
    vars: {
      "--bg": "#1d0f1a", "--bg-2": "#291422",
      "--panel": "#341a2b", "--panel-2": "#412237",
      "--line": "#5a2e48", "--line-2": "#75405d",
      "--ink": "#fbeae6", "--ink-dim": "#d8b4ac", "--ink-mute": "#9c7a78",
      "--gold": "#f97316", "--gold-2": "#fb923c", "--gold-deep": "#7c2d12",
      "--accent-rgb": "249, 115, 22",
      "--accent-bright-rgb": "251, 146, 60",
      "--accent-deep-rgb": "124, 45, 18",
      "--surface-overlay-rgb": "20, 8, 14",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "255, 230, 220",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#1d0f1a",
  },
  ocean: {
    label: "Océano", icon: "🌊",
    vars: {
      "--bg": "#06141f", "--bg-2": "#0a1f2e",
      "--panel": "#0f2a3d", "--panel-2": "#15384f",
      "--line": "#1f4d6b", "--line-2": "#2d6890",
      "--ink": "#e6f4fb", "--ink-dim": "#a3c5d8", "--ink-mute": "#6e8fa3",
      "--gold": "#06b6d4", "--gold-2": "#22d3ee", "--gold-deep": "#0c4a6e",
      "--accent-rgb": "6, 182, 212",
      "--accent-bright-rgb": "34, 211, 238",
      "--accent-deep-rgb": "12, 74, 110",
      "--surface-overlay-rgb": "3, 12, 20",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "220, 240, 255",
      "--btn-fg": "#04141d",
    },
    metaColor: "#06141f",
  },
  rose: {
    label: "Rosa", icon: "🌹",
    vars: {
      "--bg": "#1a0c12", "--bg-2": "#26121b",
      "--panel": "#321722", "--panel-2": "#3f1d2c",
      "--line": "#54293e", "--line-2": "#6e3a54",
      "--ink": "#fbe9ee", "--ink-dim": "#d6acba", "--ink-mute": "#9a7986",
      "--gold": "#ec4899", "--gold-2": "#f472b6", "--gold-deep": "#831843",
      "--accent-rgb": "236, 72, 153",
      "--accent-bright-rgb": "244, 114, 182",
      "--accent-deep-rgb": "131, 24, 67",
      "--surface-overlay-rgb": "20, 8, 12",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "255, 230, 240",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#1a0c12",
  },
  midnight: {
    label: "Medianoche", icon: "🌌",
    vars: {
      "--bg": "#0b0a1f", "--bg-2": "#11102b",
      "--panel": "#1a1838", "--panel-2": "#221f47",
      "--line": "#2e2a5f", "--line-2": "#3f3a82",
      "--ink": "#ecebff", "--ink-dim": "#b3b1d9", "--ink-mute": "#76749e",
      "--gold": "#a78bfa", "--gold-2": "#c4b5fd", "--gold-deep": "#4c1d95",
      "--accent-rgb": "167, 139, 250",
      "--accent-bright-rgb": "196, 181, 253",
      "--accent-deep-rgb": "76, 29, 149",
      "--surface-overlay-rgb": "8, 7, 22",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "240, 235, 255",
      "--btn-fg": "#0b0a1f",
    },
    metaColor: "#0b0a1f",
  },
  cyberpunk: {
    label: "Cyberpunk", icon: "⚡",
    vars: {
      "--bg": "#06060c", "--bg-2": "#0c0a18",
      "--panel": "#120f24", "--panel-2": "#1a1632",
      "--line": "#2a1f55", "--line-2": "#3d2d80",
      "--ink": "#f0f6ff", "--ink-dim": "#a6b1d6", "--ink-mute": "#6a7299",
      "--gold": "#ff2bd6", "--gold-2": "#22d3ee", "--gold-deep": "#5b1773",
      "--accent-rgb": "255, 43, 214",
      "--accent-bright-rgb": "34, 211, 238",
      "--accent-deep-rgb": "91, 23, 115",
      "--surface-overlay-rgb": "5, 5, 12",
      "--shadow-color-rgb": "0, 0, 0",
      "--highlight-rgb": "255, 230, 250",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#06060c",
  },
  sakura: {
    label: "Sakura", icon: "🌸",
    vars: {
      "--bg": "#fdf2f5", "--bg-2": "#ffffff",
      "--panel": "#ffffff", "--panel-2": "#fce8ee",
      "--line": "#f3cfd9", "--line-2": "#e0a7b8",
      "--ink": "#3a1f29", "--ink-dim": "#6b4955", "--ink-mute": "#9a7c86",
      "--gold": "#db2777", "--gold-2": "#ec4899", "--gold-deep": "#831843",
      "--accent-rgb": "219, 39, 119",
      "--accent-bright-rgb": "236, 72, 153",
      "--accent-deep-rgb": "131, 24, 67",
      "--surface-overlay-rgb": "255, 240, 245",
      "--shadow-color-rgb": "120, 40, 70",
      "--highlight-rgb": "255, 255, 255",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#fdf2f5",
  },
  mint: {
    label: "Menta", icon: "🍃",
    vars: {
      "--bg": "#f0fdf6", "--bg-2": "#ffffff",
      "--panel": "#ffffff", "--panel-2": "#dcfce7",
      "--line": "#bbf7d0", "--line-2": "#86efac",
      "--ink": "#14361f", "--ink-dim": "#3d6149", "--ink-mute": "#6f8d7a",
      "--gold": "#059669", "--gold-2": "#10b981", "--gold-deep": "#064e3b",
      "--accent-rgb": "5, 150, 105",
      "--accent-bright-rgb": "16, 185, 129",
      "--accent-deep-rgb": "6, 78, 59",
      "--surface-overlay-rgb": "240, 255, 245",
      "--shadow-color-rgb": "20, 80, 50",
      "--highlight-rgb": "255, 255, 255",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#f0fdf6",
  },
  nordic: {
    label: "Nórdico", icon: "❄️",
    vars: {
      "--bg": "#eceff4", "--bg-2": "#f8fafc",
      "--panel": "#ffffff", "--panel-2": "#e5e9f0",
      "--line": "#d8dee9", "--line-2": "#aeb8cc",
      "--ink": "#2e3440", "--ink-dim": "#4c566a", "--ink-mute": "#7b8494",
      "--gold": "#5e81ac", "--gold-2": "#88c0d0", "--gold-deep": "#2e3440",
      "--accent-rgb": "94, 129, 172",
      "--accent-bright-rgb": "136, 192, 208",
      "--accent-deep-rgb": "46, 52, 64",
      "--surface-overlay-rgb": "236, 239, 244",
      "--shadow-color-rgb": "46, 52, 64",
      "--highlight-rgb": "255, 255, 255",
      "--btn-fg": "#ffffff",
    },
    metaColor: "#eceff4",
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