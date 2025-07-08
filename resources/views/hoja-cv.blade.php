<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hoja de Vida - Sergio Ortiz</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page {
        size: A4;
        margin: 0.8cm;
        }

        body {
            font-family: 'Times New Roman', serif;
            font-size: 13px;
            padding: 1rem;
        }

        @media print {
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body class="bg-white text-gray-800 font-serif p-4 text-sm">
    <div class="max-w-3xl mx-auto">
        <header class="text-center border-b pb-2 mb-2">
            <h1 class="text-2xl font-bold">Sergio Ortiz Garzon, Desarrollador de Software</h1>
            <p>Bogotá, <a href="mailto:sergiortiz.03@live.com" class="text-gray-900">sergiortiz.03@live.com, 3209925728</a></p>
        </header>

        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Perfil Profesional</h2>
            <p>Desarrollador backend con sólida experiencia en PHP y Laravel. Apasionado por crear soluciones eficientes y mantenibles. Me enfoco en la optimización del rendimiento interno, sin descuidar la experiencia del usuario, trabajando con tecnologías modernas como Tailwind CSS y Alpine.js.</p>
        </section>


        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Proyectos y Portafolio</h2>
            <div class="flex flex-wrap text-sm gap-4">
                <div>
                <span class="font-semibold">GitHub:</span>
                <a href="https://github.com/chechojgb" target="_blank" class="text-blue-700 underline">github.com/chechojgb</a>
                </div>
                <div>
                <span class="font-semibold">Portafolio:</span>
                <a href="https://portafolio-main-pqv5o8.laravel.cloud" target="_blank" class="text-blue-700 underline">portafolio-main.laravel.cloud</a>
                </div>
            </div>
        </section>

        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Experiencia Laboral</h2>
            <div class="flex justify-between">
                <p class="text-sm">Oct 2024 — Jul 2025</p>
                <p class="text-sm">Bogotá</p>
            </div>
            <p class="font-semibold">Desarrollador de software, Monchechelo</p>
            <p class="text-sm">
                Desarrollo de paneles personalizados con Laravel y Tailwind para monitoreo en tiempo real de agentes. Automatización de procesos en telecomunicaciones mediante integración con Asterisk y desarrollo de dashboards interactivos que facilitaron y agilizaron las labores de monitoreo manual. También trabajé con Alpine.js y React para mejorar la experiencia de usuario según las necesidades del negocio.
            </p>
        </section>

        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Formación</h2>
            <div class="flex justify-between">
                <p class="text-sm">Ene 2023</p>
                <p class="text-sm">Bogotá</p>
            </div>
            <p class="font-semibold">Analista y Desarrollador de Software, SENA</p>
        </section>

        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Tecnologías que domino</h2>
            <ul class="list-disc list-inside text-sm space-y-1">
                <li><strong>PHP & Laravel:</strong> desarrollo de APIs, dashboards, autenticación, migraciones, integración con Asterisk y bases de datos.</li>
                <li><strong>Tailwind CSS & Alpine.js:</strong> construcción de interfaces interactivas y responsivas para uso interno y externo.</li>
                <li><strong>React:</strong> desarrollo de interfaces dinámicas, terminales web, hooks personalizados, integración con WebSockets.</li>
                <li><strong>MySQL:</strong> diseño de esquemas, consultas complejas, optimización de rendimiento.</li>
                <li><strong>Git:</strong> control de versiones en equipos de trabajo con flujos GitFlow y manejo de ramas.</li>
            </ul>
        </section>

        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Prácticas</h2>
            <p class="font-semibold">Analista y desarrollador de software en telecomunicaciones, Group Cos</p>
            <p class="text-sm mt-0.5">Participación en implementación de flujos operativos para agentes, desarrollo de scripts de monitoreo y procesos de restauración de datos críticos, enfocados en la eficiencia operativa y continuidad del servicio.</p>
        </section>

        
        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Referencias</h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="font-semibold">Jorge Fonca, Team Lead de Telecomunicaciones</p>
                    <p>317 7715313 - jorge.f@montechelo.online</p>
                </div>
                <div>
                    <p class="font-semibold">Andriely Casallas, DevOps</p>
                    <p>311 2284689 - andrielycasallas@gmail.com</p>
                </div>
            </div>
        </section>
        <section class="mb-2">
            <h2 class="uppercase text-xs font-bold tracking-widest border-b border-black pb-1 mb-2">Cursos</h2>
            <p class="text-sm">Oct 2024 — Abr 2025</p>
            <p class="font-semibold">Laravel 11-12 + integración con Tailwind.css y Vue 3, Udemy</p>
        </section>
    </div>

    <div class="text-center mt-6 no-print">
        <button onclick="window.print()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Descargar en PDF
        </button>
    </div>
</body>
</html>
