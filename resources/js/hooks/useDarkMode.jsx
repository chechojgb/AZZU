// import { useEffect, useState } from 'react';

// export default function useDarkMode() {
//     const [darkMode, setDarkMode] = useState(() => {
//         if (typeof window !== 'undefined') {
//             const saved = localStorage.getItem('darkMode');
//             if (saved !== null) return JSON.parse(saved);
//             return window.matchMedia('(prefers-color-scheme: dark)').matches;
//         }
//         return false;
//     });

//     useEffect(() => {
//         localStorage.setItem('darkMode', JSON.stringify(darkMode));
//         document.documentElement.classList.toggle('dark', darkMode);
//     }, [darkMode]);

//     return [darkMode, setDarkMode];
// }


import { useEffect, useState } from 'react';

export default function useDarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) return JSON.parse(saved);
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.documentElement.classList.toggle('dark', darkMode);

        // ✅ Esta línea notifica a otros componentes (como XTerm) del cambio
        window.dispatchEvent(new Event("storage"));
    }, [darkMode]);

    return [darkMode, setDarkMode];
}
