<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModulePricingSeeder extends Seeder
{
    public function run(): void
    {
        $pricing = [
            'lead-router' => ['is_free' => false, 'price' => 2900, 'marketing' => 'Triaje inteligente de formularios y leads entrantes con IA.'],
            'form-builder' => ['is_free' => false, 'price' => 1900, 'marketing' => 'Formularios embebibles sin depender de WordPress.'],
            'form-detector' => ['is_free' => true, 'price' => 0, 'marketing' => 'Te avisa si tu formulario de contacto deja de funcionar.'],
            'whatsapp-guardia' => ['is_free' => false, 'price' => 3900, 'marketing' => 'Atención automática por WhatsApp fuera de horario.'],
            'resenas-gmb' => ['is_free' => false, 'price' => 2400, 'marketing' => 'Respuestas y alertas para reseñas de Google.'],
            'reputacion-multicanal' => ['is_free' => false, 'price' => 3400, 'marketing' => 'Google, Facebook y directorios en un solo panel.'],
            'monitor-menciones' => ['is_free' => true, 'price' => 0, 'marketing' => 'Alertas cuando tu marca aparece en Google.'],
            'seo-onpage' => ['is_free' => false, 'price' => 2200, 'marketing' => 'Metadatos SEO automáticos al publicar.'],
            'seo-pipeline' => ['is_free' => false, 'price' => 4900, 'marketing' => 'Artículos programados con flujo de aprobación.'],
            'enlaces-rotos' => ['is_free' => true, 'price' => 0, 'marketing' => 'Detecta enlaces rotos en tu web periódicamente.'],
            'alerta-posicion-seo' => ['is_free' => false, 'price' => 1800, 'marketing' => 'Aviso si una keyword clave baja posiciones.'],
            'voz-gestion' => ['is_free' => false, 'price' => 3200, 'marketing' => 'Convierte audios de WhatsApp en partes de trabajo.'],
            'seguimiento-automatico' => ['is_free' => false, 'price' => 1500, 'marketing' => 'Recordatorios de leads sin respuesta.'],
            'asignacion-zona' => ['is_free' => false, 'price' => 1200, 'marketing' => 'Asigna leads por zona o especialidad.'],
            'web-uptime' => ['is_free' => false, 'price' => 900, 'marketing' => 'Monitoriza si tu web cae y avisa por email o WhatsApp.'],
            'monitor-ssl' => ['is_free' => true, 'price' => 0, 'marketing' => 'Aviso antes de que caduque tu certificado SSL.'],
            'velocidad-carga' => ['is_free' => false, 'price' => 1100, 'marketing' => 'Alerta si tu web tarda más de lo acordado en cargar.'],
            'caida-trafico' => ['is_free' => false, 'price' => 1400, 'marketing' => 'Detecta caídas de visitas respecto a la semana anterior.'],
        ];

        foreach ($pricing as $slug => $data) {
            Module::where('slug', $slug)->update([
                'is_free' => $data['is_free'],
                'price_monthly_cents' => $data['price'],
                'marketing_description' => $data['marketing'],
            ]);
        }
    }
}
