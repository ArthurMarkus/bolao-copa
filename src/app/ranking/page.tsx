import { getRanking } from "@/repositories/guess.repository"
import { recalcRanking } from "@/services/ranking.service"

export default async function RankingPage() {
  await recalcRanking()
    const ranking = await getRanking()

  return (
    <div>
      <h1 className="text-white text-2xl font-semibold mb-8">Ranking</h1>
      <div className="space-y-3 max-w-2xl">
        {ranking.map((entry, index) => (
          <div
            key={entry.user_id}
            className="flex items-center gap-6 bg-gray-900 rounded border border-gray-800 px-6 py-5"
          >
            <span className="text-white font-bold w-8 text-center text-xl">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
            </span>
            <span className="text-white font-medium flex-1">{entry.name}</span>
            <span className="text-white font-bold">{entry.total_points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}