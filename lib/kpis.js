export function computeKPIs(parlays) {
  const total = parlays.length;
  const wins = parlays.filter(p => p.overall === 'win').length;
  const losses = parlays.filter(p => p.overall === 'lose').length;
  const pushes = parlays.filter(p => p.overall === 'push').length;
  const legs = parlays.reduce((a, p) => a + p.legs.length, 0);
  const legWins = parlays.reduce((a, p) => a + p.legs.filter(l => l.result === 'win').length, 0);
  const hitRate = total ? (wins / total) * 100 : 0;
  const legHit = legs ? (legWins / legs) * 100 : 0;
  return { total, wins, losses, pushes, hitRate: +hitRate.toFixed(1), legHit: +legHit.toFixed(1) };
}
