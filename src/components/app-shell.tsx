"use client"
import { usePathname } from "next/navigation"
import Sidebar from "./sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = pathname !== "/login"

  if (!showSidebar) return <>{children}</>

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 pb-24 md:ml-64 md:p-8">
        {children}
      </main>
    </div>
  )
}