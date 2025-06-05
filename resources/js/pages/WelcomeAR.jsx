import { Head, Link, usePage } from '@inertiajs/react';
import ButtonLarge from '@/components/button';
import useDarkMode from '@/hooks/useDarkMode';
import DarkMode from '@/components/dark-mode';

export default function Welcome() {
    const { auth } = usePage().props;
    
    

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <DarkMode/>

            <div className="bg-white dark:bg-gray-900 h-screen">
                {auth?.user ? (
                    <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right z-10">
                        <a
                            href="/dashboard"
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </a>
                    </div>
                ) : null}

                <header>
                    <div className="px-4 mx-auto sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 lg:h-20">
                            <div className="flex-shrink-0">
                                <a
                                    href="#"
                                    title=""
                                    className="flex items-center text-lg font-semibold transition-colors duration-200 dark:text-white"
                                >
                                    <img src="https://storeproyectoar.blob.core.windows.net/ar-multimedia-resources-container/nosotros-arhoteles-logo.png" className="h-10 w-10 mr-2 bg-red-600" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="py-10 sm:py-16 lg:py-24">
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                            <div>
                                <h1 className="text-4xl font-bold text-black sm:text-6xl lg:text-7xl dark:text-white">
                                    ¡Bienvenido al Control de Agentes!
                                    <div className="relative inline-flex">
                                        <span className="absolute inset-x-0 bottom-0 border-b-[30px] border-red-600"></span>
                                        <h1 className="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl dark:text-white">
                                            AZZU.
                                        </h1>
                                    </div>
                                </h1>

                                <p className="mt-8 text-base text-black sm:text-xl dark:text-gray-300">
                                    Tu espacio centralizado para visualizar, monitorear y gestionar la actividad de tus agentes en tiempo real de AR.
                                </p>

                                <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
                                    <Link href={route('login')}>
                                         <button  className="bg-red-600 hover-bg-red-500 text-white font-bold py-2 px-14 rounded shadow-lg cursor-pointer " >
                                            Ingresa
                                        </button>
                                    </Link>

                                </div>
                            </div>

                            <div>
                                <img
                                    className="w-full"
                                    src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
