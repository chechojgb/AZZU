import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, usePage } from '@inertiajs/react'
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"

export default function SidebarDropdown({ item, currentPath }) {
  const [open, setOpen] = useState(false)
  const { state } = useSidebar() // ← usamos el estado del sidebar

  const toggle = () => setOpen(!open)

  const isActive =
    item.href === currentPath || item.children?.some(child => child.href === currentPath)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={toggle}
        isActive={isActive}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {item.icon && <item.icon className="w-5 h-5" />}
          {state === 'expanded' && <span>{item.title}</span>}
        </div>
        {state === 'expanded' && (
          open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </SidebarMenuButton>

      {/* Submenú solo se muestra si está abierto y el sidebar no está colapsado */}
      {state === 'expanded' && open && item.children?.length > 0 && (
        <ul className="ml-6 mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {item.children.map((child) => (
            <li key={child.title}>
              <Link
                href={child.href}
                className={cn(
                  "block py-1.5 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition",
                  child.href === currentPath && "bg-gray-200 dark:bg-gray-800 font-semibold"
                )}
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SidebarMenuItem>
  )
}