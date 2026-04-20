// ---------- Lógica de negocio ----------
// Kilero se activa automáticamente en tramos basados en peso (T-III desde 500g).
const isKileroTier = (tier) => tier >= 3;
const effectiveCost = (cat, tier) => {
  if (!cat) return 0;
  const n = isKileroTier(tier) ? Number(cat.costKilero) : Number(cat.cost);
  return isFinite(n) ? n : (Number(cat.cost) || 0);
};
const EMPRESA = "Diego";
const PCT_SCHEDULER = 0.35;
const PCT_ATTENDANT = 0.35;
const PCT_EMPRESA   = 0.30;

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