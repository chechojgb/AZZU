import useDarkMode from '@/hooks/useDarkMode';
import React from "react";

function DarkMode(){

    const [darkMode, setDarkMode] = useDarkMode();
    return(
        <>
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    type="button"
                    aria-checked={darkMode}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out border-2 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                >
                    <span className="sr-only">Toggle dark mode</span>
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            darkMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
        </>
    )
}

export default DarkMode;