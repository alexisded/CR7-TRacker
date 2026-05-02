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
    // A. Leer el valor actual de Supabase (nunca podemos bajar de este número)
    const { data: statsActuales } = await supabase
      .from('estadisticas_globales')
      .select('total_goles')
      .eq('id', 1)
      .single();
    
    const golesBase = statsActuales?.total_goles || 970;
    console.log(`📊 Base actual en Supabase: ${golesBase} goles.`);

    // B. Intentar obtener goles de la API de fútbol (temporadas recientes)
    const seasons = ['2024', '2025', '2026'];
    let golesTotalesRecientes = 0;

    for (const season of seasons) {
      try {
        const statsResp = await axios.get(`https://v3.football.api-sports.io/players?id=${CR7_PLAYER_ID}&season=${season}`, {
          headers: { 'x-apisports-key': API_FOOTBALL_KEY },
          timeout: 5000
        });

        if (statsResp.data.response && statsResp.data.response.length > 0) {
          statsResp.data.response[0].statistics.forEach(s => {
            golesTotalesRecientes += (s.goals.total || 0);
          });
        }
      } catch (e) {
        console.log(`⚠️ No se pudo consultar temporada ${season}: ${e.message}`);
      }
    }

    // El total de la API: 900 (base pre-AlNassr) + goles recientes
    const totalDesdeAPI = golesTotalesRecientes > 0 ? (900 + golesTotalesRecientes) : 0;
    
    // REGLA CRÍTICA: El contador NUNCA puede bajar. Tomar el mayor valor.
    const totalGlobal = Math.max(golesBase, totalDesdeAPI);
    console.log(`⚽ Total final: ${totalGlobal} goles (API: ${totalDesdeAPI}, BD actual: ${golesBase})`);

    // B. Generar noticia con IA Detallada
    const noticiaIA = await obtenerComentarioIA(totalGlobal);

    // D. Actualizar Estadísticas
    await supabase.from('estadisticas_globales').upsert({ 
      id: 1,
      total_goles: totalGlobal, 
      ultima_actualizacion: new Date() 
    });
    
    // E. Insertar Noticia Completa
    await supabase.from('noticias').insert([{ 
      titular: noticiaIA.titular, 
      contenido: noticiaIA.resumen,
      imagen_url: noticiaIA.imagen_url,
      fuente: 'CR7 AI Brain', 
      fecha_publicacion: new Date() 
    }]);

    // F. Actualizar Goles Históricos (Añadir hito si es múltiplo de 10 o el último)
    if (totalGlobal % 10 === 0 || totalGlobal === 970) {
      await supabase.from('goles_historicos').upsert({
        numero_gol: totalGlobal,
        fecha: new Date().toISOString().split('T')[0],
        descripcion: `Gol número ${totalGlobal} en su carrera profesional.`,
        es_hito: true
      }, { onConflict: 'numero_gol' });
    }

    console.log(`✅ Sincronización Élite: ${totalGlobal} goles registrados.`);
  } catch (err) {
    console.error("❌ Error Crítico:", err.message);
  }
}

runSync();
