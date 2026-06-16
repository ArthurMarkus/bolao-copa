import { Guess } from "@/types"

type GuessDisplayProps = {
  guess?: Guess
  showPoints?: boolean
}

export default function GuessDisplay({ guess, showPoints = false }: GuessDisplayProps) {
  if (!guess) {
    return (
      <div className="hidden sm:block w-[120px] text-right text-xs text-gray-650 italic">
        Sem palpite
      </div>
    )
  }

  return (
    <div className="w-full sm:w-auto min-w-[120px] text-center sm:text-right bg-gray-950/60 px-3 py-2 rounded-lg border border-gray-800/50">
      <div className="text-[10px] text-gray-500 uppercase font-semibold">
        Seu Palpite
      </div>
      <div className="text-white font-bold text-sm">
        {guess.home_score} x {guess.away_score}
      </div>
      {showPoints && guess.points !== undefined && guess.points !== null && (
        <div
          className={`text-[11px] font-black mt-0.5 ${
            guess.points === 2
              ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]"
              : guess.points === 1
                ? "text-emerald-400"
                : "text-gray-500"
          }`}
        >
          {guess.points === 2
            ? "🎯 +2 pts (Placar Cheio)"
            : guess.points === 1
              ? "⚖️ +1 pt (Vencedor)"
              : "❌ 0 pts"}
        </div>
      )}
    </div>
  )
}
