import { Guess } from "@/types"

type GuessDisplayProps = {
  guess?: Guess
  showPoints?: boolean
}

export default function GuessDisplay({ guess, showPoints = false }: GuessDisplayProps) {
  if (!guess) {
    return (
      <div className="hidden sm:block w-[120px] text-right text-xs italic" style={{ color: 'var(--text-muted)' }}>
        Sem palpite
      </div>
    )
  }

  return (
    <div
      className="w-full max-w-[200px] mx-auto sm:mx-0 sm:w-auto sm:min-w-[120px] text-center sm:text-right px-3 py-2 rounded-lg"
      style={{
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        Seu Palpite
      </div>
      <div className="font-bold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
        {guess.home_score} x {guess.away_score}
      </div>
      {showPoints && guess.points !== undefined && guess.points !== null && (
        <div
          className="text-[11px] font-bold mt-0.5"
          style={{
            color: guess.points === 2
              ? 'var(--points-perfect)'
              : guess.points === 1
                ? 'var(--points-correct)'
                : 'var(--points-zero)',
          }}
        >
          {guess.points === 2
            ? "+2 pts — Placar exato"
            : guess.points === 1
              ? "+1 pt — Vencedor certo"
              : "0 pts"}
        </div>
      )}
    </div>
  )
}
