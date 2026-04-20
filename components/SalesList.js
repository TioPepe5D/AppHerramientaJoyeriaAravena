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
                      const descs = l.loteDescs || {};
                      return (
                        <div key={i} style={{padding:'4px 0',fontSize:13,color:'var(--ink-dim)'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                            <span>📦 Lote{l.loteGrams ? ` · ${l.loteGrams}g` : ''}</span>
                            <span style={{fontFamily:'var(--mono)',fontWeight:600,color:'var(--ink)'}}>${fmtCLP(l.lotePrice || 0)}</span>
                          </div>
                          {LOTE_TYPES.filter(t => descs[t.key]).map(t => (
                            <div key={t.key} style={{fontSize:11,color:'var(--ink-mute)',paddingLeft:8}}>{t.emoji} {t.label}: {descs[t.key]}</div>
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