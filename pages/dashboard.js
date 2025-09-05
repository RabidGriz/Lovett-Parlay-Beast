import { useSession, signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { computeKPIs } from "../lib/kpis";
import seed from "./data/seed.json";
import KPI from "../components/KPI";
import ParlayTable from "../components/ParlayTable";

const STORAGE_KEY = (email) => `parlays:${email}`;

export default function Dashboard() {
  const { status, data } = useSession();
  const email = data?.user?.email || "";

  // Local state for this user's parlays
  const [parlays, setParlays] = useState([]);

  // Load data on mount/user change
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      // If somehow unauthenticated on this page, send them to sign-in
      window.location.href = "/api/auth/signin";
      return;
    }
    if (!email) return;

    // DEMO_USER gets seeded data; DEMO2_USER starts empty (or what's in localStorage)
    const demo1 = process.env.NEXT_PUBLIC_DEMO_USER || process.env.DEMO_USER; // optional
    const isDemo1 = false; // we’ll just detect by matching env in UI; not reliable at runtime on Vercel edge
    // Simpler: attach seed to whichever user matches your configured DEMO_USER
    const demoEmail = process.env.NEXT_PUBLIC_SEEDED_EMAIL || "you@example.com";

    if (email === demoEmail) {
      setParlays(seed.parlays);
      // also mirror to localStorage so edits persist locally
      try { localStorage.setItem(STORAGE_KEY(email), JSON.stringify(seed.parlays)); } catch {}
    } else {
      // Load from localStorage for this user
      try {
        const raw = localStorage.getItem(STORAGE_KEY(email));
        setParlays(raw ? JSON.parse(raw) : []);
      } catch { setParlays([]); }
    }
  }, [status, email]);

  // Compute KPIs
  const k = useMemo(() => computeKPIs(parlays), [parlays]);

  // Simple "Add Parlay" form (adds to this user's storage only)
  const [form, setForm] = useState({
    game: "", date: "", overall: "pending", notes: "",
    legsText: "" // one per line: "Selection | win/lose/pending"
  });

  function addParlay() {
    if (!email) return;
    const legs = form.legsText.split("\n").map(line => {
      const [selection, resRaw] = line.split("|").map(s => (s||"").trim());
      const result = (resRaw || "pending").toLowerCase();
      return { selection, result };
    }).filter(l => l.selection);

    const newParlay = {
      id: `p_${Date.now()}`,
      game: form.game || "Unknown",
      date: form.date || new Date().toISOString().slice(0,10),
      legs,
      overall: form.overall,
      notes: form.notes || ""
    };

    const next = [newParlay, ...parlays];
    setParlays(next);
    try { localStorage.setItem(STORAGE_KEY(email), JSON.stringify(next)); } catch {}
    setForm({ game:"", date:"", overall:"pending", notes:"", legsText:"" });
  }

  if (status === "loading") {
    return <div style={{padding:24}}>Loading…</div>;
  }

  return (
    <div>
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo.svg" className="logo" alt="Lovett Parlay Tracker"/>
        </div>
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
              <input placeholder="Game (e.g., Chargers vs Chiefs)" value={form.game} onChange={e=>setForm({...form, game:e.target.value})}
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

            <textarea
              placeholder={'Legs (one per line):\nCeeDee Lamb o100.5 | win\nJalen Hurts rush o39.5 | lose'}
              value={form.legsText}
              onChange={e=>setForm({...form, legsText:e.target.value})}
              rows={5}
              style={{width:'100%', marginTop:12, background:'#0f0f14', color:'var(--fg)', border:'1px solid #262634', borderRadius:8, padding:'10px 12px'}}
            />
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
