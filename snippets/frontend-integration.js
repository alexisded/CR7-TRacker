<!-- 
  COPIA Y PEGA TODO ESTE CÓDIGO EN TU PÁGINA DE BASE44.
  No necesitas cambiar absolutamente nada, ya tiene tus llaves personales.
-->
<script type="module">
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

    // Configuración Final (Supabase + CR7 AI Brain)
    const SUPABASE_URL = "https://zwwynabsglidamdojioa.supabase.co"
    const SUPABASE_ANON_KEY = "sb_publishable_Srdtn7hYyXX-r2ilubA64w_7VTDYMzD"

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    async function actualizarTrackerCR7() {
        try {
            // 1. Obtener Estadísticas (Contador Principal)
            const { data: stats, error: errorStats } = await supabase
                .from('v_stats_public') // Intentar vista primero
                .select('*')
                .single()
                .then(res => res.error ? supabase.from('estadisticas_globales').select('*').single() : res) // Fallback a tabla

            if (stats && !errorStats) {
                const elGoles = document.getElementById('contador-goles');
                if (elGoles) elGoles.innerText = stats.total_goles;

                const elMeta = document.getElementById('meta-restante');
                if (elMeta) elMeta.innerText = stats.meta_goles - stats.total_goles;
            }

            // 2. Obtener Titular de la IA
            const { data: news, error: errorNews } = await supabase
                .from('noticias')
                .select('titular')
                .order('fecha_publicacion', { ascending: false })
                .limit(1)

            if (news && news[0] && !errorNews) {
                const elIA = document.getElementById('ia-titular');
                if (elIA) elIA.innerText = news[0].titular;
            }

            // 3. Obtener Historial de Goles (NUEVO)
            const { data: hist, error: errorHist } = await supabase
                .from('v_historial_public')
                .select('*')
                .limit(5)
                .then(res => res.error ? supabase.from('goles_historicos').select('*').limit(5) : res)

            if (hist && !errorHist) {
                const elHist = document.getElementById('historial-goles');
                if (elHist) {
                    elHist.innerHTML = hist.map(g => `
                        <div style="border-bottom: 1px solid #333; padding: 10px 0;">
                            <span style="color: #ffd700; font-weight: bold;">#${g.numero_gol}</span> - 
                            <span>${g.descripcion || 'Gol oficial'}</span> 
                            <small style="display: block; color: #888;">${g.fecha}</small>
                        </div>
                    `).join('');
                }
            }
        } catch (e) {
            console.error("Error en la matriz CR7:", e);
        }
    }

    // Ejecutar inmediatamente y luego cada 5 minutos
    actualizarTrackerCR7();
    setInterval(actualizarTrackerCR7, 300000);
</script>
