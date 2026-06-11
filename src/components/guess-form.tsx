"use client"
import { Match } from "@/types"
import { useState } from "react"

type GuessFormProps = {
  match: Match
  existingGuess?: { home_score: number; away_score: number }
}

export default function GuessForm({ match, existingGuess }: GuessFormProps) {
  const [homeScore, setHomeScore] = useState(existingGuess?.home_score.toString() ?? "")
  const [awayScore, setAwayScore] = useState(existingGuess?.away_score.toString() ?? "")
  const [saved, setSaved] = useState(false)

  async function handleSave() {
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

  return (
    <div className="bg-gray-900 rounded border border-gray-800 p-6">
      <div className="flex items-center justify-between gap-8">
        <span className="text-white font-bold text-sm min-w-max">{match.team_home}</span>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            value={homeScore}
            onChange={e => { setHomeScore(e.target.value); setSaved(false) }}
            className="w-14 bg-black text-white text-center rounded border border-gray-700 py-2 text-lg font-bold focus:outline-none focus:border-gray-600"
          />
          <span className="text-gray-600 font-bold">x</span>
          <input
            type="number"
            min={0}
            value={awayScore}
            onChange={e => { setAwayScore(e.target.value); setSaved(false) }}
            className="w-14 bg-black text-white text-center rounded border border-gray-700 py-2 text-lg font-bold focus:outline-none focus:border-gray-600"
          />
        </div>
        <span className="text-white font-bold text-sm min-w-max">{match.team_away}</span>
        <button
          onClick={handleSave}
          className={`px-5 py-2 rounded text-xs font-medium transition-colors whitespace-nowrap ${
            saved ? "bg-gray-900 text-gray-600 cursor-default" : "bg-gray-900 hover:bg-gray-800 text-white"
          }`}
        >
          {saved ? "✓ Salvo" : "Salvar"}
        </button>
      </div>
    </div>
  )
}