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
  const BASE_COST = 1000; // Costo base fijo por bolsas/insumos
  let tCost = BASE_COST;
  const LOTE_CAT_MAP = {
    cadena:   'collar_pulsera_mujer_925',
    micro:    'collar_pulsera_micro',
    italiana: 'italiana_925',
    gf18k:    'gf_18k',
  };
  for (const l of (quote.lines || [])) {
    if (l.category === INSUMO_KEY) {
      const cost = Number(l.insumoCost) || Number(l.insumoPrice) || 0;
      const qty  = Number(l.insumoQty)  || 1;
      tCost += cost * qty;
      continue;
    }
    if (l.category === LOTE_KEY) {
      const gramsMap = l.loteGramsMap || {};
      for (const [typeKey, catKey] of Object.entries(LOTE_CAT_MAP)) {
        const g = Number(gramsMap[typeKey]) || 0;
        if (g > 0) {
          const snap = quote.costsSnap && quote.costsSnap[catKey];
          const c = (typeof snap === 'number') ? snap : (Number(prices?.[catKey]?.cost) || 0);
          tCost += c * g;
        }
      }
      continue;
    }
    const g = Number(l.grams) || 0;
    const snap = quote.costsSnap && quote.costsSnap[l.category];
    const c = (typeof snap === 'number') ? snap : (Number(prices?.[l.category]?.cost) || 0);
    tCost += c * g;
  }
  const profit = (Number(quote.total) || 0) - tCost;
  return { totalCost: tCost, profit };
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