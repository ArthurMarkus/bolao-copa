"use client"
import { Match } from "@/types"
import { useState } from "react"
import TeamCrest from "@/components/team-crest"
import { toast } from "sonner"

type GuessFormProps = {
  match: Match
  existingGuess?: { home_score: number; away_score: number }
  plain?: boolean
}

export default function GuessForm({ match, existingGuess, plain = false }: GuessFormProps) {
  const [homeScore, setHomeScore] = useState(existingGuess?.home_score.toString() ?? "")
  const [awayScore, setAwayScore] = useState(existingGuess?.away_score.toString() ?? "")
  const [saved, setSaved] = useState(existingGuess !== undefined)

  async function handleSave() {
    if (homeScore === "" || awayScore === "") {
      toast.warning("Por favor, preencha ambos os placares para salvar o palpite.")
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
    if (res.ok) {
      setSaved(true)
      toast.success(`Palpite salvo: ${match.team_home} ${homeScore} x ${awayScore} ${match.team_away}`)
    } else {
      toast.error("Erro ao salvar palpite")
    }
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(match.date))

  const formContent = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
      {/* Match Row */}
      <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-6">
        {/* Home */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end flex-1 min-w-0">
          <span className="font-semibold text-xs sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>
            {match.team_home}
          </span>
          <TeamCrest crest={match.home_crest} name={match.team_home} size={28} className="sm:w-8 sm:h-8" />
        </div>

        {/* Score inputs */}
        <div
          className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shrink-0"
          style={{ background: 'var(--bg-overlay)', border: '1px solid var(--open-border)' }}
        >
          <input
            type="number"
            min={0}
            value={homeScore}
            onChange={e => { setHomeScore(e.target.value); setSaved(false) }}
            className="w-10 h-8 sm:w-12 sm:h-10 text-center rounded-md text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-hover)',
              fontFamily: 'var(--font-mono)',
              // @ts-ignore
              '--tw-ring-color': 'var(--accent)',
            }}
            placeholder="-"
          />
          <span className="font-bold text-sm sm:text-lg" style={{ color: 'var(--text-muted)' }}>x</span>
          <input
            type="number"
            min={0}
            value={awayScore}
            onChange={e => { setAwayScore(e.target.value); setSaved(false) }}
            className="w-10 h-8 sm:w-12 sm:h-10 text-center rounded-md text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-hover)',
              fontFamily: 'var(--font-mono)',
              // @ts-ignore
              '--tw-ring-color': 'var(--accent)',
            }}
            placeholder="-"
          />
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 sm:gap-3 justify-start flex-1 min-w-0">
          <TeamCrest crest={match.away_crest} name={match.team_away} size={28} className="sm:w-8 sm:h-8" />
          <span className="font-semibold text-xs sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>
            {match.team_away}
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="w-full sm:w-auto flex justify-center sm:justify-end shrink-0">
        <button
          onClick={handleSave}
          className="w-full max-w-[200px] sm:w-28 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-[0.97]"
          style={{
            background: saved ? 'var(--open)' : 'var(--accent)',
            color: '#fff',
            border: saved ? '1px solid var(--open)' : '1px solid var(--accent)',
            opacity: saved ? 0.85 : 1,
          }}
        >
          {saved ? "Salvo" : "Salvar"}
        </button>
      </div>
    </div>
  )

  if (plain) {
    return formContent
  }

  return (
    <div
      className="rounded-lg p-4 transition-all duration-200"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--open-border)',
      }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3 pb-3 text-xs" style={{ borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {formattedDate}
        </span>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: 'var(--open-bg)',
            color: 'var(--open)',
            border: '1px solid var(--open-border)',
          }}
        >
          Aberto
        </span>
      </div>

      {formContent}
    </div>
  )
}