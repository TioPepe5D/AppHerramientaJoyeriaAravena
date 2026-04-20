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