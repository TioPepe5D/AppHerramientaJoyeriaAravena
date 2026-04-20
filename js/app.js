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