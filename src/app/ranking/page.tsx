import { getRanking } from "@/repositories/guess.repository"
import { recalcRanking } from "@/services/ranking.service"
import RankingList from "@/components/ranking-list"

export const metadata = {
  title: "Classificação Geral | Bolão da Copa",
  description: "Acompanhe o ranking dos participantes do bolão da Copa do Mundo e veja quem está na liderança!",
}

export default async function RankingPage() {
  await recalcRanking()
  const ranking = await getRanking()

  const totalPlayers = ranking.length
  const leader = ranking[0]
  const averagePoints = totalPlayers > 0
    ? Math.round(ranking.reduce((acc, curr) => acc + curr.total_points, 0) / totalPlayers)
    : 0

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-2 min-h-screen">
      {/* Background World Cup Aura Gradients */}
      <div className="absolute top-0 right-0 -z-10 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 -z-10 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center bg-amber-500/10 text-amber-500 p-2.5 rounded-2xl border border-amber-500/20 text-2xl shadow-lg shadow-amber-500/5">
            🏆
          </span>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Classificação Geral</span>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">Tabela de Líderes</h1>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Quem será o grande campeão? Acompanhe o ranking do nosso bolão da Copa do Mundo em tempo real.
        </p>
      </div>

      {/* Stats Cards Dashboard */}
      {totalPlayers > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Card 1: Líder */}
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-md rounded-2xl border border-amber-500/20 p-5 shadow-lg shadow-amber-500/5 relative overflow-hidden group hover:border-amber-500/35 transition-all duration-300">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 text-7xl text-amber-500/5 font-black select-none pointer-events-none">#1</div>
            <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">Líder Atual</p>
            <h2 className="text-white text-xl font-bold mt-2 truncate flex items-center gap-1.5">
              👑 {leader.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-semibold">{leader.total_points} pontos acumulados</p>
          </div>

          {/* Card 2: Total de Apostadores */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent backdrop-blur-md rounded-2xl border border-emerald-500/20 p-5 shadow-lg shadow-emerald-500/5 relative overflow-hidden group hover:border-emerald-500/35 transition-all duration-300">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 text-7xl text-emerald-500/5 font-black select-none pointer-events-none">⚽</div>
            <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Apostadores</p>
            <h2 className="text-white text-xl font-bold mt-2">
              {totalPlayers} {totalPlayers === 1 ? 'Participante' : 'Participantes'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">Disputando o título do bolão</p>
          </div>

          {/* Card 3: Média de Pontos */}
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-md rounded-2xl border border-blue-500/20 p-5 shadow-lg shadow-blue-500/5 relative overflow-hidden group hover:border-blue-500/35 transition-all duration-300">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 text-7xl text-blue-500/5 font-black select-none pointer-events-none">📈</div>
            <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Média do Grupo</p>
            <h2 className="text-white text-xl font-bold mt-2">
              {averagePoints} pts
            </h2>
            <p className="text-gray-400 text-sm mt-1">Pontuação média por jogador</p>
          </div>
        </div>
      )}

      {/* Ranking List */}
      <RankingList ranking={ranking} />
    </div>
  )
}