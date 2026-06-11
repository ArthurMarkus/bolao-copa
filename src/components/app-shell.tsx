"use client"
import { usePathname } from "next/navigation"
import Sidebar from "./sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = pathname !== "/login"

  if (!showSidebar) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}