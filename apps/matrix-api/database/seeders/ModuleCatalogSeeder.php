<?php

namespace Database\Seeders;

use App\Models\BusinessSubscription;
use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleCatalogSeeder extends Seeder
{
    /**
     * Catálogo único: copy, visibilidad y precios (MVP sin facturación activa).
     *
     * @return array<int, array<string, mixed>>
     */
    public static function definitions(): array
    {
        return [
            // —— Ocultos del catálogo (legado / absorbidos) ——
            [
                'slug' => 'lead-router',
                'name' => 'Lead Router',
                'category' => 'captacion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 2900,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'form-builder',
                'name' => 'Form Builder',
                'category' => 'captacion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 1900,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'form-detector',
                'name' => 'Form Detector',
                'category' => 'captacion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => true,
                'price_monthly_cents' => 0,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'monitor-ssl',
                'name' => 'Monitor SSL',
                'category' => 'monitorizacion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => true,
                'price_monthly_cents' => 0,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'seo-onpage',
                'name' => 'SEO on-page',
                'category' => 'contenido',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 2200,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'alerta-posicion-seo',
                'name' => 'Alerta posición SEO',
                'category' => 'contenido',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 1800,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'presupuestos-wa',
                'name' => 'Presupuestos WA',
                'category' => 'gestion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 0,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'seguimiento-automatico',
                'name' => 'Seguimiento automático',
                'category' => 'gestion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 1500,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'asignacion-zona',
                'name' => 'Asignación por zona',
                'category' => 'gestion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 1200,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'velocidad-carga',
                'name' => 'Velocidad de carga',
                'category' => 'monitorizacion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 1100,
                'marketing_description' => null,
                'description' => null,
            ],
            [
                'slug' => 'caida-trafico',
                'name' => 'Caída de tráfico',
                'category' => 'monitorizacion',
                'catalog_visible' => false,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 1400,
                'marketing_description' => null,
                'description' => null,
            ],

            // —— Social ——
            [
                'slug' => 'whatsapp-guardia',
                'name' => 'WhatsApp Guardia',
                'category' => 'social',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => false,
                'price_monthly_cents' => 3900,
                'marketing_description' => 'Atiende WhatsApp fuera de horario con tus documentos y sin prometer lo que no puedes cumplir.',
                'description' => 'Cuando cierras el local, los mensajes no deberían quedarse sin respuesta. WhatsApp Guardia lee tus PDFs de servicios, precios orientativos y preguntas frecuentes, responde con tono profesional y, si no puede resolver la consulta, recoge nombre, contacto y necesidad para que tu equipo retome al día siguiente. Ideal para clínicas, talleres y comercios que reciben consultas por la noche o el fin de semana.',
            ],
            [
                'slug' => 'resenas-gmb',
                'name' => 'Reseñas Google',
                'category' => 'social',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => false,
                'price_monthly_cents' => 2400,
                'marketing_description' => 'Responde reseñas de Google con criterio: automático en positivas, supervisión humana en las críticas.',
                'description' => 'Las reseñas influyen directamente en quién te elige frente a la competencia. Esta app vigila tu ficha de Google Business, redacta respuestas empáticas con IA y puede publicarlas en valoraciones altas si lo autorizas. En reseñas de una a tres estrellas nunca publica sin tu aprobación: recibes alerta, revisas el borrador y decides. Así cuidas tu reputación sin pasar horas pegado al móvil.',
            ],
            [
                'slug' => 'reputacion-multicanal',
                'name' => 'Reputación multicanal',
                'category' => 'social',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => false,
                'price_monthly_cents' => 3400,
                'marketing_description' => 'Google, redes y directorios en un solo panel para no perder ningún comentario importante.',
                'description' => 'Tu reputación ya no vive solo en Google. Reputación multicanal centraliza menciones y reseñas de varios canales, prioriza lo urgente y te ayuda a responder con coherencia de marca. Pensado para negocios con varios puntos de contacto online que quieren una imagen cuidada sin contratar una agencia a tiempo completo.',
            ],
            [
                'slug' => 'monitor-menciones',
                'name' => 'Monitor de menciones',
                'category' => 'social',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => true,
                'price_monthly_cents' => 0,
                'marketing_description' => 'Te avisa cuando tu marca o tu negocio aparece en Google, antes de que sea tarde.',
                'description' => 'Configura el nombre comercial de tu negocio y recibe alertas cuando surja una mención relevante en la web o en resultados de búsqueda. Útil para detectar reseñas en foros, noticias locales o comparativas de competidores. Incluido gratis para que ninguna PYME se quede sin oídos en internet.',
            ],

            // —— Contenido ——
            [
                'slug' => 'seo-pipeline',
                'name' => 'SEO Pipeline',
                'category' => 'contenido',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => false,
                'price_monthly_cents' => 4900,
                'marketing_description' => 'Artículos SEO en WordPress con aprobación humana: nada se publica sin tu visto bueno.',
                'description' => 'Mantén el blog de tu negocio vivo sin arriesgar la marca. SEO Pipeline genera artículos alineados con tus servicios y tu zona, optimiza metadatos on-page (título, descripción, estructura) y crea borradores en WordPress. Recibes un aviso para revisar, editar si quieres y aprobar con trazabilidad antes de publicar. Incluye el flujo que antes repartías entre varias herramientas de SEO on-page y redacción.',
            ],
            [
                'slug' => 'enlaces-rotos',
                'name' => 'Detector de enlaces rotos',
                'category' => 'contenido',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => true,
                'price_monthly_cents' => 0,
                'marketing_description' => 'Rastrea tu web, detecta enlaces rotos y avisa si tus keywords clave pierden posiciones.',
                'description' => 'Un enlace roto en la página de reservas o en un artículo antiguo resta confianza y perjudica el SEO. Esta app recorre tu sitio de forma periódica, señala URLs que fallan y te resume qué corregir primero. Además incorpora vigilancia de posiciones en buscadores para keywords que definas: si una cae de forma relevante, lo sabes antes de que afecte a las llamadas. Todo en una sola herramienta de salud técnica y visibilidad.',
            ],

            // —— Gestión ——
            [
                'slug' => 'voz-gestion',
                'name' => 'Voz a gestión',
                'category' => 'gestion',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => false,
                'price_monthly_cents' => 3200,
                'marketing_description' => 'Convierte audios de WhatsApp en tareas claras para tu equipo.',
                'description' => 'En el taller, la clínica o la obra, muchas instrucciones llegan en audio y se pierden entre el ruido del día. Voz a gestión transcribe mensajes de voz, extrae acciones (llamar a un cliente, pedir un repuesto, revisar una incidencia) y las deja registradas para quien corresponda. Menos olvidos, menos dependencia del jefe que “lo tenía en la cabeza”.',
            ],

            // —— Monitorización ——
            [
                'slug' => 'web-uptime',
                'name' => 'Monitor web y SSL',
                'category' => 'monitorizacion',
                'catalog_visible' => true,
                'is_available' => true,
                'is_free' => true,
                'price_monthly_cents' => 0,
                'marketing_description' => 'Vigila si tu web cae y si el certificado SSL va a caducar. Gratis y con historial.',
                'description' => 'Tu web es la primera impresión de muchos clientes. Cada pocos minutos comprobamos que responde correctamente; si hay caída, te avisamos por email con la hora exacta y, al recuperarse, cuánto duró el problema. También revisamos el certificado SSL para avisarte antes de que el navegador muestre “no seguro” a tus visitantes. Todo el historial queda en el panel para demostrar incidencias al proveedor o alojamiento.',
            ],

            // —— Visual (próximamente) ——
            [
                'slug' => 'digital-signage',
                'name' => 'Digital signage',
                'category' => 'visual',
                'catalog_visible' => true,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 0,
                'marketing_description' => 'Pantallas del local con menús, ofertas y avisos actualizables desde el móvil.',
                'description' => 'Próximamente podrás gestionar el contenido de las pantallas de tu negocio sin USB ni técnicos: menús del día, promociones y avisos legales sincronizados desde un panel sencillo. Pensado para bares, clínicas y tiendas que quieren comunicar en tiempo real.',
            ],
            [
                'slug' => 'video-local',
                'name' => 'Video en local',
                'category' => 'visual',
                'catalog_visible' => true,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 0,
                'marketing_description' => 'Vídeos formativos y promocionales en las pantallas de tu local.',
                'description' => 'Programa vídeos por franja horaria o por zona del local: tutoriales en el gimnasio, tratamientos en la clínica o demos en tienda. Próximamente integrado con el ecosistema BusyManager para PYMEs con varias pantallas.',
            ],
            [
                'slug' => 'menu-dinamico',
                'name' => 'Menú dinámico',
                'category' => 'visual',
                'catalog_visible' => true,
                'is_available' => false,
                'is_free' => false,
                'price_monthly_cents' => 0,
                'marketing_description' => 'Carta digital que cambias en segundos y se ve en pantalla y en la web.',
                'description' => 'Actualiza platos, precios y alérgenos sin reimprimir carteles. El menú se reflejará en pantallas del local y, cuando lo actives, en tu web embebida. Ideal para restaurantes y cafeterías que rotan oferta a diario.',
            ],
        ];
    }

    public function run(): void
    {
        foreach (self::definitions() as $def) {
            Module::updateOrCreate(
                ['slug' => $def['slug']],
                [
                    'name' => $def['name'],
                    'category' => $def['category'],
                    'description' => $def['description'],
                    'marketing_description' => $def['marketing_description'],
                    'is_available' => $def['is_available'],
                    'catalog_visible' => $def['catalog_visible'],
                    'is_free' => $def['is_free'],
                    'price_monthly_cents' => $def['price_monthly_cents'],
                ],
            );
        }

        $hiddenSlugs = collect(self::definitions())
            ->filter(fn ($d) => ! $d['catalog_visible'])
            ->pluck('slug');

        BusinessSubscription::query()
            ->whereHas('module', fn ($q) => $q->whereIn('slug', $hiddenSlugs))
            ->update(['is_active' => false]);
    }
}
