import styles from "./page.module.css";
import cr7Data from "@/data/cr7-stats.json";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidar cada minuto

async function getStats() {
  try {
    const { data, error } = await supabase
      .from('estadisticas_globales')
      .select('total_goles, meta_goles')
      .single();
    
    if (error) throw error;
    return data;
  } catch (e) {
    return { total_goles: cr7Data.totalGoals, meta_goles: 1000 };
  }
}

async function getNews() {
  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('titular, contenido, imagen_url')
      .order('fecha_publicacion', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return data[0];
  } catch (e) {
    return null;
  }
}

async function getHistoricalGoals() {
  try {
    const { data, error } = await supabase
      .from('goles_historicos')
      .select('*')
      .order('numero_gol', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const stats = await getStats();
  const news = await getNews();
  const history = await getHistoricalGoals();
  
  const totalGoals = stats.total_goles || cr7Data.totalGoals;
  const metaGoles = stats.meta_goles || 1000;
  const percentage = (totalGoals / metaGoles) * 100;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Cristiano Ronaldo",
    "jobTitle": "Professional Footballer",
    "stats": {
      "totalGoals": totalGoals,
      "roadTo1000": metaGoles - totalGoals
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
          <p style={{ opacity: 0.7, fontSize: '1.2rem', letterSpacing: '2px' }}>THE ROAD TO {metaGoles} GOALS</p>
        </header>

        {/* Main Counter */}
        <section className="glass-card" style={{ textAlign: 'center', marginBottom: '3rem', padding: '3rem' }}>
          <div style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '1rem' }}>CONTADOR TOTAL</div>
          <div className="gold-text" style={{ fontSize: '8rem', lineHeight: '1', marginBottom: '1rem' }}>{totalGoals}</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>{totalGoals} GOLES</span>
            <span style={{ color: 'var(--cr7-gold)' }}>OBJETIVO: {metaGoles}</span>
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

          {/* News Hub (AI) */}
          <section className="glass-card">
            <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', marginRight: '10px' }}>📰</span> ÚLTIMA HORA (IA)
            </h3>
            {news ? (
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>{news.titular}</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6', marginBottom: '1rem' }}>{news.contenido}</p>
                {news.imagen_url && (
                  <img src={news.imagen_url} alt="CR7 News" style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(255,204,0,0.2)' }} />
                )}
              </div>
            ) : (
              <p style={{ opacity: 0.5 }}>Cargando últimas noticias del astro...</p>
            )}
          </section>

          {/* Historical Goals Section */}
          <section className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', marginRight: '10px' }}>📜</span> HITOS HACIA LOS 1000
            </h3>
            <div id="historial-goles" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {history.length > 0 ? history.map((hito) => (
                <div key={hito.numero_gol} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: `4px solid ${hito.es_hito ? '#ffd700' : '#888'}` }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: hito.es_hito ? '#ffd700' : '#fff' }}>#{hito.numero_gol}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{hito.descripcion || `Gol en ${hito.competicion || 'partido oficial'}`}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '5px' }}>{hito.fecha}</div>
                </div>
              )) : (
                <p style={{ opacity: 0.5 }}>No hay hitos registrados aún.</p>
              )}
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

