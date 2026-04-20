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