"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: "/matches", label: "⚽ Partidas" },
    { href: "/ranking", label: "🏆 Ranking" },
  ]

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <aside className="w-56 min-h-screen bg-black border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-white font-semibold text-base">⚽ Bolão da Copa</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-white hover:bg-gray-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded text-sm font-medium text-gray-600 hover:text-white hover:bg-gray-900 transition-colors"
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  )
}