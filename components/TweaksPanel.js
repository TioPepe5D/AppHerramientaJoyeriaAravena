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