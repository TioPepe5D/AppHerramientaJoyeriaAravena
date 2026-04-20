// ---------- Login Firebase ----------
function LoginScreen({ onAuth }){
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !pwd) { setErr("Completa todos los campos"); return; }
    setLoading(true); setErr("");
    try {
      const cred = await window.__FB.signIn(email.trim().toLowerCase(), pwd);
      const profile = await window.__FB.getUserProfile(cred.user.uid);
      if (!profile) {
        await window.__FB.saveUserProfile(cred.user.uid, {
          uid: cred.user.uid, email: cred.user.email,
          name: email.split("@")[0],
          role: cred.user.email === window.__FB.ADMIN_EMAIL ? "admin" : "user",
          createdAt: Date.now()
        });
      }
      onAuth(cred.user);
    } catch(e) {
      const msgs = {
        "auth/invalid-credential":  "Email o contraseña incorrectos",
        "auth/user-not-found":      "Usuario no encontrado",
        "auth/wrong-password":      "Contraseña incorrecta",
        "auth/invalid-email":       "Email inválido",
        "auth/too-many-requests":   "Demasiados intentos. Espera unos minutos.",
      };
      setErr(msgs[e.code] || "Error al iniciar sesión");
    } finally { setLoading(false); }
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
          <span className="eyebrow">Ingresa tus credenciales</span>
        </div>
        <form onSubmit={submit} className="client" style={{padding:"18px 16px 20px"}}>
          <div className="control-labeled">
            <label>Email</label>
            <div className="control">
              <input type="email" autoFocus value={email}
                onChange={e => { setEmail(e.target.value); setErr(""); }}
                placeholder="tu@email.com" autoComplete="email" />
            </div>
          </div>
          <div className="control-labeled">
            <label>Contraseña</label>
            <div className="control" style={err ? {borderColor:"var(--danger)"} : null}>
              <input type="password" value={pwd}
                onChange={e => { setPwd(e.target.value); setErr(""); }}
                placeholder="••••••••" autoComplete="current-password" />
            </div>
            {err && <span style={{color:"var(--danger)",fontSize:12,marginTop:4,fontFamily:"var(--mono)"}}>{err}</span>}
          </div>
          <div className="actions" style={{marginTop:16}}>
            <button type="submit" className="btn accent" style={{flex:1}} disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Admin Panel ----------
function AdminPanel({ currentUser, onClose }){
  const [users, setUsers]         = useState([]);
  const [allQuotes, setAllQuotes] = useState([]);
  const [newEmail, setNewEmail]   = useState("");
  const [newPwd, setNewPwd]       = useState("");
  const [newName, setNewName]     = useState("");
  const [newRole, setNewRole]     = useState("user");
  const [creating, setCreating]   = useState(false);
  const [err, setErr]             = useState("");
  const [adminTab, setAdminTab]   = useState("users");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    window.__FB.getUsers().then(u => { setUsers(u); setLoading(false); });
    const unsub = window.__FB.listenAllQuotes(q => setAllQuotes(q));
    return () => unsub();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPwd || !newName) { setErr("Completa todos los campos"); return; }
    setCreating(true); setErr("");
    try {
      const cred = await window.__FB.createUser(newEmail.trim().toLowerCase(), newPwd);
      const profile = { uid: cred.user.uid, email: cred.user.email, name: newName.trim(), role: newRole, createdAt: Date.now() };
      await window.__FB.saveUserProfile(cred.user.uid, profile);
      setUsers(u => [...u, profile]);
      setNewEmail(""); setNewPwd(""); setNewName(""); setNewRole("user");
    } catch(e) {
      const msgs = {
        "auth/email-already-in-use": "Este email ya está registrado",
        "auth/weak-password":        "Contraseña de al menos 6 caracteres",
        "auth/invalid-email":        "Email inválido",
      };
      setErr(msgs[e.code] || e.message);
    } finally { setCreating(false); }
  };

  const deleteUser = async (uid, name) => {
    if (!confirm(`¿Eliminar a ${name}? Solo se elimina su perfil.`)) return;
    await window.__FB.deleteUserProfile(uid);
    setUsers(u => u.filter(x => x.uid !== uid));
  };

  const statsByUser = useMemo(() => {
    const map = {};
    for (const q of allQuotes) {
      if (!q.userId) continue;
      map[q.userId] = map[q.userId] || { count: 0, total: 0 };
      map[q.userId].count++;
      if (q.concretada) map[q.userId].total += Number(q.total) || 0;
    }
    return map;
  }, [allQuotes]);

  const totalGlobal = allQuotes.filter(q=>q.concretada).reduce((s,q)=>s+(Number(q.total)||0),0);

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)',zIndex:9100,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'20px 12px',overflowY:'auto'}}>
      <div style={{width:'100%',maxWidth:480,background:'var(--panel)',border:'1px solid var(--line-2)',borderRadius:14,boxShadow:'0 30px 60px -20px rgba(0,0,0,.9)',marginBottom:20}}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,letterSpacing:'.04em'}}>👑 Panel de Admin</div>
            <div style={{fontFamily:'var(--mono)',fontSize:9,letterSpacing:'.2em',color:'var(--ink-mute)',textTransform:'uppercase',marginTop:2}}>Solo visible para administradores</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{display:'flex',gap:2,padding:'10px 12px 0',borderBottom:'1px solid var(--line)'}}>
          {[['users','👥 Usuarios'],['stats','📊 Resumen']].map(([id,lbl]) => (
            <button key={id} onClick={()=>setAdminTab(id)}
              style={{padding:'8px 14px',borderRadius:'8px 8px 0 0',border:'1px solid var(--line)',borderBottom:'none',fontSize:12,fontWeight:600,
                background:adminTab===id?'var(--panel-2)':'transparent',
                color:adminTab===id?'var(--gold-2)':'var(--ink-mute)',cursor:'pointer'}}>
              {lbl}
            </button>
          ))}
        </div>
        <div style={{padding:'14px 16px 20px'}}>
          {adminTab === 'users' && (
            <>
              <div style={{marginBottom:16}}>
                <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.2em',color:'var(--ink-mute)',textTransform:'uppercase',marginBottom:10}}>Usuarios registrados ({users.length})</div>
                {loading ? <div style={{color:'var(--ink-mute)',fontSize:13,padding:'10px 0'}}>Cargando…</div>
                  : users.map(u => (
                  <div key={u.uid} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'var(--bg-2)',border:'1px solid var(--line)',borderRadius:10,marginBottom:6}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14}}>{u.name}</div>
                      <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--ink-mute)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.email}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                      <span style={{fontFamily:'var(--mono)',fontSize:10,padding:'2px 8px',border:'1px solid',borderRadius:999,
                        color:u.role==='admin'?'var(--gold-2)':'var(--ink-mute)',
                        borderColor:u.role==='admin'?'rgba(var(--accent-rgb),.4)':'var(--line)'}}>
                        {u.role}
                      </span>
                      {u.uid !== currentUser.uid && (
                        <button className="icon-btn danger" style={{width:32,height:32}} onClick={()=>deleteUser(u.uid,u.name)}>
                          <Icon name="trash" size={12}/>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{borderTop:'1px solid var(--line)',paddingTop:14}}>
                <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.2em',color:'var(--gold-2)',textTransform:'uppercase',marginBottom:12}}>➕ Crear nuevo usuario</div>
                <form onSubmit={createUser} style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div className="control-labeled">
                    <label>Nombre</label>
                    <div className="control"><input type="text" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Ej. Valentina"/></div>
                  </div>
                  <div className="control-labeled">
                    <label>Email</label>
                    <div className="control"><input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="usuario@email.com"/></div>
                  </div>
                  <div className="control-labeled">
                    <label>Contraseña temporal</label>
                    <div className="control"><input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="Mínimo 6 caracteres"/></div>
                  </div>
                  <div className="control-labeled">
                    <label>Rol</label>
                    <div className="control">
                      <select value={newRole} onChange={e=>setNewRole(e.target.value)}>
                        <option value="user">Usuario</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  {err && <span style={{color:'var(--danger)',fontSize:12,fontFamily:'var(--mono)'}}>{err}</span>}
                  <button type="submit" className="btn primary" disabled={creating}>{creating?'Creando…':'Crear usuario'}</button>
                </form>
              </div>
            </>
          )}
          {adminTab === 'stats' && (
            <>
              <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.2em',color:'var(--ink-mute)',textTransform:'uppercase',marginBottom:12}}>Actividad por usuario</div>
              {users.map(u => {
                const s = statsByUser[u.uid] || { count: 0, total: 0 };
                return (
                  <div key={u.uid} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,padding:'10px 12px',background:'var(--bg-2)',border:'1px solid var(--line)',borderRadius:10,marginBottom:6}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:14}}>{u.name}</div>
                      <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-mute)',marginTop:3}}>{s.count} cotización{s.count===1?'':'es'}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:700,fontSize:15,color:'var(--gold-2)'}}>${fmtCLP(s.total)}</div>
                      <div style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--ink-mute)',marginTop:2,letterSpacing:'.1em'}}>VENTAS</div>
                    </div>
                  </div>
                );
              })}
              <div style={{borderTop:'1px solid var(--line)',marginTop:14,paddingTop:14,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--ink-mute)',textTransform:'uppercase',letterSpacing:'.15em'}}>Total global</span>
                <span style={{fontWeight:700,fontSize:22,color:'var(--gold-2)'}}>${fmtCLP(totalGlobal)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
