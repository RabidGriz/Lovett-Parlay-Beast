export default function KPI({ label, value }) {
  return (
    <div className="card">
      <h3 style={{margin:'0 0 10px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.1em'}}>{label}</h3>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
