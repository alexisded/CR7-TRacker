require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeCR7Database() {
  console.log("🚀 Iniciando conexión con Supabase...");

  // 1. Insertar Estadísticas Globales
  console.log("⚽ Actualizando contador de goles...");
  const { error: statsError } = await supabase
    .from('estadisticas_globales')
    .upsert({ id: 1, total_goles: 915, meta_goles: 1000 });

  if (statsError) console.warn("⚠️ Nota: Si ves un error aquí, asegúrate de haber ejecutado el SQL en el Editor de Supabase primero.");

  // 2. Insertar Goles por Equipo
  console.log("🏟️ Insertando desglose por equipos...");
  const equipos = [
    { equipo: 'Real Madrid', goles: 450 },
    { equipo: 'Manchester United', goles: 145 },
    { equipo: 'Juventus', goles: 101 },
    { equipo: 'Al-Nassr', goles: 75 },
    { equipo: 'Portugal', goles: 135 },
    { equipo: 'Sporting CP', goles: 5 }
  ];

  const { error: teamError } = await supabase
    .from('goles_por_equipo')
    .upsert(equipos, { onConflict: 'equipo' });

  // 3. Insertar Estilo de Vida
  console.log("🥗 Cargando datos de salud y disciplina...");
  const tips = [
    { categoria: 'Recuperación', titulo: 'Crioterapia', descripcion: 'Sesiones de 3 minutos a -160°C.' },
    { categoria: 'Nutrición', titulo: 'Dieta Pro', descripcion: '6 comidas al día, alta proteína.' },
    { categoria: 'Mentalidad', titulo: 'Visualización', descripcion: 'Enfoque total antes de cada partido.' }
  ];

  await supabase.from('estilo_vida').upsert(tips, { onConflict: 'titulo' });

  console.log("✅ ¡Todo listo! La base de datos ha sido poblada con la info de CR7.");
}

initializeCR7Database().catch(err => {
  console.error("❌ Error fatal:", err.message);
});
