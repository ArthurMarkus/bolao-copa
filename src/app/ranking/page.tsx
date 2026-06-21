import {
  getLeastCorrectGuesses,
  getMostCorrectGuesses,
  getMostPerfectScores,
  getRanking,
} from "@/repositories/guess.repository";
import { recalcRanking } from "@/services/ranking.service";
import RankingList from "@/components/ranking-list";
import { getMatches } from "@/lib/worldcup-api";

export const metadata = {
  title: "Classificação Geral | Bolão da Copa",
  description:
    "Acompanhe o ranking dos participantes do bolão da Copa do Mundo e veja quem está na liderança!",
};

export default async function RankingPage() {
  const allMatches = await getMatches();
  await recalcRanking(allMatches);
  const finishedMatchIds = allMatches
    .filter(m => m.status === 'FINISHED')
    .map(m => m.id_match)
    
  const [ranking, mostCorrect, mostPerfect, leastCorrect] = await Promise.all([
    getRanking(),
    getMostCorrectGuesses(finishedMatchIds),
    getMostPerfectScores(finishedMatchIds),
    getLeastCorrectGuesses(finishedMatchIds)
  ]);

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-2 overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Classificação Geral
        </span>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
          Tabela de Líderes
        </h1>
      </div>

      {(mostCorrect || mostPerfect || leastCorrect) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {/* Mais Acertos */}
          {mostCorrect && (
            <div
              className="rounded-lg p-4 transition-all duration-200"
              style={{
                background: 'rgba(212, 168, 67, 0.04)',
                border: '1px solid rgba(212, 168, 67, 0.15)',
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--rank-1)' }}>
                Mais Acertos
              </p>
              <h2 className="text-base font-bold mt-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
                {mostCorrect.name}
              </h2>
              <p className="text-sm mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                {mostCorrect.count} palpites certos
              </p>
            </div>
          )}

          {/* Mais Placares Perfeitos */}
          {mostPerfect && (
            <div
              className="rounded-lg p-4 transition-all duration-200"
              style={{
                background: 'rgba(34, 160, 101, 0.04)',
                border: '1px solid rgba(34, 160, 101, 0.15)',
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--open)' }}>
                Placares Perfeitos
              </p>
              <h2 className="text-base font-bold mt-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
                {mostPerfect.name}
              </h2>
              <p className="text-sm mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                {mostPerfect.count} placares exatos
              </p>
            </div>
          )}

          {/* Menos Acertos */}
          {leastCorrect && (
            <div
              className="rounded-lg p-4 transition-all duration-200"
              style={{
                background: 'rgba(224, 49, 49, 0.03)',
                border: '1px solid rgba(224, 49, 49, 0.12)',
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                Menos Acertos
              </p>
              <h2 className="text-base font-bold mt-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
                {leastCorrect.name}
              </h2>
              <p className="text-sm mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                {leastCorrect.count} palpites errados
              </p>
            </div>
          )}
        </div>
      )}

      {/* Ranking List */}
      <RankingList ranking={ranking} />
    </div>
  );
}
