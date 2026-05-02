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
            // 1. Obtener Estadísticas de Goles
            const { data: stats, error: errorStats } = await supabase
                .from('estadisticas_globales')
                .select('total_goles, meta_goles')
                .single()

            if (stats && !errorStats) {
                // Actualizar número de goles (970)
                const elGoles = document.getElementById('contador-goles');
                if (elGoles) elGoles.innerText = stats.total_goles;

                // Actualizar lo que falta para 1000 (30)
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
                // Actualizar texto de la noticia
                const elIA = document.getElementById('ia-titular');
                if (elIA) elIA.innerText = news[0].titular;
            }
        } catch (e) {
            console.error("Error conectando con el Cerebro CR7:", e);
        }
    }

    // Ejecutar inmediatamente y luego cada 5 minutos
    actualizarTrackerCR7();
    setInterval(actualizarTrackerCR7, 300000);
</script>
