require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// 1. Configuración
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const CR7_PLAYER_ID = '874';

async function obtenerComentarioIA(goles) {
  console.log("🧠 Consultando al Cerebro IA para noticia detallada...");
  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "google/gemini-2.0-flash-001",
      messages: [{ 
        role: "system", 
        content: "Eres el analista oficial de CR7. Responde SOLO en JSON con este formato: { \"titular\": \"...\", \"resumen\": \"...\", \"imagen_url\": \"...\" }. El resumen debe ser motivador. Inventa una imagen_url de placeholder deportiva si no tienes una." 
      }, { 
        role: "user", 
        content: `Cristiano tiene ${goles} goles. Genera la noticia.` 
      }]
    }, {
      headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json" }
    });
    
    // Intentar parsear el JSON de la IA
    const content = response.data.choices[0].message.content;
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    return JSON.parse(content.substring(jsonStart, jsonEnd));
  } catch (e) {
    return {
      titular: `CR7 alcanza los ${goles} goles`,
      resumen: "El camino a los 1000 sigue firme. Cristiano Ronaldo no se detiene y continúa sumando récords.",
      imagen_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop"
    };
  }
}

async function runSync() {
  console.log("🔍 Iniciando rastreo inteligente avanzado...");
  
  try {
    // A. Obtener goles de la temporada actual
    const statsResp = await axios.get(`https://v3.football.api-sports.io/players?id=${CR7_PLAYER_ID}&season=2024`, {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });

    let golesTemporada = 0;
    if (statsResp.data.response.length > 0) {
      statsResp.data.response[0].statistics.forEach(s => golesTemporada += (s.goals.total || 0));
    }

    const totalGlobal = 970 + golesTemporada;
    console.log(`⚽ Total calculado: ${totalGlobal} goles.`);

    // B. Generar noticia con IA Detallada
    const noticiaIA = await obtenerComentarioIA(totalGlobal);

    // C. Actualizar Estadísticas
    await supabase.from('estadisticas_globales').update({ 
      total_goles: totalGlobal, 
      ultima_actualizacion: new Date() 
    }).eq('id', 1);
    
    // D. Insertar Noticia Completa
    await supabase.from('noticias').insert([{ 
      titular: noticiaIA.titular, 
      contenido: noticiaIA.resumen,
      imagen_url: noticiaIA.imagen_url,
      fuente: 'CR7 AI Brain', 
      fecha_publicacion: new Date() 
    }]);

    console.log("✅ Sincronización avanzada completada.");
  } catch (err) {
    console.error("❌ Error en sync:", err.message);
  }
}

runSync();
