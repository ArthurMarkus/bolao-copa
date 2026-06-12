import { getRanking } from "@/repositories/guess.repository"
import { recalcRanking } from "@/services/ranking.service"

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
      <div className="space-y-3">
        {ranking.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-base">Nenhum jogador pontuou ainda. Os palpites começarão a valer assim que os jogos iniciarem!</p>
          </div>
        ) : (
          ranking.map((entry, index) => {
            const isFirst = index === 0
            const isSecond = index === 1
            const isThird = index === 2
            
            // Generate initials
            const initials = entry.name
              ? entry.name
                  .split(" ")
                  .filter(Boolean)
                  .map(n => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "?"

            // Position badges
            let positionBadge = null
            let cardStyle = "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.06] hover:border-white/[0.1] text-gray-300"
            let rankColorClass = "text-gray-400"
            let pointsStyle = "text-white font-bold"
            let avatarBorder = "border-white/10 bg-white/5"

            if (isFirst) {
              positionBadge = "🥇"
              cardStyle = "bg-gradient-to-r from-amber-500/12 via-amber-500/5 to-transparent border-amber-500/40 hover:border-amber-500/60 shadow-lg shadow-amber-500/5"
              rankColorClass = "text-amber-400 font-black text-2xl"
              pointsStyle = "text-amber-400 font-black text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              avatarBorder = "border-amber-500/50 bg-amber-500/10 text-amber-300"
            } else if (isSecond) {
              positionBadge = "🥈"
              cardStyle = "bg-gradient-to-r from-slate-400/12 via-slate-400/5 to-transparent border-slate-400/30 hover:border-slate-400/50 shadow-md shadow-slate-400/5"
              rankColorClass = "text-slate-300 font-black text-2xl"
              pointsStyle = "text-slate-300 font-extrabold text-xl"
              avatarBorder = "border-slate-400/40 bg-slate-400/10 text-slate-300"
            } else if (isThird) {
              positionBadge = "🥉"
              cardStyle = "bg-gradient-to-r from-amber-700/12 via-amber-700/5 to-transparent border-amber-700/30 hover:border-amber-700/50 shadow-md shadow-amber-700/5"
              rankColorClass = "text-amber-600 font-black text-2xl"
              pointsStyle = "text-amber-600 font-extrabold text-xl"
              avatarBorder = "border-amber-700/40 bg-amber-700/10 text-amber-600"
            }

            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 sm:gap-6 rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${cardStyle}`}
              >
                {/* Ranking Position */}
                <div className="flex items-center justify-center w-10 sm:w-12 text-center">
                  {positionBadge ? (
                    <span className="text-3xl filter drop-shadow-sm select-none">{positionBadge}</span>
                  ) : (
                    <span className={`text-base font-bold ${rankColorClass}`}>{index + 1}</span>
                  )}
                </div>

                {/* Initial Avatar */}
                <div className={`hidden sm:flex items-center justify-center w-11 h-11 rounded-full border font-bold text-sm ${avatarBorder}`}>
                  {initials}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-base sm:text-lg truncate ${isFirst ? 'text-white' : 'text-gray-200'}`}>
                      {entry.name}
                    </span>
                    {isFirst && (
                      <span className="bg-amber-500/15 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/20 tracking-wider">
                        Líder
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Participante do Bolão ⚽</p>
                </div>

                {/* User Score */}
                <div className="text-right">
                  <span className={`${pointsStyle}`}>
                    {entry.total_points}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold tracking-wider block sm:inline sm:ml-1">
                    pts
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}