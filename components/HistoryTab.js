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
                      ? <>{l.insumoName || 'Insumo'} 💎 <span style={{fontStyle:'normal',fontFamily:'var(--mono)',fontSize:11}}>${fmtCLP((l.insumoValor !== undefined && l.insumoValor !== null) ? (Number(l.insumoValor) * (Number(l.insumoQty)||1)) : (l.insumoPrice || 0))}</span></>
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