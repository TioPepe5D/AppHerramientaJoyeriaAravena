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