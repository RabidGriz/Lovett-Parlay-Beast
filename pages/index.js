export default function Home() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
      <h1 style={{margin:0}}>Lovett Parlay Tracker</h1>
      <p style={{opacity:.8}}>Clean deploy test page</p>
      <a href="/api/hello" style={{marginTop:12, padding:'10px 14px', background:'#7fffb0', color:'#0b0b0e', borderRadius:8, fontWeight:800}}>
        Test API
      </a>
    </div>
  );
}
