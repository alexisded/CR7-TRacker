const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStatus() {
  console.log('--- Comprobando Estado de Supabase ---');
  
  // Ver estadisticas
  const { data: stats, error: errStats } = await supabase
    .from('estadisticas_globales')
    .select('*')
    .order('ultima_actualizacion', { ascending: false })
    .limit(1);

  if (errStats) console.error('Error stats:', errStats);
  else console.log('Estadísticas actuales:', stats[0]);

  // Ver últimas noticias
  const { data: news, error: errNews } = await supabase
    .from('noticias')
    .select('*')
    .order('fecha_publicacion', { ascending: false })
    .limit(3);

  if (errNews) console.error('Error news:', errNews);
  else {
    console.log('\n--- Últimas Noticias (IA) ---');
    news.forEach(n => console.log(`[${n.fecha_publicacion}] ${n.titular}`));
  }
}

checkStatus();
