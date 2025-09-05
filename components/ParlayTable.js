export default function ParlayTable({ parlays }) {
  return (
    <div className="card">
      <h3 style={{margin:'0 0 10px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.1em'}}>Parlay Log</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th><th>Game</th><th>Legs</th><th>Overall</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {parlays.map(p => (
            <tr key={p.id}>
              <td>{p.date}</td>
              <td>{p.game}</td>
              <td>
                <div style={{display:'flex', flexDirection:'column', gap:6}}>
                  {p.legs.map((l, i) => (
                    <span key={i} className={'badge ' + (l.result==='win'?'win': l.result==='lose'?'lose':'')}>
                      {l.selection} — {l.result.toUpperCase()}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <span className={'badge ' + (p.overall==='win'?'win': p.overall==='lose'?'lose':'') }>
                  {p.overall.toUpperCase()}
                </span>
              </td>
              <td>{p.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
