import { computeKPIs } from '../lib/kpis';
import seed from './data/seed.json';
import KPI from '../components/KPI';
import ParlayTable from '../components/ParlayTable';

export default function Home(){
  const parlays = seed.parlays;
  const k = computeKPIs(parlays);

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
          </div>

          <div className="kpi-row">
            <KPI label="Parlays Logged" value={k.total}/>
            <KPI label="Parlay Hit %" value={k.hitRate + '%'} />
            <KPI label="Leg Hit %" value={k.legHit + '%'} />
            <KPI label="Record" value={k.wins + '-' + k.losses + (k.pushes?('-'+k.pushes):'')} />
          </div>

          <ParlayTable parlays={parlays}/>

          <div className="footer">© {new Date().getFullYear()} Lovett Parlay Tracker — Login Demo</div>
        </div>
      </main>
    </div>
  );
}
