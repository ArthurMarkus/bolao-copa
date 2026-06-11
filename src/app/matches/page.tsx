import GuessForm from "@/components/guess-form"
import { getSession } from "@/lib/auth"
import { getMatches } from "@/lib/worldcup-api"
import { findGuessesByUser } from "@/repositories/guess.repository"
import { redirect } from "next/navigation"

export default async function MatchesPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const [matches, guesses] = await Promise.all([
    getMatches(),
    findGuessesByUser(session.userId),
  ])

  // Filtra apenas partidas com times confirmados
  const confirmedMatches = matches.filter(
    m => m.team_home !== "A definir" && m.team_away !== "A definir"
  )

  return (
    <div>
      <h1 className="text-white text-2xl font-semibold mb-8">Partidas</h1>
      <div className="space-y-4 max-w-2xl">
        {confirmedMatches.map(m => {
          const guess = guesses.find(g => g.match_id === m.id_match)

          return (
            <div key={m.id_match}>
              {m.status === "TIMED" && (
                <GuessForm match={m} existingGuess={guess} />
              )}

              {m.status === "IN_PLAY" && (
                <div className="bg-gray-900 rounded border border-gray-800 p-6">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-white font-bold text-sm min-w-max">{m.team_home}</span>
                    <span className="text-yellow-500 text-xs font-bold px-3 py-1 rounded">
                      Em andamento
                    </span>
                    <span className="text-white font-bold text-sm min-w-max">{m.team_away}</span>
                  </div>
                </div>
              )}

              {m.status === "FINISHED" && (
                <div className="bg-gray-900 rounded border border-gray-800 p-6">
                  <div className="flex items-center justify-between gap-6 mb-4">
                    <span className="text-white font-bold text-sm min-w-max">{m.team_home}</span>
                    <span className="text-white font-bold text-3xl">
                      {m.home_score} <span className="text-gray-600 text-xl">x</span> {m.away_score}
                    </span>
                    <span className="text-white font-bold text-sm min-w-max">{m.team_away}</span>
                  </div>
                  {guess && (
                    <div className="border-t border-gray-800 pt-4 text-center">
                      <span className="text-white text-xs">
                        Seu palpite: {guess.home_score} x {guess.away_score} — 
                        <span className={`ml-2 font-bold ${
                          guess.points === 2 ? "text-green-400" :
                          guess.points === 1 ? "text-yellow-400" :
                          "text-gray-600"
                        }`}>
                          {guess.points} pts
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}