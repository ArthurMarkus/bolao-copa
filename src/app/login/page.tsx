"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!name || !password) {
      setError("Preencha todos os campos")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      })
      if (res.ok) {
        router.push("/matches")
      } else {
        setError("Nome ou senha inválidos")
      }
    } catch (err) {
      setError("Erro ao se conectar ao servidor")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRegister() {
    if (!name || !password) {
      setError("Preencha todos os campos para se cadastrar")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      })
      if (res.ok) {
        setError("")
        setName("")
        setPassword("")
        alert("Conta criada com sucesso! Faça login.")
      } else {
        setError("Erro ao criar conta. Talvez o nome já esteja em uso.")
      }
    } catch (err) {
      setError("Erro ao se conectar ao servidor")
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleLogin()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background World Cup Aura Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 -z-10 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />

      <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />
        
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-amber-500/20 text-4xl p-4 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/5 mb-4 group hover:scale-105 transition-transform duration-300">
            🏆
          </div>
          <h1 className="text-white text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
            Bolão da Copa
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            Seu palpite pode valer o título!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nome */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              placeholder="Seu nome de usuário"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/[0.03] text-white placeholder-gray-500 rounded-xl border border-white/10 pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Sua senha secreta"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/[0.03] text-white placeholder-gray-500 rounded-xl border border-white/10 pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-4 rounded-xl text-center font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-black font-extrabold rounded-xl py-3.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              {isLoading ? "Entrando..." : "Entrar no Bolão"}
            </button>

            <div className="relative flex py-2 items-center text-xs text-gray-500">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4">não tem conta?</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl py-3.5 border border-white/10 hover:border-white/20 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              Criar minha conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}