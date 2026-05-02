require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// 1. Configuración de Clientes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY; 
const CR7_PLAYER_ID = '874'; // ID de Cristiano en API-Football

async function syncCR7Stats() {
  console.log("🔍 Buscando actualizaciones de CR7...");

  if (!API_FOOTBALL_KEY || API_FOOTBALL_KEY === 'TU_LLAVE_AQUI') {
    console.error("❌ Falta la API_FOOTBALL_KEY en .env.local. Consíguela en RapidAPI.");
    return;
  }

  try {
    // A. Obtener estadísticas de la temporada (Goles)
    const statsResp = await axios.get(`https://v3.football.api-sports.io/players?id=${CR7_PLAYER_ID}&season=2024`, {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });

    if (statsResp.data.response.length > 0) {
      const stats = statsResp.data.response[0].statistics;
      let totalGolesTemporada = 0;
      stats.forEach(s => totalGolesTemporada += (s.goals.total || 0));

      // Actualizar contador global (Base histórica 900 + goles nuevos)
      const totalGlobal = 900 + totalGolesTemporada;
      
      await supabase
        .from('estadisticas_globales')
        .update({ total_goles: totalGlobal, ultima_actualizacion: new Date() })
        .eq('id', 1);

      console.log(`⚽ Goles actualizados: ${totalGlobal}`);
    }

    // B. Obtener Partidos (Próximos y Recientes)
    console.log("📅 Buscando próximos partidos...");
    const fixturesResp = await axios.get(`https://v3.football.api-sports.io/fixtures?player=${CR7_PLAYER_ID}&next=5`, {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });

    const matches = fixturesResp.data.response.map(f => ({
      rival: f.teams.home.name === 'Al Nassr' ? f.teams.away.name : f.teams.home.name,
      fecha: f.fixture.date,
      competicion: f.league.name,
      estado: 'programado',
      marcador: '0 - 0'
    }));

    if (matches.length > 0) {
      // Limpiar y subir partidos nuevos
      await supabase.from('partidos').delete().neq('id', 0); 
      await supabase.from('partidos').insert(matches);
      console.log(`✅ ${matches.length} próximos partidos guardados.`);
    } else {
      console.log("ℹ️ No se encontraron partidos próximos.");
    }

    console.log("✅ Partidos y estadísticas sincronizados correctamente.");

  } catch (error) {
    console.error("❌ Error en el rastreo:", error.message);
  }
}

syncCR7Stats();
