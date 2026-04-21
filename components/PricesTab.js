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
            <li><span className="t">T-III</span><span>Peso supera 499g</span></li>
            <li><span className="t">T-IV</span><span>Peso supera 999g</span></li>
          </ul>
        </div>
      </div>

      <div className="flourish" style={{margin:'26px 0 0'}}>
        <span>Tarifa vigente · por gramo</span>
      </div>
    </div>
  );
}