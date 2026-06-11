"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    })
    if (res.ok) router.push("/matches")
    else setError("Nome ou senha inválidos")
  }

  async function handleRegister() {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    })
    if (res.ok) {
      setError("")
      setName("")
      setPassword("")
      alert("Conta criada! Faça login.")
    } else {
      setError("Erro ao criar conta")
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 rounded border border-gray-800 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl inline-block mb-4">⚽</span>
          <h1 className="text-white text-2xl font-semibold">Bolão da Copa</h1>
          <p className="text-gray-600 text-sm mt-2">Entre ou crie sua conta</p>
        </div>
        <div className="space-y-4">
          <input
            placeholder="Seu nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-black text-white placeholder-gray-700 rounded border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-gray-700"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-black text-white placeholder-gray-700 rounded border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-gray-700"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium rounded border border-gray-800 py-3 text-sm transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={handleRegister}
            className="w-full bg-transparent hover:bg-gray-900 text-gray-600 font-medium rounded border border-gray-800 py-3 text-sm transition-colors"
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  )
}