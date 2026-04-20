
/* ═══════════════════════════════════════
   DATA
   js/data.js
═══════════════════════════════════════ */

// ── Constantes de React Hooks (disponibles globalmente desde React CDN) ──
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---------- Data ----------
const DEFAULT_PRICES = {
  "collar_pulsera_mujer_925": { "name": "Collar y Pul Mujer 💁🏼‍♀️", "material": "SL 925", "cost": 450, "costKilero": 400, "prices": [1900, 950, 800, 650, 550] },
  "collar_pulsera_hombre_925": { "name": "Collar y Pul Hombre 🙋🏻‍♂️", "material": "SL 925", "cost": 450, "costKilero": 400, "prices": [1500, 750, 700, 500, 450] },
  "aros_colgantes_925": { "name": "Aros y Colgantes ✨", "material": "SL 925", "cost": 650, "costKilero": 550, "prices": [3600, 1200, 1000, 900, 850] },
  "anillos_925": { "name": "Anillos 💍", "material": "SL 925", "cost": 650, "costKilero": 550, "prices": [4500, 1500, 1250, 1100, 1000] },
  "collar_pulsera_micro": { "name": "Collar y Pul Micro 💎", "material": "Micro", "cost": 650, "costKilero": 550, "prices": [2000, 1000, 900, 800, 750] },
  "italiana_925": { "name": "Italiana 🇮🇹", "material": "925", "cost": 2000, "costKilero": 2000, "prices": [5500, 2750, 2500, 2250, 2000] },
  "gf_18k": { "name": "GF 18 K ⚜️", "material": "GF 18K", "cost": 1400, "costKilero": 1300, "prices": [5000, 2500, 2250, 2000, 1800] }
};

const CATEGORY_ORDER = Object.keys(DEFAULT_PRICES);
const INSUMO_KEY = "__insumos__";
const LOTE_KEY   = "__lotes__";
const LOTE_TYPES = [
  { key: "cadena",   label: "Cadena",   emoji: "🔗" },
  { key: "micro",    label: "Micro",    emoji: "💎" },
  { key: "italiana", label: "Italy",    emoji: "🇮🇹" },
  { key: "gf18k",    label: "GF 18K",  emoji: "☀️" },
];

const TIER_RULES = [
  { label: "PU",  desc: "Precio unitario (pieza individual)" },
  { label: "I",   desc: "Supera $30.000" },
  { label: "II",  desc: "Supera $100.000" },
  { label: "III", desc: "Supera 500g" },
  { label: "IV",  desc: "Supera 1.000g" },
];

const LS_HISTORY   = "joya.history.v1";
const LS_PRICES    = "joya.prices.v1";
const LS_TAB       = "joya.tab.v1";
const LS_PAGO      = "joya.pago.v1";
const LS_AUTH      = "joya.auth.v1";
const LS_HIST_MIG  = "joya.history.migrated.v2";
const LS_THEME     = "joya.theme.v1";
const LS_CUSTOM_THEME = "joya.theme.custom.v1";

const APP_PASSWORD = ".";
const TEAM = ["Diego","Benjamín","Jordan","Cristopher","Valentina","Amanda","Martín"];
const EMPRESA = "Diego";
const PCT_SCHEDULER = 0.35;
const PCT_ATTENDANT = 0.35;
const PCT_EMPRESA   = 0.30;

const DEFAULT_CUSTOM = { bg: "#0e0e12", panel: "#1a1a22", ink: "#eeeeee", accent: "#9b6bff" };


/* ═══════════════════════════════════════
   THEMES
   js/themes.js
═══════════════════════════════════════ */

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



/* ═══════════════════════════════════════
   UTILS
   js/utils.js
═══════════════════════════════════════ */

// ---------- Utils ----------
const fmtCLP = (n) => {
  if (!isFinite(n)) n = 0;
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(Math.round(n));
};
const fmtDate = (t) => {
  const d = new Date(t);
  return d.toLocaleDateString('es-CL', { day:'2-digit', month:'short' }).replace('.','') +
         ' · ' + d.toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' });
};
const uid = () => Math.random().toString(36).slice(2, 9);

const CATEGORY_EMOJI = {
  collar_pulsera_mujer_925: "🇨🇱",
  collar_pulsera_hombre_925: "🇨🇱",
  aros_colgantes_925: "🇨🇱",
  anillos_925: "🇨🇱",
  collar_pulsera_micro: "🇨🇱",
  italiana_925: "🇮🇹",
  gf_18k: "☀️"
};
const emojiForCategory = (key, cat) => {
  if (CATEGORY_EMOJI[key]) return CATEGORY_EMOJI[key];
  const mat = (cat?.material || "").toUpperCase();
  if (mat.includes("GF")) return "☀️";
  if (mat === "925") return "🇮🇹";
  return "🇨🇱";
};

const MESSAGE_GROUPS = [
  { key: "collares", label: "Cadena", emoji: "🇨🇱",
    categories: ["collar_pulsera_mujer_925", "collar_pulsera_hombre_925"] },
  { key: "micro", label: "Micro", emoji: "🇨🇱",
    categories: ["collar_pulsera_micro", "aros_colgantes_925", "anillos_925"] },
  { key: "italiana", label: "Italiana 925", emoji: "🇮🇹",
    categories: ["italiana_925"] },
  { key: "gf", label: "GF 18K", emoji: "☀️",
    categories: ["gf_18k"] }
];
const fmtGrams = (g) => {
  const r = Math.round(g * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
};
const buildMessagePiezas = (validLines, prices) => {
  const sums = new Map();
  const order = [];
  const ungrouped = [];
  const insumos = [];
  const lotes = [];
  for (const l of validLines) {
    if (l.category === INSUMO_KEY) { insumos.push(l); continue; }
    if (l.category === LOTE_KEY)   { lotes.push(l);   continue; }
    const grams = Number(l.grams) || 0;
    const group = MESSAGE_GROUPS.find(g => g.categories.includes(l.category));
    if (group) {
      if (!sums.has(group.key)) { sums.set(group.key, 0); order.push(group); }
      sums.set(group.key, sums.get(group.key) + grams);
    } else {
      const cat = prices[l.category];
      ungrouped.push({
        grams,
        label: cat?.name || l.category,
        emoji: emojiForCategory(l.category, cat)
      });
    }
  }
  const lines = order.map(g => `${fmtGrams(sums.get(g.key))} | ${g.emoji} ${g.label}`);
  for (const u of ungrouped) lines.push(`${fmtGrams(u.grams)} | ${u.emoji} ${u.label}`);
  for (const ins of insumos) {
    const cost = Number(ins.insumoCost) || Number(ins.insumoPrice) || 0;
    const qty  = Number(ins.insumoQty)  || 1;
    lines.push(`💎 ${qty} ${ins.insumoName || 'Insumo'}: $${fmtCLP(cost * qty)}`);
  }
  for (const lot of lotes) {
    const gramsMap = lot.loteGramsMap || {};
    const totalGrams = Object.values(gramsMap).reduce((s,v) => s+(Number(v)||0), 0);
    const detalles = LOTE_TYPES.filter(t => Number(gramsMap[t.key]) > 0).map(t => `${t.emoji} ${t.label}: ${gramsMap[t.key]}g`).join(' · ');
    const nombre = lot.loteName ? ` · ${lot.loteName}` : '';
    const gramos = totalGrams ? ` · ${totalGrams}g` : '';
    lines.push(`📦 Lote${nombre}${gramos}${detalles ? '\n' + detalles : ''}: $${fmtCLP(Number(lot.lotePrice) || 0)}`);
  }
  return lines.join('\n');
};

// Index map: 0=T-0 (≤$30k), 1=T-I (>$30k), 2=T-II (>$100k), 3=T-III (>500g), 4=T-IV (>1000g)
// El total final CON el descuento del tramo debe superar el umbral.
// Si al aplicar T-II el total cae bajo $100k, se baja a T-I, etc.
function computeTotals(lines, prices){
  const regular = lines.filter(l => l.category !== INSUMO_KEY && l.category !== LOTE_KEY);
  const totalWeight = regular.reduce((s,l) => s + (Number(l.grams)||0), 0);

  const calcRegularTotal = (tierIdx) => regular.reduce((s,l) => {
    const cat = prices[l.category];
    if (!cat) return s;
    const unitPrice = l.customPrice ? (Number(l.customPrice)||0) : (cat.prices[tierIdx]||0);
    return s + unitPrice * (Number(l.grams)||0);
  }, 0);

  let tier;
  // Peso tiene prioridad
  if (totalWeight > 1000) tier = 4;
  else if (totalWeight > 500) tier = 3;
  else {
    // Tramos por precio: el total AL precio del tramo debe superar el umbral
    const totalAtII = calcRegularTotal(2);
    const totalAtI  = calcRegularTotal(1);

    if (totalAtII > 100000) tier = 2;
    else if (totalAtI > 30000) tier = 1;
    else tier = 0;
  }

  const regularTotal = calcRegularTotal(tier);
  const insumoTotal = lines.filter(l => l.category === INSUMO_KEY).reduce((s,l) => {
    const cost = Number(l.insumoCost) || Number(l.insumoPrice) || 0;
    const qty  = Number(l.insumoQty)  || 1;
    return s + cost * qty;
  }, 0);
  const loteTotal = lines.filter(l => l.category === LOTE_KEY).reduce((s,l) => s + (Number(l.lotePrice)||0), 0);
  const total = regularTotal + insumoTotal + loteTotal;

  let reason;
  if (totalWeight > 1000) reason = `Peso total ${fmtCLP(totalWeight)}g supera 1.000g`;
  else if (totalWeight > 500) reason = `Peso total ${fmtCLP(totalWeight)}g supera 500g`;
  else if (tier === 2) reason = `Venta supera $100.000`;
  else if (tier === 1) reason = `Venta supera $30.000`;
  else reason = `Venta hasta $30.000 (sin descuento)`;

  return { tier, total, totalWeight, reason };
}

/* ═══════════════════════════════════════
   LOGIC
   js/logic.js
═══════════════════════════════════════ */

// ---------- Lógica de negocio ----------
// Kilero se activa automáticamente en tramos basados en peso (T-III desde 500g).
const isKileroTier = (tier) => tier >= 3;
const effectiveCost = (cat, tier) => {
  if (!cat) return 0;
  const n = isKileroTier(tier) ? Number(cat.costKilero) : Number(cat.cost);
  return isFinite(n) ? n : (Number(cat.cost) || 0);
};

const quoteCostAndProfit = (quote, prices) => {
  if (typeof quote.profit === 'number' && typeof quote.totalCost === 'number') {
    return { totalCost: quote.totalCost, profit: quote.profit };
  }
  // Fallback para cotizaciones antiguas sin snapshot
  let totalCost = 0;
  for (const l of (quote.lines || [])) {
    const g = Number(l.grams) || 0;
    const snap = quote.costsSnap && quote.costsSnap[l.category];
    const c = (typeof snap === 'number') ? snap : (Number(prices?.[l.category]?.cost) || 0);
    totalCost += c * g;
  }
  const profit = (Number(quote.total) || 0) - totalCost;
  return { totalCost, profit };
};

const computeCommissions = (quote, prices) => {
  const { profit } = quoteCostAndProfit(quote, prices);
  const base = Math.max(0, profit);
  const sched = (quote.scheduler || "").trim();
  const att   = (quote.attendant || "").trim();
  const splits = {};
  const add = (name, amt) => {
    if (!name) return;
    splits[name] = (splits[name] || 0) + amt;
  };
  add(sched || EMPRESA, base * PCT_SCHEDULER);
  add(att   || EMPRESA, base * PCT_ATTENDANT);
  add(EMPRESA, base * PCT_EMPRESA);
  return splits;
};

const monthKey = (ts) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
};
const monthLabel = (key) => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m-1, 1);
  return d.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
};

/* ═══════════════════════════════════════
   ICON
   components/Icon.js
═══════════════════════════════════════ */

// ---------- Icons ----------
const Icon = ({ name, size=16 }) => {
  const common = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:1.5, strokeLinecap:"round", strokeLinejoin:"round" };
  switch(name){
    case 'calc': return <svg {...common}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3M8 19h3M13 19h3"/></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'list': return <svg {...common}><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>;
    case 'trash': return <svg {...common}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>;
    case 'copy': return <svg {...common}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>;
    case 'share': return <svg {...common}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>;
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'x': return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'sliders': return <svg {...common}><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
    case 'check': return <svg {...common}><path d="M20 6L9 17l-5-5"/></svg>;
    case 'circle': return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>;
    default: return null;
  }
};

/* ═══════════════════════════════════════
   LOGIN
   components/Login.js
═══════════════════════════════════════ */

// ---------- Login ----------
function LoginScreen({ onAuth }){
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (pwd === APP_PASSWORD) {
      sessionStorage.setItem(LS_AUTH, "1");
      onAuth();
    } else {
      setErr(true);
      setPwd("");
    }
  };
  return (
    <div className="app">
      <header className="brand">
        <div className="mark" aria-hidden>◆</div>
        <div>
          <h1>Joyería <em>Aravena</em></h1>
          <div className="sub">Ventas Presenciales</div>
        </div>
      </header>
      <div className="card" style={{marginTop:20}}>
        <div className="card-head">
          <h2>Acceso <em>restringido</em></h2>
          <span className="eyebrow">Ingresa tu clave</span>
        </div>
        <form onSubmit={submit} className="client" style={{padding:"18px 16px 20px"}}>
          <div className="control-labeled">
            <label>Contraseña</label>
            <div className="control" style={err ? {borderColor:"var(--danger)"} : null}>
              <input
                type="password"
                autoFocus
                value={pwd}
                onChange={e => { setPwd(e.target.value); setErr(false); }}
                placeholder="••••••••"
              />
            </div>
            {err && <span style={{color:"var(--danger)",fontSize:12,marginTop:4,fontFamily:"var(--mono)"}}>Clave incorrecta</span>}
          </div>
          <div className="actions" style={{marginTop:16}}>
            <button type="submit" className="btn accent" style={{flex:1}}>Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SALES LIST
   components/SalesList.js
═══════════════════════════════════════ */

// ---------- SalesList (expandable) ----------
function SalesList({ quotes, prices }){
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded(e => e === id ? null : id);

  return (
    <div className="report-list">
      {quotes.map(q => {
        const isOpen = expanded === q.id;
        const c = computeCommissions(q, prices);
        const { totalCost, profit } = quoteCostAndProfit(q, prices);
        return (
          <div key={q.id} className="report-item" style={{cursor:'pointer',transition:'all .2s'}} onClick={() => toggle(q.id)}>
            <div className="ri-head">
              <div className="ri-client">{q.client || <em>Sin cliente</em>}</div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="ri-total">${fmtCLP(q.total)}</div>
                <span style={{color:'var(--ink-mute)',fontSize:12,transition:'transform .2s',transform:isOpen?'rotate(180deg)':'rotate(0deg)'}}>▼</span>
              </div>
            </div>
            <div className="ri-sub">
              <span>{fmtDate(q.at)}</span>
              <span className="sep">·</span>
              <span>Agendó: <b>{q.scheduler || EMPRESA}</b></span>
              <span className="sep">·</span>
              <span>Atendió: <b>{q.attendant || EMPRESA}</b></span>
            </div>
            {isOpen && (
              <div className="fade-in" style={{marginTop:10}}>
                <div style={{borderTop:'1px solid var(--line)',paddingTop:10}}>
                  <div className="eyebrow" style={{marginBottom:8}}>Detalle de productos</div>
                  {q.lines.map((l, i) => {
                    if (l.category === INSUMO_KEY) {
                      return (
                        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'4px 0',fontSize:13,color:'var(--ink-dim)'}}>
                          <span>{l.insumoName || 'Insumo'} 💎</span>
                          <span style={{fontFamily:'var(--mono)',fontWeight:600,color:'var(--ink)'}}>${fmtCLP(l.insumoPrice || 0)}</span>
                        </div>
                      );
                    }
                    if (l.category === LOTE_KEY) {
                      const gramsMap = l.loteGramsMap || {};
                      const totalGrams = Object.values(gramsMap).reduce((s,v) => s+(Number(v)||0), 0);
                      return (
                        <div key={i} style={{padding:'4px 0',fontSize:13,color:'var(--ink-dim)'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                            <span>📦 Lote{l.loteName ? ` · ${l.loteName}` : ''}{totalGrams ? ` · ${totalGrams}g` : ''}</span>
                            <span style={{fontFamily:'var(--mono)',fontWeight:600,color:'var(--ink)'}}>${fmtCLP(l.lotePrice || 0)}</span>
                          </div>
                          {LOTE_TYPES.filter(t => Number(gramsMap[t.key]) > 0).map(t => (
                            <div key={t.key} style={{fontSize:11,color:'var(--ink-mute)',paddingLeft:8}}>{t.emoji} {t.label}: {gramsMap[t.key]}g</div>
                          ))}
                        </div>
                      );
                    }
                    const cat = prices[l.category];
                    const price = cat ? cat.prices[q.tier] : 0;
                    const sub = price * (Number(l.grams) || 0);
                    return (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'4px 0',fontSize:13,color:'var(--ink-dim)',gap:8}}>
                        <span style={{flex:1,minWidth:0}}>{cat ? cat.name : l.category}</span>
                        <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-mute)',whiteSpace:'nowrap'}}>
                          {l.grams}g × ${fmtCLP(price)}
                        </span>
                        <span style={{fontFamily:'var(--mono)',fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap'}}>
                          ${fmtCLP(sub)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{borderTop:'1px solid var(--line)',marginTop:10,paddingTop:10,display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                  <div className="ri-sub" style={{margin:0}}><span>Peso: <b>{fmtCLP(q.totalWeight)}g</b></span></div>
                  <div className="ri-sub" style={{margin:0}}><span>Tramo: <b>{TIER_RULES[q.tier]?.label || '—'}</b></span></div>
                  <div className="ri-sub" style={{margin:0}}><span>Costo: <b>${fmtCLP(totalCost)}</b></span></div>
                  <div className="ri-sub" style={{margin:0}}><span>Ganancia: <b style={{color:'var(--gold-2)'}}>${fmtCLP(profit)}</b></span></div>
                </div>

                <div style={{borderTop:'1px solid var(--line)',marginTop:10,paddingTop:10}}>
                  <div className="eyebrow" style={{marginBottom:6}}>Comisiones</div>
                  <div className="ri-splits">
                    {Object.entries(c).map(([n, v]) => (
                      <span key={n} className="ri-chip">{n}: ${fmtCLP(v)}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   CALC TAB
   components/CalcTab.js
═══════════════════════════════════════ */

// ---------- Calculator Tab ----------
function CalcTab({ clientName, setClientName, pago, setPago, scheduler, setScheduler, attendant, setAttendant, concretada, setConcretada, lines, prices, addLine, removeLine, updateLine, totals, resetCalc, saveQuote, copyMessage, canCopy }){
  const [openPickerId, setOpenPickerId] = useState(null);
  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-head">
          <h2>Detalles de <em>venta</em></h2>
          <span className="eyebrow">N.º {lines.length}</span>
        </div>
        <div className="client">
          <div className="control-labeled">
            <label>A quién le pago</label>
            <div className="control">
              <select value={pago} onChange={e => setPago(e.target.value)}>
                <option value="">—</option>
                {TEAM.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="control-labeled">
            <label>Nombre del cliente (opcional)</label>
            <div className="control">
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ej. María Fernández"
              />
            </div>
          </div>
          <div className="control-labeled">
            <label>Agendó</label>
            <div className="control">
              <select value={scheduler} onChange={e => setScheduler(e.target.value)}>
                <option value="">—</option>
                {TEAM.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="control-labeled">
            <label>Atendió</label>
            <div className="control">
              <select value={attendant} onChange={e => setAttendant(e.target.value)}>
                <option value="">—</option>
                {TEAM.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="lines">
          {lines.map((line, i) => {
            const isInsumo = line.category === INSUMO_KEY;
            const isLote   = line.category === LOTE_KEY;
            const cat = (!isInsumo && !isLote) ? prices[line.category] : null;
            const tierPrice = cat ? cat.prices[totals.tier] : 0;
            const price = (!isInsumo && !isLote && line.customPrice) ? (Number(line.customPrice) || 0) : tierPrice;
            const g = Number(line.grams) || 0;
            const insumoCostVal = Number(line.insumoCost) || Number(line.insumoPrice) || 0;
            const insumoQtyVal  = Number(line.insumoQty)  || 1;
            const lotePriceVal  = Number(line.lotePrice)  || 0;
            const sub = isInsumo ? insumoCostVal * insumoQtyVal : isLote ? lotePriceVal : price * g;
            return (
              <div className="line" key={line.id}>
                <span className="line-idx">N°{String(i+1).padStart(2,'0')}</span>
                {(isInsumo || isLote) ? (
                  <>
                    <div className="field" style={{gridColumn:'1 / -1'}}>
                      <label>Categoría</label>
                      <div className="control">
                        <select value={line.category} onChange={e => updateLine(line.id, { category: e.target.value })}>
                          {CATEGORY_ORDER.map(k => (
                            <option key={k} value={k}>{prices[k].name}</option>
                          ))}
                          <option value={INSUMO_KEY}>Insumos 💎</option>
                          <option value={LOTE_KEY}>Lotes 📦</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Costo</label>
                      <div className="control">
                        <span className="unit" style={{marginLeft:0,marginRight:6}}>$</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          value={line.insumoCost || ''}
                          onChange={e => updateLine(line.id, { insumoCost: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    {isInsumo ? (
                      <>
                        <div className="field">
                          <label>Cantidad</label>
                          <div className="control">
                            <input type="number" inputMode="numeric" min="1"
                              value={line.insumoQty || ''}
                              onChange={e => updateLine(line.id, { insumoQty: e.target.value })}
                              placeholder="1"
                            />
                            <span className="unit">un.</span>
                          </div>
                        </div>
                        <button className="remove" onClick={() => removeLine(line.id)} aria-label="Eliminar línea" disabled={lines.length === 1}>
                          <Icon name="x" size={14}/>
                        </button>
                        <div className="field" style={{gridColumn:'1 / -1'}}>
                          <label>Nombre del insumo</label>
                          <div className="control">
                            <input type="text"
                              value={line.insumoName || ''}
                              onChange={e => updateLine(line.id, { insumoName: e.target.value })}
                              placeholder="Ej. Maletero, Caja, etc."
                            />
                            <span className="unit">💎</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <button className="remove" style={{gridColumn:'3'}} onClick={() => removeLine(line.id)} aria-label="Eliminar línea" disabled={lines.length === 1}>
                          <Icon name="x" size={14}/>
                        </button>
                        <div style={{gridColumn:'1 / -1', display:'flex', flexDirection:'column', gap:6}}>
                          <div className="field">
                            <label>Nombre del lote</label>
                            <div className="control">
                              <input type="text"
                                value={line.loteName || ''}
                                onChange={e => updateLine(line.id, { loteName: e.target.value })}
                                placeholder="Ej. Lote 1, Navidad, etc."
                              />
                              <span className="unit">📦</span>
                            </div>
                          </div>
                          {LOTE_TYPES.map(t => (
                            <div key={t.key} style={{display:'grid', gridTemplateColumns:'90px 1fr', gap:6, alignItems:'center'}}>
                              <div style={{display:'flex',alignItems:'center',gap:6,padding:'8px 10px',background:'rgba(var(--surface-overlay-rgb),.4)',border:'1px solid var(--line)',borderRadius:8,fontFamily:'var(--mono)',fontSize:12,fontWeight:600,color:'var(--gold-2)',whiteSpace:'nowrap'}}>
                                <span>{t.emoji}</span><span>{t.label}</span>
                              </div>
                              <div className="control" style={{minHeight:40}}>
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  min="0"
                                  value={(line.loteGramsMap || {})[t.key] || ''}
                                  onChange={e => updateLine(line.id, { loteGramsMap: { ...(line.loteGramsMap||{}), [t.key]: e.target.value } })}
                                  placeholder="0"
                                  style={{fontSize:13}}
                                />
                                <span className="unit">g</span>
                              </div>
                            </div>
                          ))}
                          <div className="field" style={{marginTop:2}}>
                            <label>Precio</label>
                            <div className="control">
                              <span className="unit" style={{marginLeft:0,marginRight:4}}>$</span>
                              <input type="number" inputMode="numeric" min="0"
                                value={line.lotePrice || ''}
                                onChange={e => updateLine(line.id, { lotePrice: e.target.value })}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="field">
                      <label>Categoría</label>
                      <div className="control">
                        <select value={line.category} onChange={e => updateLine(line.id, { category: e.target.value })}>
                          {CATEGORY_ORDER.map(k => (
                            <option key={k} value={k}>{prices[k].name}</option>
                          ))}
                          <option value={INSUMO_KEY}>Insumos 💎</option>
                          <option value={LOTE_KEY}>Lotes 📦</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Gramaje</label>
                      <div className="control">
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
                          value={line.grams}
                          onChange={e => updateLine(line.id, { grams: e.target.value })}
                          placeholder="0"
                        />
                        <span className="unit">g</span>
                      </div>
                    </div>
                    <button className="remove" onClick={() => removeLine(line.id)} aria-label="Eliminar línea" disabled={lines.length === 1}>
                      <Icon name="x" size={14}/>
                    </button>
                  </>
                )}
                {!isInsumo && !isLote && (
                  <div style={{gridColumn:'1 / -1',marginTop:2}}>
                    <button
                      onClick={() => setOpenPickerId(openPickerId === line.id ? null : line.id)}
                      style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 12px',background:'var(--surface-2,rgba(255,255,255,.05))',border:'1px solid var(--line)',borderRadius:8,color:'var(--ink)',fontSize:12,fontFamily:'var(--mono)',cursor:'pointer',transition:'border-color .15s'}}
                    >
                      <span style={{color:'var(--ink-mute)'}}>Tabla de precios</span>
                      <span style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{color: line.customPrice ? 'var(--gold-2)' : 'var(--ink)', fontWeight:600}}>
                          {line.customPrice ? `$${fmtCLP(Number(line.customPrice))}/g · PERSONALIZADO` : `$${fmtCLP(tierPrice)}/g · Auto T-${TIER_RULES[totals.tier].label}`}
                        </span>
                        <span style={{color:'var(--ink-mute)',fontSize:10,transform: openPickerId===line.id ? 'rotate(180deg)' : 'none',transition:'transform .2s'}}>▼</span>
                      </span>
                    </button>
                    {openPickerId === line.id && (
                      <div className="fade-in" style={{marginTop:4,border:'1px solid var(--line)',borderRadius:8,overflow:'hidden'}}>
                        {cat && cat.prices.map((p, i) => {
                          const isActive = line.customPrice ? Number(line.customPrice) === p : i === totals.tier;
                          return (
                            <button key={i} onClick={() => {
                              updateLine(line.id, { customPrice: i === totals.tier ? '' : String(p) });
                              setOpenPickerId(null);
                            }} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 14px',background: isActive ? 'rgba(var(--accent-rgb),.15)' : 'transparent',border:'none',borderBottom:'1px solid var(--line)',color: isActive ? 'var(--gold-2)' : 'var(--ink)',cursor:'pointer',fontSize:13,fontFamily:'var(--mono)'}}>
                              <span style={{color:'var(--ink-mute)',fontSize:11}}>T-{TIER_RULES[i].label}</span>
                              <span style={{fontWeight: isActive ? 700 : 400}}>${fmtCLP(p)}<span style={{fontSize:10,color:'var(--ink-mute)'}}>/g</span></span>
                            </button>
                          );
                        })}
                        <div style={{padding:'8px 14px',borderTop:'none',background:'transparent'}}>
                          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom: line.customPrice && !cat.prices.includes(Number(line.customPrice)) ? 6 : 0}}>
                            <span style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--gold-2)',letterSpacing:'.08em',fontWeight:600}}>PERSONALIZADO</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
                            <span style={{color:'var(--ink-mute)',fontFamily:'var(--mono)',fontSize:13}}>$</span>
                            <input
                              type="number"
                              inputMode="numeric"
                              min="0"
                              value={line.customPrice && !cat.prices.map(String).includes(String(line.customPrice)) ? line.customPrice : ''}
                              onChange={e => updateLine(line.id, { customPrice: e.target.value })}
                              placeholder="Ingresar precio/g"
                              style={{flex:1,background:'var(--surface-2,rgba(255,255,255,.06))',border:'1px solid var(--line)',borderRadius:6,padding:'6px 10px',color:'var(--ink)',fontFamily:'var(--mono)',fontSize:13}}
                            />
                            <span style={{color:'var(--ink-mute)',fontSize:11,fontFamily:'var(--mono)'}}>CLP/g</span>
                            {line.customPrice && (
                              <button onClick={() => { updateLine(line.id, { customPrice: '' }); setOpenPickerId(null); }}
                                style={{padding:'4px 8px',background:'transparent',border:'1px solid var(--line)',borderRadius:6,color:'var(--ink-mute)',fontSize:11,cursor:'pointer'}}>Auto</button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="line-meta">
                  {isInsumo ? (
                    <>
                      <span className="price-tag">Insumo · {insumoQtyVal} un. × ${fmtCLP(insumoCostVal)}</span>
                      <span className="subtotal">${fmtCLP(sub)}</span>
                    </>
                  ) : isLote ? (
                    <>
                      <span className="price-tag">Lote 📦{line.loteName ? ` · ${line.loteName}` : ''}{Object.values(line.loteGramsMap||{}).reduce((s,v)=>s+(Number(v)||0),0) ? ` · ${Object.values(line.loteGramsMap||{}).reduce((s,v)=>s+(Number(v)||0),0)}g` : ''} · precio fijo</span>
                      <span className="subtotal">${fmtCLP(sub)}</span>
                    </>
                  ) : (
                    <>
                      <span className="price-tag">
                        {line.customPrice ? `$${fmtCLP(price)}/g · PERSONALIZADO` : `$${fmtCLP(price)}/g · tramo ${TIER_RULES[totals.tier].label}`}
                      </span>
                      <span className="subtotal">${fmtCLP(sub)}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{padding:'0 16px 16px'}}>
          <button className="add-line" onClick={addLine}>
            <span className="plus">+</span> Añadir línea
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Resumen</h2>
          <span className="eyebrow">Cálculo automático</span>
        </div>
        <div className="summary">
          <div className="tier">
            <div className="tier-badge">{TIER_RULES[totals.tier].label}</div>
            <div className="tier-body">
              <div className="eyebrow">Tramo aplicado</div>
              <div className="why"><strong>{TIER_RULES[totals.tier].desc}.</strong> {totals.reason}.</div>
              {isKileroTier(totals.tier) && (
                <div style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:6,background:'rgba(var(--accent-rgb),.15)',border:'1px solid rgba(var(--accent-rgb),.4)',borderRadius:6,padding:'3px 8px',fontSize:11,fontFamily:'var(--mono)',color:'var(--gold-2)',letterSpacing:'.1em'}}>
                  ◆ KILERO ACTIVO
                </div>
              )}
            </div>
          </div>
          <div className="totals">
            <div className="row">
              <span className="k">Peso total</span>
              <span className="v">{fmtCLP(totals.totalWeight)} g</span>
            </div>
            <div className="row">
              <span className="k">Líneas</span>
              <span className="v">{lines.filter(l => Number(l.grams) > 0).length} de {lines.length}</span>
            </div>
            <div className="row grand">
              <span className="k">Total</span>
              <span className="v"><span className="currency">CLP</span>${fmtCLP(totals.total)}</span>
            </div>
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={resetCalc}>Limpiar</button>
            <button className="btn primary" onClick={saveQuote}>Guardar cotización</button>
            <button className="btn accent" onClick={copyMessage} disabled={!canCopy} style={{flexBasis:'100%'}}>
              <span style={{fontSize:'18px'}}>📋</span> Copiar mensaje
            </button>
          </div>
        </div>
      </div>

      <div className="flourish" style={{margin:'26px 0 0'}}>
        <span>Aravena · Orfebrería</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HISTORY TAB
   components/HistoryTab.js
═══════════════════════════════════════ */

// ---------- History Tab ----------
function HistoryTab({ history, prices, onDelete, onDuplicate, onShare, onToggleConcretada }){
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return history;
    return history.filter(h =>
      (h.client || '').toLowerCase().includes(needle) ||
      (h.scheduler || '').toLowerCase().includes(needle) ||
      (h.attendant || '').toLowerCase().includes(needle) ||
      h.lines.some(l => l.category === INSUMO_KEY
        ? (l.insumoName || '').toLowerCase().includes(needle)
        : l.category === LOTE_KEY
        ? (l.loteType || '').toLowerCase().includes(needle)
        : ((prices[l.category] && prices[l.category].name) || '').toLowerCase().includes(needle))
    );
  }, [q, history, prices]);

  return (
    <div className="fade-in">
      <div className="history-search">
        <Icon name="search" size={15}/>
        <input
          type="text" placeholder="Buscar por cliente o categoría…"
          value={q} onChange={e => setQ(e.target.value)}
        />
        {q && <button className="icon-btn" style={{width:28,height:28}} onClick={()=>setQ("")} aria-label="Limpiar búsqueda"><Icon name="x" size={12}/></button>}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="diamond"/>
            <p>{history.length === 0 ? "Aún no hay cotizaciones guardadas." : "Sin resultados."}</p>
            <div className="hint">{history.length === 0 ? "Crea una desde la Calculadora" : "Prueba otra búsqueda"}</div>
          </div>
        </div>
      ) : (
        <div className="card">
          {filtered.map(h => (
            <div className="quote" key={h.id}>
              <div className="quote-head">
                <div className="quote-name">
                  {h.client || <em>Sin cliente</em>}
                </div>
                <div className="quote-date">{fmtDate(h.at)}</div>
              </div>
              {(h.scheduler || h.attendant) && (
                <div className="quote-staff">
                  {h.scheduler && <span>Agendó: <b>{h.scheduler}</b></span>}
                  {h.scheduler && h.attendant && <span className="sep">·</span>}
                  {h.attendant && <span>Atendió: <b>{h.attendant}</b></span>}
                </div>
              )}
              <div className="quote-lines">
                {h.lines.map((l, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="sep">·</span>}
                    {l.category === INSUMO_KEY
                      ? <>{l.insumoName || 'Insumo'} 💎 <span style={{fontStyle:'normal',fontFamily:'var(--mono)',fontSize:11}}>${fmtCLP(l.insumoPrice || 0)}</span></>
                      : l.category === LOTE_KEY
                      ? <>📦 Lote{l.loteName ? ` ${l.loteName}` : ''}{l.grams ? ` ${l.grams}g` : ''} <span style={{fontStyle:'normal',fontFamily:'var(--mono)',fontSize:11}}>${fmtCLP(l.lotePrice || 0)}</span></>
                      : <>{(prices[l.category] && prices[l.category].name) || l.category} <span style={{fontStyle:'normal',fontFamily:'var(--mono)',fontSize:11}}>{l.grams}g</span></>
                    }
                  </React.Fragment>
                ))}
              </div>
              <div className="quote-foot">
                <div>
                  <div className="quote-total"><span className="currency">CLP</span>${fmtCLP(h.total)}</div>
                  <div className="quote-tier" style={{marginTop:4}}>◆ Tramo {TIER_RULES[h.tier].label}</div>
                </div>
                <div className="quote-actions">
                  <button
                    className={"icon-btn" + (h.concretada ? " on" : "")}
                    onClick={()=>onToggleConcretada(h.id)}
                    aria-label={h.concretada ? "Venta confirmada · En reportes" : "Confirmar venta · Agregar a reportes"}
                    title={h.concretada ? "✅ Venta confirmada · En reportes" : "Confirmar venta · Agregar a reportes"}
                  >
                    <Icon name={h.concretada ? "check" : "circle"} size={14}/>
                  </button>
                  <button className="icon-btn" onClick={()=>onShare(h)} aria-label="Compartir por WhatsApp"><Icon name="share" size={14}/></button>
                  <button className="icon-btn" onClick={()=>onDuplicate(h)} aria-label="Duplicar"><Icon name="copy" size={14}/></button>
                  <button className="icon-btn danger" onClick={()=>{ if (confirm('¿Eliminar esta cotización?')) onDelete(h.id); }} aria-label="Eliminar"><Icon name="trash" size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flourish" style={{margin:'26px 0 0'}}>
        <span>{history.length} cotización{history.length === 1 ? '' : 'es'} guardada{history.length === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REPORTS TAB
   components/ReportsTab.js
═══════════════════════════════════════ */

// ---------- Reports Tab ----------
function ReportsTab({ history, prices, onToggleConcretada }){
  const months = useMemo(() => {
    const set = new Set(history.map(q => monthKey(q.at)));
    const now = monthKey(Date.now());
    set.add(now);
    return Array.from(set).sort().reverse();
  }, [history]);

  const [month, setMonth] = useState(() => monthKey(Date.now()));

  const monthQuotes = useMemo(
    () => history.filter(q => monthKey(q.at) === month && q.concretada),
    [history, month]
  );

  const summary = useMemo(() => {
    const byPerson = {};
    let totalVentas = 0, totalCostos = 0, totalGanancia = 0;
    const inc = (n, k, v) => {
      byPerson[n] = byPerson[n] || { agendado: 0, atendido: 0, empresa: 0 };
      byPerson[n][k] += v;
    };
    for (const q of monthQuotes) {
      const total = Number(q.total) || 0;
      const { totalCost, profit } = quoteCostAndProfit(q, prices);
      const base = Math.max(0, profit);
      totalVentas += total;
      totalCostos += totalCost;
      totalGanancia += profit;
      const sched = (q.scheduler || "").trim() || EMPRESA;
      const att   = (q.attendant || "").trim() || EMPRESA;
      inc(sched, 'agendado', base * PCT_SCHEDULER);
      inc(att,   'atendido', base * PCT_ATTENDANT);
      inc(EMPRESA, 'empresa', base * PCT_EMPRESA);
    }
    const rows = Object.entries(byPerson).map(([name, v]) => ({
      name, ...v, comision: v.agendado + v.atendido + v.empresa
    })).sort((a, b) => b.comision - a.comision);
    const totalComisionEquipo = rows.reduce((s, r) => s + r.agendado + r.atendido, 0);
    const totalEmpresa = rows.reduce((s, r) => s + r.empresa, 0);
    return { rows, totalVentas, totalCostos, totalGanancia, totalComisionEquipo, totalEmpresa };
  }, [monthQuotes, prices]);

  const exportCSV = () => {
    const header = [
      "Fecha","Cliente","Agendó","Atendió","Tramo","Venta","Costo","Ganancia",
      "Comisión Agendó (35%)","Comisión Atendió (35%)","Comisión Empresa (30%)"
    ];
    const rows = monthQuotes.map(q => {
      const total = Number(q.total) || 0;
      const { totalCost, profit } = quoteCostAndProfit(q, prices);
      const base = Math.max(0, profit);
      const d = new Date(q.at);
      const fecha = d.toLocaleDateString('es-CL') + " " + d.toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' });
      return [
        fecha,
        q.client || "",
        q.scheduler || EMPRESA,
        q.attendant || EMPRESA,
        TIER_RULES[q.tier] ? TIER_RULES[q.tier].label : "",
        total,
        Math.round(totalCost),
        Math.round(profit),
        Math.round(base * PCT_SCHEDULER),
        Math.round(base * PCT_ATTENDANT),
        Math.round(base * PCT_EMPRESA)
      ];
    });
    const esc = (v) => {
      const s = String(v ?? "");
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
    };
    const csv = [header, ...rows].map(r => r.map(esc).join(";")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${month}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-head">
          <h2>Reporte <em>mensual</em></h2>
          <span className="eyebrow">{monthLabel(month)}</span>
        </div>
        <div style={{padding:'12px 14px', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <div className="control-labeled" style={{flex:'1 1 180px'}}>
            <label>Mes</label>
            <div className="control">
              <select value={month} onChange={e => setMonth(e.target.value)}>
                {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
              </select>
            </div>
          </div>
          <button className="btn accent" onClick={exportCSV} disabled={monthQuotes.length === 0}>
            <Icon name="share" size={14}/> Exportar CSV
          </button>
        </div>
        <div className="report-summary">
          <div className="rs-card">
            <div className="rs-label">Ventas</div>
            <div className="rs-value">${fmtCLP(summary.totalVentas)}</div>
            <div className="rs-sub">{monthQuotes.length} concretada{monthQuotes.length===1?'':'s'}</div>
          </div>
          <div className="rs-card">
            <div className="rs-label">Costos</div>
            <div className="rs-value">${fmtCLP(summary.totalCostos)}</div>
            <div className="rs-sub">Mercadería</div>
          </div>
          <div className="rs-card">
            <div className="rs-label">Ganancia</div>
            <div className="rs-value">${fmtCLP(summary.totalGanancia)}</div>
            <div className="rs-sub">Venta − costo</div>
          </div>
          <div className="rs-card">
            <div className="rs-label">Comisiones equipo</div>
            <div className="rs-value">${fmtCLP(summary.totalComisionEquipo)}</div>
            <div className="rs-sub">70% de ganancia</div>
          </div>
          <div className="rs-card">
            <div className="rs-label">Empresa</div>
            <div className="rs-value">${fmtCLP(summary.totalEmpresa)}</div>
            <div className="rs-sub">30% de ganancia</div>
          </div>
        </div>
      </div>

      {summary.rows.length > 0 && (
        <div className="card">
          <div className="card-head"><h2>Por <em>persona</em></h2></div>
          <div className="report-people">
            {summary.rows.map(r => (
              <div key={r.name} className="rp-row">
                <div className="rp-name">{r.name}{r.name === EMPRESA && <span className="rp-tag"> · empresa</span>}</div>
                <div className="rp-breakdown">
                  <span>Agendó: <b>${fmtCLP(r.agendado)}</b></span>
                  <span>Atendió: <b>${fmtCLP(r.atendido)}</b></span>
                  {r.empresa > 0 && <span>Empresa: <b>${fmtCLP(r.empresa)}</b></span>}
                </div>
                <div className="rp-total">${fmtCLP(r.comision)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h2>Ventas del <em>mes</em></h2>
          <span className="eyebrow">{monthQuotes.length}</span>
        </div>
        {monthQuotes.length === 0 ? (
          <div className="empty">
            <div className="diamond"/>
            <p>No hay ventas concretadas este mes</p>
            <div className="hint">Marca las cotizaciones como "Venta concretada" para incluirlas</div>
          </div>
        ) : (
          <SalesList quotes={monthQuotes} prices={prices} />
        )}
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════
   PRICES TAB
   components/PricesTab.js
═══════════════════════════════════════ */

// ---------- Prices Tab ----------
function PricesTab({ prices, activeTier }){
  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-head">
          <h2>Tabla de <em>precios</em></h2>
        </div>
        <div className="ptable">
          {CATEGORY_ORDER.map(key => {
            const cat = prices[key];
            return (
              <div className="ptable-row" key={key}>
                <div className="ptable-name">
                  <span>{cat.name}</span>
                  <span className="mat">{cat.material}</span>
                </div>
                <div className="ptable-grid">
                  {cat.prices.map((p, i) => (
                    <div className={"ptable-cell" + (i === activeTier ? ' active' : '')} key={i}>
                      <div className="t">T{TIER_RULES[i].label}</div>
                      <div className="p">{`$${fmtCLP(p)}`}</div>
                      <span className="unit">CLP / g</span>
                    </div>
                  ))}
                </div>
                <div className="ptable-cost">
                  <span className="cost-label">Costo / g</span>
                  <span className="cost-value">${fmtCLP(cat.cost ?? 0)}</span>
                </div>
                <div className="ptable-cost" style={{borderTop:'1px solid var(--line)',paddingTop:8,marginTop:4}}>
                  <span className="cost-label" style={{color:'var(--gold-2)'}}>Costo Kilero / g</span>
                  <span className="cost-value" style={{color:'var(--gold-2)'}}>${fmtCLP(cat.costKilero ?? cat.cost ?? 0)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="tiers-legend">
          <h3>Reglas de tramo</h3>
          <ul>
            <li><span className="t">T-0</span><span>Venta hasta $30.000 (sin descuento)</span></li>
            <li><span className="t">T-I</span><span>Venta supera $30.000</span></li>
            <li><span className="t">T-II</span><span>Venta supera $100.000</span></li>
            <li><span className="t">T-III</span><span>Peso supera 500g</span></li>
            <li><span className="t">T-IV</span><span>Peso supera 1.000g</span></li>
          </ul>
        </div>
      </div>

      <div className="flourish" style={{margin:'26px 0 0'}}>
        <span>Tarifa vigente · por gramo</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   THEME PICKER
   components/ThemePicker.js
═══════════════════════════════════════ */

// ---------- Theme Picker ----------
function ThemePicker({ theme, setTheme, customTheme, setCustomTheme, onClose }){
  const update = (k, v) => setCustomTheme(c => ({ ...c, [k]: v }));
  return (
    <div className="theme-overlay" onClick={onClose}>
      <div className="theme-modal" onClick={e=>e.stopPropagation()}>
        <div className="theme-head">
          <h3>Tema</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><Icon name="x" size={14}/></button>
        </div>
        <div className="theme-grid">
          {Object.entries(THEMES).map(([id, t]) => (
            <button
              key={id}
              className={"theme-chip" + (theme === id ? ' active' : '')}
              onClick={()=>setTheme(id)}
              style={{
                background: t.vars["--panel"],
                color: t.vars["--ink"],
                borderColor: theme === id ? t.vars["--gold"] : t.vars["--line"],
              }}
            >
              <div className="theme-swatches">
                <span style={{background:t.vars["--gold"]}}/>
                <span style={{background:t.vars["--gold-2"]}}/>
                <span style={{background:t.vars["--bg"]}}/>
              </div>
              <div className="theme-label">{t.icon} {t.label}</div>
            </button>
          ))}
          <button
            className={"theme-chip" + (theme === 'custom' ? ' active' : '')}
            onClick={()=>setTheme('custom')}
          >
            <div className="theme-swatches">
              <span style={{background:customTheme.accent}}/>
              <span style={{background:customTheme.panel}}/>
              <span style={{background:customTheme.bg}}/>
            </div>
            <div className="theme-label">🎨 Personalizado</div>
          </button>
        </div>
        {theme === 'custom' && (
          <div className="theme-custom">
            <div className="theme-custom-row">
              <label>Fondo</label>
              <input type="color" value={customTheme.bg} onChange={e=>update('bg', e.target.value)}/>
              <span className="theme-hex">{customTheme.bg}</span>
            </div>
            <div className="theme-custom-row">
              <label>Tarjeta</label>
              <input type="color" value={customTheme.panel} onChange={e=>update('panel', e.target.value)}/>
              <span className="theme-hex">{customTheme.panel}</span>
            </div>
            <div className="theme-custom-row">
              <label>Texto</label>
              <input type="color" value={customTheme.ink} onChange={e=>update('ink', e.target.value)}/>
              <span className="theme-hex">{customTheme.ink}</span>
            </div>
            <div className="theme-custom-row">
              <label>Acento</label>
              <input type="color" value={customTheme.accent} onChange={e=>update('accent', e.target.value)}/>
              <span className="theme-hex">{customTheme.accent}</span>
            </div>
            <button className="btn ghost" style={{width:'100%',marginTop:8}} onClick={()=>setCustomTheme(DEFAULT_CUSTOM)}>
              Restablecer custom
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   TWEAKS PANEL
   components/TweaksPanel.js
═══════════════════════════════════════ */

// ---------- Tweaks (host toolbar) ----------
function TweaksPanel({ prices, setPrices, onClose }){
  const [cat, setCat] = useState(CATEGORY_ORDER[0]);
  return (
    <div className="tweaks open">
      <div className="tweaks-head">
        <strong>◆ Tweaks</strong>
        <button className="icon-btn" onClick={onClose} style={{width:28,height:28}}><Icon name="x" size={12}/></button>
      </div>
      <div className="tweaks-body">
        <div className="tweak-row">
          <label>Categoría</label>
          <select value={cat} onChange={e=>setCat(e.target.value)}>
            {CATEGORY_ORDER.map(k => <option key={k} value={k}>{prices[k].name}</option>)}
          </select>
        </div>
        {[0,1,2,3,4].map(i => (
          <div className="tweak-row" key={i}>
            <label>Tramo {TIER_RULES[i].label} (CLP/g)</label>
            <input
              type="number"
              value={prices[cat].prices[i]}
              onChange={e => {
                const v = Number(e.target.value) || 0;
                setPrices(p => {
                  const copy = { ...p, [cat]: { ...p[cat], prices: [...p[cat].prices] } };
                  copy[cat].prices[i] = v;
                  return copy;
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

/* ═══════════════════════════════════════
   APP
   js/app.js
═══════════════════════════════════════ */

// ---------- App ----------
function App(){
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(LS_AUTH) === "1");

  const [tab, setTab] = useState(() => localStorage.getItem(LS_TAB) || 'calc');
  const [prices, setPrices] = useState(() => {
    try {
      const s = localStorage.getItem(LS_PRICES);
      if (s) {
        const stored = JSON.parse(s);
        const merged = {};
        for (const k of Object.keys(stored)) {
          merged[k] = { ...stored[k] };
          // Siempre sincronizar cost, costKilero y prices desde defaults
          if (DEFAULT_PRICES[k]) {
            merged[k].cost = DEFAULT_PRICES[k].cost;
            merged[k].costKilero = DEFAULT_PRICES[k].costKilero;
            merged[k].prices = [...DEFAULT_PRICES[k].prices];
            merged[k].name = DEFAULT_PRICES[k].name;
            merged[k].material = DEFAULT_PRICES[k].material;
          }
        }
        // Agregar categorías nuevas que no existan en stored
        for (const k of Object.keys(DEFAULT_PRICES)) {
          if (!merged[k]) merged[k] = { ...DEFAULT_PRICES[k] };
        }
        return merged;
      }
    } catch(e){}
    return DEFAULT_PRICES;
  });
  const [history, setHistory] = useState(() => {
    try {
      const s = localStorage.getItem(LS_HISTORY);
      if (!s) return [];
      const parsed = JSON.parse(s);
      if (!localStorage.getItem(LS_HIST_MIG)) {
        const migrated = parsed.map(h => ({ ...h, tier: (Number(h.tier) || 0) + 1 }));
        localStorage.setItem(LS_HIST_MIG, "1");
        return migrated;
      }
      return parsed;
    } catch(e){}
    return [];
  });

  const [clientName, setClientName] = useState("");
  const [scheduler, setScheduler] = useState("");
  const [attendant, setAttendant] = useState("");
  const [pago, setPago] = useState(() => localStorage.getItem(LS_PAGO) || "");
  const [concretada, setConcretada] = useState(false);
  const [lines, setLines] = useState([
    { id: uid(), category: CATEGORY_ORDER[0], grams: "" }
  ]);

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  // Tweaks state
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setEditMode(true);
      if (e.data.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem(LS_TAB, tab); }, [tab]);
  useEffect(() => { localStorage.setItem(LS_PRICES, JSON.stringify(prices)); }, [prices]);
  useEffect(() => { localStorage.setItem(LS_HISTORY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(LS_PAGO, pago); }, [pago]);

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem(LS_THEME) || 'dark');
  const [customTheme, setCustomTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_CUSTOM_THEME)) || DEFAULT_CUSTOM; }
    catch(e) { return DEFAULT_CUSTOM; }
  });
  const [themeOpen, setThemeOpen] = useState(false);
  useEffect(() => {
    applyTheme(theme, customTheme);
    localStorage.setItem(LS_THEME, theme);
  }, [theme, customTheme]);
  useEffect(() => { localStorage.setItem(LS_CUSTOM_THEME, JSON.stringify(customTheme)); }, [customTheme]);

  const logout = () => {
    sessionStorage.removeItem(LS_AUTH);
    setAuthed(false);
  };

  const totals = useMemo(() => computeTotals(lines, prices), [lines, prices]);

  const addLine = () => setLines(ls => [...ls, { id: uid(), category: CATEGORY_ORDER[0], grams: "" }]);
  const removeLine = (id) => setLines(ls => ls.length > 1 ? ls.filter(l => l.id !== id) : ls);
  const updateLine = (id, patch) => setLines(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));

  const resetCalc = () => {
    setLines([{ id: uid(), category: CATEGORY_ORDER[0], grams: "" }]);
    setClientName("");
    setScheduler("");
    setAttendant("");
    setConcretada(false);
  };

  const isValidLine = (l) => {
    if (l.category === INSUMO_KEY) return Number(l.insumoCost) > 0 || Number(l.insumoPrice) > 0;
    if (l.category === LOTE_KEY)   return Number(l.lotePrice) > 0;
    return Number(l.grams) > 0;
  };
  const hasValidLines = lines.some(isValidLine);

  const copyMessage = async () => {
    const validLines = lines.filter(isValidLine);
    if (validLines.length === 0) return;
    const piezas = buildMessagePiezas(validLines, prices);
    const msg =
`Pago: ${pago}
Atención : ${attendant}
Agenda : ${scheduler}
Nombre Cliente : ${clientName.trim()}

${piezas}

Venta: $${fmtCLP(totals.total)}${totals.tier === 4 ? '\n(Precio Kilero)' : ''}`;
    try {
      await navigator.clipboard.writeText(msg);
      showToast("¡Mensaje copiado!");
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = msg; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); showToast("¡Mensaje copiado!"); } catch(_){ showToast("No se pudo copiar"); }
      document.body.removeChild(ta);
    }
  };

  const saveQuote = () => {
    const validLines = lines.filter(isValidLine);
    if (validLines.length === 0) { showToast("Agrega al menos una línea"); return; }
    const costsSnap = {};
    let totalCost = 0;
    const kilero = isKileroTier(totals.tier);
    for (const l of validLines) {
      if (l.category === INSUMO_KEY) {
        const cost = Number(l.insumoCost) || Number(l.insumoPrice) || 0;
        const qty  = Number(l.insumoQty)  || 1;
        totalCost += cost * qty;
        continue;
      }
      if (l.category === LOTE_KEY) {
        totalCost += Number(l.lotePrice) || 0;
        continue;
      }
      const g = Number(l.grams) || 0;
      const c = effectiveCost(prices[l.category], totals.tier);
      costsSnap[l.category] = c;
      totalCost += c * g;
    }
    const profit = (Number(totals.total) || 0) - totalCost;
    const entry = {
      id: uid(),
      at: Date.now(),
      client: clientName.trim(),
      scheduler,
      attendant,
      concretada: true,
      lines: validLines.map(l => {
        if (l.category === INSUMO_KEY) {
          const cost = Number(l.insumoCost) || Number(l.insumoPrice) || 0;
          const qty  = Number(l.insumoQty)  || 1;
          return { category: INSUMO_KEY, insumoName: l.insumoName || 'Insumo', insumoCost: cost, insumoQty: qty, insumoPrice: cost * qty, grams: 0 };
        }
        if (l.category === LOTE_KEY) {
          const gramsMap = l.loteGramsMap || {};
          const totalGrams = Object.values(gramsMap).reduce((s,v) => s+(Number(v)||0), 0);
          return { category: LOTE_KEY, loteName: l.loteName || '', loteGramsMap: gramsMap, lotePrice: Number(l.lotePrice) || 0, grams: totalGrams };
        }
        return { category: l.category, grams: Number(l.grams), customPrice: l.customPrice ? Number(l.customPrice) : undefined };
      }),
      tier: totals.tier,
      total: totals.total,
      totalWeight: totals.totalWeight,
      kilero,
      costsSnap,
      totalCost,
      profit,
    };
    setHistory(h => [entry, ...h]);
    showToast("Cotización guardada");
  };

  const loadQuote = (q) => {
    setClientName(q.client || "");
    setScheduler(q.scheduler || "");
    setAttendant(q.attendant || "");
    setConcretada(!!q.concretada);
    setLines(q.lines.map(l => ({
      id: uid(), category: l.category,
      grams: (l.category === INSUMO_KEY || l.category === LOTE_KEY) ? '' : String(l.grams),
      insumoName: l.insumoName || '',
      insumoCost: l.insumoCost ? String(l.insumoCost) : (l.insumoPrice ? String(l.insumoPrice) : ''),
      insumoQty: l.insumoQty ? String(l.insumoQty) : '1',
      loteName: l.loteName || '',
      loteGramsMap: l.loteGramsMap || {},
      lotePrice: l.lotePrice ? String(l.lotePrice) : '',
      customPrice: l.customPrice ? String(l.customPrice) : ''
    })));
    setTab('calc');
    showToast("Cotización cargada");
  };

  const toggleConcretada = (id) => {
    const quote = history.find(q => q.id === id);
    if (!quote) return;
    if (!quote.concretada) {
      if (!confirm(`¿Confirmar venta${quote.client ? ' de ' + quote.client : ''} por $${fmtCLP(quote.total)}?\n\nSe agregará a los reportes de ventas.`)) return;
      setHistory(h => h.map(q => q.id === id ? { ...q, concretada: true } : q));
      showToast("✅ Venta confirmada · Agregada a reportes");
    } else {
      if (!confirm('¿Quitar la confirmación de esta venta?\n\nSe eliminará de los reportes.')) return;
      setHistory(h => h.map(q => q.id === id ? { ...q, concretada: false } : q));
      showToast("Venta removida de reportes");
    }
  };

  const deleteQuote = (id) => setHistory(h => h.filter(q => q.id !== id));

  const shareQuote = async (q) => {
    const p = prices;
    const lines = q.lines.map(l => {
      if (l.category === INSUMO_KEY) return `• ${l.insumoName || 'Insumo'} 💎 — $${fmtCLP(l.insumoPrice || 0)}`;
      const cat = p[l.category];
      const price = cat ? cat.prices[q.tier] : 0;
      return `• ${cat ? cat.name : l.category} — ${l.grams}g × $${fmtCLP(price)} = $${fmtCLP(price * l.grams)}`;
    }).join('\n');
    const text =
`✨ Detalles De Venta${q.client ? ' · Venta de ' + q.client : ''}
${fmtDate(q.at)}

${lines}

Peso total: ${fmtCLP(q.totalWeight)}g
Total: $${fmtCLP(q.total)} CLP`;
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch(_){}
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("¡Mensaje copiado al portapapeles!");
    } catch(_){
      showToast("No se pudo compartir");
    }
  };

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;

  return (
    <div className="app">
      <header className="brand">
        <div className="mark" aria-hidden>◆</div>
        <div style={{flex:1}}>
          <h1>Joyería <em>Aravena</em></h1>
          <div className="sub">Ventas Presenciales</div>
        </div>
        <button className="icon-btn" onClick={()=>setThemeOpen(true)} aria-label="Cambiar tema" title="Cambiar tema" style={{marginRight:6}}>
          <span style={{fontSize:14,lineHeight:1}}>◐</span>
        </button>
        <button className="icon-btn" onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
          <Icon name="x" size={14}/>
        </button>
      </header>
      {themeOpen && (
        <ThemePicker
          theme={theme} setTheme={setTheme}
          customTheme={customTheme} setCustomTheme={setCustomTheme}
          onClose={()=>setThemeOpen(false)}
        />
      )}

      <nav className="tabs" role="tablist">
        <button className="tab" role="tab" aria-selected={tab==='calc'} onClick={()=>setTab('calc')}>
          <Icon name="calc" size={14}/> Venta
        </button>
        <button className="tab" role="tab" aria-selected={tab==='hist'} onClick={()=>setTab('hist')}>
          <Icon name="clock" size={14}/> Historial
        </button>
        <button className="tab" role="tab" aria-selected={tab==='reports'} onClick={()=>setTab('reports')}>
          <Icon name="share" size={14}/> Reportes
        </button>
        <button className="tab" role="tab" aria-selected={tab==='prices'} onClick={()=>setTab('prices')}>
          <Icon name="list" size={14}/> Precios
        </button>
      </nav>

      {tab === 'calc' && (
        <CalcTab
          clientName={clientName} setClientName={setClientName}
          pago={pago} setPago={setPago}
          scheduler={scheduler} setScheduler={setScheduler}
          attendant={attendant} setAttendant={setAttendant}
          concretada={concretada} setConcretada={setConcretada}
          lines={lines} prices={prices}
          addLine={addLine} removeLine={removeLine} updateLine={updateLine}
          totals={totals} resetCalc={resetCalc} saveQuote={saveQuote}
          copyMessage={copyMessage} canCopy={hasValidLines}
        />
      )}
      {tab === 'hist' && (
        <HistoryTab
          history={history} prices={prices}
          onDelete={deleteQuote} onDuplicate={loadQuote} onShare={shareQuote}
          onToggleConcretada={toggleConcretada}
        />
      )}
      {tab === 'reports' && (
        <ReportsTab history={history} prices={prices} onToggleConcretada={toggleConcretada} />
      )}
      {tab === 'prices' && (
        <PricesTab prices={prices} activeTier={totals.tier} />
      )}

      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>

      {tab === 'calc' && (
        <button className="fab" onClick={() => {
          const validLines = lines.filter(isValidLine);
          if (validLines.length === 0) return;
          const piezas = buildMessagePiezas(validLines, prices);
          const msg = `Pago: ${pago}\nAtención : ${attendant}\nAgenda : ${scheduler}\nNombre Cliente : ${clientName.trim()}\n\n${piezas}\n\nVenta: $${fmtCLP(totals.total)}`;
          navigator.clipboard.writeText(msg).then(
            () => showToast("¡Mensaje copiado!"),
            () => showToast("No se pudo copiar")
          );
        }} disabled={!hasValidLines}>
          <span className="ico">📋</span> Copiar mensaje
        </button>
      )}

      {editMode && <TweaksPanel prices={prices} setPrices={setPrices} onClose={()=>setEditMode(false)} />}
    </div>
  );
}