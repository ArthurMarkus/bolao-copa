"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    {
      href: "/matches",
      label: "Partidas",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      href: "/ranking",
      label: "Ranking Geral",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v5m-3 0h6M4 7h16M4 7a3 3 0 003 3h10a3 3 0 003-3M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2m-10 8a3 3 0 01-3-3V7h6v5a3 3 0 01-3 3z" />
        </svg>
      )
    },
  ]

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <aside className="w-64 h-screen sticky top-0 bg-gradient-to-b from-gray-950 to-black border-r border-white/[0.06] flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col flex-1">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
          <div className="relative flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-amber-500/20 text-xl w-10 h-10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            🏆
          </div>
          <div>
            <h1 className="text-white font-black text-sm tracking-wide bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              BOLÃO DA COPA
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Mundial 2026</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 pt-6">
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/10 to-amber-500/5 border-emerald-500/20 text-emerald-400 shadow-md shadow-emerald-500/5"
                    : "text-gray-400 hover:text-white bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5"
                }`}
              >
                <span className={`transition-colors ${isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"}`}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/[0.06] bg-black/20">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200 cursor-pointer"
        >
          <span className="text-gray-500 group-hover:text-red-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          Sair da Conta
        </button>
      </div>
    </aside>
  )
}