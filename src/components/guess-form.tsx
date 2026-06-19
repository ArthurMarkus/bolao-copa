"use client"
import { Match } from "@/types"
import { useState } from "react"
import { getFlagEmoji } from "@/lib/flags"
import FlagEmoji from "@/components/flag-emoji"

type GuessFormProps = {
  match: Match
  existingGuess?: { home_score: number; away_score: number }
}

export default function GuessForm({ match, existingGuess }: GuessFormProps) {
  const [homeScore, setHomeScore] = useState(existingGuess?.home_score.toString() ?? "")
  const [awayScore, setAwayScore] = useState(existingGuess?.away_score.toString() ?? "")
  const [saved, setSaved] = useState(existingGuess !== undefined)

  async function handleSave() {
    // Validar se os valores são numéricos e não vazios
    if (homeScore === "" || awayScore === "") {
      alert("Por favor, preencha ambos os placares para salvar o palpite.")
      return
    }

    const res = await fetch("/api/guesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId: match.id_match,
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
      }),
    })
    if (res.ok) setSaved(true)
    else alert("Erro ao salvar palpite")
  }

  const homeFlag = getFlagEmoji(match.team_home)
  const awayFlag = getFlagEmoji(match.team_away)
  
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(match.date))

  return (
    <div className="bg-gradient-to-r from-emerald-950/30 to-green-950/10 backdrop-blur-md rounded-xl border border-emerald-900/60 hover:border-emerald-500/50 p-5 shadow-lg shadow-emerald-950/20 transition-all duration-300">
      {/* Cabeçalho do Card */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/40 text-xs">
        <span className="text-emerald-400/80 font-medium flex items-center gap-1.5">
          📅 {formattedDate}
        </span>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px]">
          Palpite Aberto
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        {/* Match Row (Always Horizontal) */}
        <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-6">
          {/* Time Casa */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end flex-1 min-w-0">
            <span className="text-white font-bold text-sm sm:text-base truncate order-1 sm:order-1">{match.team_home}</span>
            <FlagEmoji emoji={homeFlag} title={match.team_home} size={28} className="order-2 sm:order-2 drop-shadow-sm shrink-0 sm:w-8 sm:h-8" />
          </div>

          {/* Inputs de Placar */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-emerald-900/40 shrink-0">
            <input
              type="number"
              min={0}
              value={homeScore}
              onChange={e => { setHomeScore(e.target.value); setSaved(false) }}
              className="w-10 h-8 sm:w-12 sm:h-10 bg-emerald-950/50 text-white text-center rounded-lg border border-emerald-800/80 text-lg sm:text-xl font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="-"
            />
            <span className="text-amber-500 font-black text-sm sm:text-lg">x</span>
            <input
              type="number"
              min={0}
              value={awayScore}
              onChange={e => { setAwayScore(e.target.value); setSaved(false) }}
              className="w-10 h-8 sm:w-12 sm:h-10 bg-emerald-950/50 text-white text-center rounded-lg border border-emerald-800/80 text-lg sm:text-xl font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="-"
            />
          </div>

          {/* Time Fora */}
          <div className="flex items-center gap-2 sm:gap-3 justify-start flex-1 min-w-0">
            <FlagEmoji emoji={awayFlag} title={match.team_away} size={28} className="drop-shadow-sm shrink-0 sm:w-8 sm:h-8" />
            <span className="text-white font-bold text-sm sm:text-base truncate">{match.team_away}</span>
          </div>
        </div>

        {/* Ação */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end min-w-[120px] shrink-0">
          <button
            onClick={handleSave}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md ${
              saved 
                ? "bg-emerald-600/80 hover:bg-emerald-600 text-white border border-emerald-500 cursor-default shadow-emerald-900/30" 
                : "bg-amber-500 hover:bg-amber-400 text-emerald-950 border border-amber-400 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-amber-950/30"
            }`}
          >
            {saved ? "✓ Salvo" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  )
}