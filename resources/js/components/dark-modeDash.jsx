import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';


import useDarkMode from '@/hooks/useDarkMode';

export default function DarkModeDash() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
      >
        <button type="button" className="w-full" onClick={() => setDarkMode(!darkMode)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {darkMode ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-12.66l-.707.707M4.05 4.05l-.707.707M21 12h-1M4 12H3m16.95 7.95l-.707-.707M4.05 19.95l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.293 13.293A8 8 0 016.707 2.707 8 8 0 1017.293 13.293z"
              />
            )}
          </svg>
          <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
