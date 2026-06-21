"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

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
        toast.success("Conta criada com sucesso! Faça login.")
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(224, 49, 49, 0.03) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl font-extrabold text-lg mb-4"
            style={{
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
            }}
          >
            BC
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Bolão da Copa
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Entre com sua conta para continuar
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-xl p-6"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Usuário
              </label>
              <input
                placeholder="Seu nome de usuário"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-hover)',
                  // @ts-ignore
                  '--tw-ring-color': 'var(--accent)',
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-hover)',
                  // @ts-ignore
                  '--tw-ring-color': 'var(--accent)',
                }}
                required
              />
            </div>

            {error && (
              <div
                className="text-xs py-2.5 px-4 rounded-lg text-center font-medium"
                style={{
                  background: 'var(--live-bg)',
                  border: '1px solid var(--live-border)',
                  color: 'var(--live)',
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold rounded-lg py-3 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-sm active:scale-[0.99]"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  border: '1px solid var(--accent)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>

              <div className="relative flex py-2 items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                <div className="flex-grow" style={{ borderTop: '1px solid var(--border)' }}></div>
                <span className="flex-shrink mx-4 text-[11px]">ou</span>
                <div className="flex-grow" style={{ borderTop: '1px solid var(--border)' }}></div>
              </div>

              <button
                type="button"
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full font-medium rounded-lg py-3 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-sm"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-hover)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                Criar conta
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] mt-6" style={{ color: 'var(--text-muted)' }}>
          Mundial 2026
        </p>
      </div>
    </div>
  )
}