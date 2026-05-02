import styles from "./page.module.css";
import cr7Data from "@/data/cr7-stats.json";

export default function Home() {
  const percentage = (cr7Data.totalGoals / 1000) * 100;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Cristiano Ronaldo",
    "jobTitle": "Professional Footballer",
    "stats": {
      "totalGoals": cr7Data.totalGoals,
      "roadTo1000": 1000 - cr7Data.totalGoals
    }
  };

  return (
    <main className="premium-gradient" style={{ minHeight: '100vh', padding: '2rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="gold-text" style={{ fontSize: '4rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>CR7 TRACKER</h1>
          <p style={{ opacity: 0.7, fontSize: '1.2rem', letterSpacing: '2px' }}>THE ROAD TO 1000 GOALS</p>
        </header>

        {/* Main Counter */}
        <section className="glass-card animate-pulse-gold" style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px', fontSize: '0.8rem', opacity: 0.5 }}>LIVE STATS</div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.6, letterSpacing: '3px' }}>GOLES OFICIALES</h2>
          <div className="gold-text" style={{ fontSize: '10rem', lineHeight: 1, fontWeight: 900 }}>{cr7Data.totalGoals}</div>
          <div style={{ fontSize: '1.8rem', marginTop: '-15px', opacity: 0.4 }}>CAREER GOALS</div>
          
          <div className="progress-bar-container" style={{ marginTop: '3rem', height: '20px' }}>
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold', opacity: 0.8 }}>
            <span>97.0% COMPLETADO</span>
            <span>FALTAN {1000 - cr7Data.totalGoals} GOLES</span>
          </div>
        </section>

        <div className="stats-grid">
          {/* Health & Discipline */}
          <section className="glass-card">
            <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', marginRight: '10px' }}>🧠</span> MENTALIDAD & DISCIPLINA
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {cr7Data.healthTips.map((tip, i) => (
                <div key={i} style={{ padding: '15px', background: 'rgba(255,204,0,0.05)', borderLeft: '3px solid var(--cr7-gold)', borderRadius: '4px' }}>
                  {tip}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.6, fontStyle: 'italic' }}>
              "La disciplina es hacer lo que hay que hacer, incluso cuando no tienes ganas."
            </p>
          </section>

          {/* Goals by Team */}
          <section className="glass-card">
            <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', marginRight: '10px' }}>⚽</span> GOLES POR EQUIPO
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(cr7Data.goalsByTeam).sort((a, b) => b[1] - a[1]).map(([team, goals]) => (
                <div key={team} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '8px', height: '8px', background: 'var(--cr7-gold)', borderRadius: '50%', marginRight: '10px' }}></div>
                     <span>{team}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: 'var(--cr7-gold)', fontSize: '1.2rem' }}>{goals}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Match Hub */}
          <section className="glass-card">
            <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', marginRight: '10px' }}>🏟️</span> PARTIDO EN VIVO / PRÓXIMO
            </h3>
            <div style={{ padding: '2rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', padding: '4px 12px', background: '#ffcc00', color: '#000', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '1rem' }}>UPCOMING</div>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>vs {cr7Data.nextMatch.opponent}</p>
              <p style={{ opacity: 0.6 }}>{cr7Data.nextMatch.competition}</p>
              <div style={{ margin: '1.5rem 0', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <p style={{ fontSize: '0.9rem' }}>
                {new Date(cr7Data.nextMatch.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <button style={{ marginTop: '1.5rem', padding: '10px 20px', background: 'transparent', border: '1px solid var(--cr7-gold)', color: 'var(--cr7-gold)', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>
                NOTIFICARME
              </button>
            </div>
          </section>
        </div>

        <footer style={{ marginTop: '5rem', padding: '3rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ margin: '0 10px' }}>ESTADÍSTICAS</span>
            <span style={{ margin: '0 10px' }}>BIO</span>
            <span style={{ margin: '0 10px' }}>EQUIPOS</span>
            <span style={{ margin: '0 10px' }}>NOTICIAS</span>
          </div>
          <p>© 2026 CR7 Tracker. Desarrollado para fans. Datos sincronizados vía API-Football.</p>
        </footer>
      </div>
    </main>
  );
}
