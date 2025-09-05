import { useSession, signOut } from "next-auth/react";
import { computeKPIs } from "../lib/kpis";
import seed from "./data/seed.json";
import KPI from "../components/KPI";
import ParlayTable from "../components/ParlayTable";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = (email) => `parlays:${email}`;

export default function Dashboard() {
  const { data } = useSession();
  const email = data?.user?.email || "";
  const [parlays, setParlays] = useState([]);

  useEffect(() => {
    if (!email) return;
    const demoSeedEmail = process.env.NEXT_PUBLIC_SEEDED_EMAIL || "you@example.com";
    if (email === demoSeedEmail) {
      setParlays(seed.parlays);
      try { localStorage.setItem(STORAGE_KEY(email), JSON.stringify(seed.parlays)); } catch {}
    } else {
      try {
        const raw = localStorage.getItem(STORAGE_KEY(email));
        setParlays(raw ? JSON.parse(raw) : []);
      } catch { setParlays([]); }
    }
  }, [email]);

  const k = useMemo(() => computeKPIs(parlays), [parlays]);

  const [form, setForm] = useState({ game:"", date:"", overall:"pending", notes:"", legsText:"" });
  function addParlay(){
    const legs = form.legsText.split("\n").map(line => {
      const [selection, resRaw] = line.split("|").map(s => (s||"").trim());
      const result = (resRaw || "pending").toLowerCase();
      return selection ? { selection, result } : null;
    }).filter(Boolean);
    const next = [{ id:`p_${Date.now()}`, game:form.game||"Unknown", date:form.date||new Date().toISOString().slice(0,10), legs, overall:form.overall, notes:form.notes||"" }, ...parlays];
    setParlays(next);
    try { localStorage.setItem(STORAGE_KEY(email), JSON.stringify(next)); } catch {}
    setForm({ game:"", date:"", overall:"pending", notes:"", legsText:"" });
  }

  return (
    <div>
      <aside className="sidebar">
        <div className="brand"><img src="/logo.svg" className="logo" alt="Lovett Parlay Tracker"/></div>
        <div style={{marginTop:16}}>
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">AI ParlayBot</div>
          <div className="nav-item">Trends</div>
          <div className="nav-item">Settings</div>
        </div>
      </aside>

      <main className="main">
        <div className="container">
          <div className="header">
            <div className="brand"><h1>Dashboard</h1></div>
            <div className="flex">
              <div className="badge">Signed in as {email}</div>
              <button className="btn" onClick={()=>signOut({ callbackUrl: "/api/auth/signin" })}>Sign out</button>
            </div>
          </div>

          <div className="kpi-row">
            <KPI label="Parlays Logged" value={k.total}/>
            <KPI label="Parlay Hit %" value={k.hitRate + '%'} />
            <KPI label="Leg Hit %" value={k.legHit + '%'} />
            <KPI label="Record" value={k.wins + '-' + k.losses + (k.pushes?('-'+k.pushes):'')} />
          </div>

          <ParlayTable parlays={parlays} />

          <div className="card" style={{marginTop:12}}>
            <h3 style={{margin:'0 0 10px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.1em'}}>Add Parlay (this user only)</h3>
            <div className="flex" style={{flexWrap:'wrap', gap:12}}>
              <input placeholder="Game" value={form.game} onChange={e=>setForm({...form, game:e.target.value})}
                     style={{flex:'1 1 240px', background:'#0f0f14', color:'var(--fg)', border:'1px solid #262634', borderRadius:8, padding:'10px 12px'}}/>
              <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}
                     style={{width:180, background:'#0f0f14', color:'var(--fg)', border:'1px solid #262634', borderRadius:8, padding:'10px 12px'}}/>
              <select value={form.overall} onChange={e=>setForm({...form, overall:e.target.value})}
                      style={{width:160, background:'#0f0f14', color:'var(--fg)', border:'1px solid #262634', borderRadius:8, padding:'10px 12px'}}>
                <option value="pending">pending</option>
                <option value="win">win</option>
                <option value="lose">lose</option>
                <option value="push">push</option>
              </select>
            </div>
            <textarea placeholder={'Legs (one per line):\nCeeDee Lamb o100.5 | win\nJalen Hurts rush o39.5 | lose'}
                      value={form.legsText} onChange={e=>setForm({...form, legsText:e.target.value})} rows={5}
                      style={{width:'100%', marginTop:12, background:'#0f0f14', color:'var(--fg)', border:'1px solid #262634', borderRadius:8, padding:'10px 12px'}}/>
            <input placeholder="Notes (optional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}
                   style={{width:'100%', marginTop:12, background:'#0f0f14', color:'var(--fg)', border:'1px solid #262634', borderRadius:8, padding:'10px 12px'}}/>
            <div className="flex" style={{marginTop:12}}>
              <button className="btn" onClick={addParlay}>Add Parlay</button>
            </div>
          </div>

          <div className="footer">© {new Date().getFullYear()} Lovett Parlay Tracker — Personal Dashboards</div>
        </div>
      </main>
    </div>
  );
}

// ✅ SERVER-SIDE AUTH GUARD
export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("./api/auth/[...nextauth]");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/dashboard")}`,
        permanent: false
      }
    };
  }
  return { props: {} };
}
