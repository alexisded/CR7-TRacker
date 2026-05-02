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

  // 3. Estilo de Vida
  const tips = [
    { categoria: 'Recuperación', titulo: 'Crioterapia', descripcion: 'Sesiones de 3 minutos a -160°C.' },
    { categoria: 'Nutrición', titulo: 'Dieta Pro', descripcion: '6 comidas al día, alta proteína.' }
  ];
  await supabase.from('estilo_vida').upsert(tips, { onConflict: 'titulo' });

  // 4. Goles Históricos
  console.log("📜 Poblando hitos históricos...");
  const hitos = [
    { numero_gol: 900, fecha: '2024-09-05', rival: 'Croacia', competicion: 'Nations League', equipo: 'Portugal', minuto: 34, tipo_gol: 'Derecha', es_hito: true },
    { numero_gol: 910, fecha: '2024-10-15', rival: 'Escocia', competicion: 'Nations League', equipo: 'Portugal', minuto: 88, tipo_gol: 'Derecha', es_hito: false }
  ];
  await supabase.from('goles_historicos').upsert(hitos, { onConflict: 'numero_gol' });

  console.log("✅ ¡Todo listo! La base de datos ha sido actualizada.");
}

initializeCR7Database().catch(err => {
  console.error("❌ Error fatal:", err.message);
});
