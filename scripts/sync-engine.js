require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// 1. Configuración
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const CR7_PLAYER_ID = '874';

async function obtenerComentarioIA(goles) {
  console.log("🧠 Consultando al Cerebro IA...");
  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "google/gemini-2.0-flash-001", // Modelo rápido y eficiente
      messages: [{ 
        role: "system", 
        content: "Eres el analista oficial de Cristiano Ronaldo. Genera un titular corto y motivador sobre su progreso a los 1000 goles." 
      }, { 
        role: "user", 
        content: `Cristiano ahora tiene ${goles} goles. Genera una noticia corta.` 
      }]
    }, {
      headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json" }
    });
    return response.data.choices[0].message.content;
  } catch (e) {
    return `CR7 sigue imparable con ${goles} goles en su cuenta.`;
  }
}

async function runSync() {
  console.log("🔍 Iniciando rastreo inteligente...");
  
  try {
    // A. Obtener goles de la temporada actual
    const statsResp = await axios.get(`https://v3.football.api-sports.io/players?id=${CR7_PLAYER_ID}&season=2024`, {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });

    let golesTemporada = 0;
    if (statsResp.data.response.length > 0) {
      statsResp.data.response[0].statistics.forEach(s => golesTemporada += (s.goals.total || 0));
    }

    // B. Calcular total (Base real 970 + goles temporada actual)
    const totalGlobal = 970 + golesTemporada;
    console.log(`⚽ Total calculado: ${totalGlobal} goles.`);

    // C. Generar noticia con IA
    const comentario = await obtenerComentarioIA(totalGlobal);

    // D. Actualizar Supabase
    await supabase.from('estadisticas_globales').update({ total_goles: totalGlobal, ultima_actualizacion: new Date() }).eq('id', 1);
    
    // Guardar noticia de la IA
    await supabase.from('noticias').insert([{ titular: comentario, fuente: 'CR7 AI Brain', fecha_publicacion: new Date() }]);

    console.log("✅ Sincronización e IA completadas.");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

runSync();
