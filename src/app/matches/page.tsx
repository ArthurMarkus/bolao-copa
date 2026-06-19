import GuessForm from "@/components/guess-form";
import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/worldcup-api";
import { getFlagEmoji } from "@/lib/flags";
import FlagEmoji from "@/components/flag-emoji";
import GuessDisplay from "@/components/guess-display";
import { findGuessesByUser } from "@/repositories/guess.repository";
import { recalcRanking } from "@/services/ranking.service";
import { redirect } from "next/navigation";
import ScrollToActiveMatch from "@/components/scroll-to-active-match";

export default async function MatchesPage() {
  await recalcRanking();
  const session = await getSession();
  if (!session) redirect("/login");

  const [matches, guesses] = await Promise.all([
    getMatches(),
    findGuessesByUser(session.userId),
  ]);

  // Filtra apenas partidas com times confirmados
  const confirmedMatches = matches.filter(
    (m) => m.team_home !== "A definir" && m.team_away !== "A definir",
  );

  // Determina a partida ativa/próxima para scroll automático
  let activeMatchId = confirmedMatches.find(
    (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
  )?.id_match;

  if (!activeMatchId) {
    activeMatchId = confirmedMatches.find((m) => m.status === "TIMED")?.id_match;
  }

  if (!activeMatchId && confirmedMatches.length > 0) {
    activeMatchId = confirmedMatches[confirmedMatches.length - 1].id_match;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      {activeMatchId && <ScrollToActiveMatch matchId={activeMatchId} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="text-amber-500">🏆</span> Partidas do Bolão
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Dê os seus palpites antes do início de cada jogo e suba no ranking!
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {confirmedMatches.map((m) => {
          const guess = guesses.find((g) => g.match_id === m.id_match);
          const homeFlag = getFlagEmoji(m.team_home);
          const awayFlag = getFlagEmoji(m.team_away);
          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(m.date));

          return (
            <div
              key={m.id_match}
              id={`match-${m.id_match}`}
              className="transition-all duration-200 scroll-mt-6 rounded-xl"
            >
              {m.status === "TIMED" && (
                <GuessForm match={m} existingGuess={guess} />
              )}

              {m.status === "IN_PLAY" && (
                <div className="bg-gradient-to-r from-red-950/20 to-yellow-950/10 backdrop-blur-md rounded-xl border border-red-900/40 p-5 shadow-lg shadow-red-950/10 animate-pulse">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-red-950/20 text-xs">
                    <span className="text-red-400/80 font-medium flex items-center gap-1.5">
                      📅 {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      Ao Vivo
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    {/* Match Row (Always Horizontal) */}
                    <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-6">
                      {/* Time Casa */}
                      <div className="flex items-center gap-2 sm:gap-3 justify-end flex-1 min-w-0">
                        <span className="text-white font-bold text-sm sm:text-base truncate order-1 sm:order-1">
                          {m.team_home}
                        </span>
                        <FlagEmoji
                          emoji={homeFlag}
                          title={m.team_home}
                          size={28}
                          className="order-2 sm:order-2 drop-shadow-sm shrink-0 sm:w-8 sm:h-8"
                        />
                      </div>

                      {/* Placar Real */}
                      <div className="flex items-center gap-2 sm:gap-3 bg-black/60 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border border-red-900/30 shrink-0">
                        <span className="text-white font-black text-lg sm:text-2xl px-1 sm:px-2">
                          {m.home_score ?? 0}
                        </span>
                        <span className="text-amber-500 font-black text-sm sm:text-lg">
                          -
                        </span>
                        <span className="text-white font-black text-lg sm:text-2xl px-1 sm:px-2">
                          {m.away_score ?? 0}
                        </span>
                      </div>

                      {/* Time Fora */}
                      <div className="flex items-center gap-2 sm:gap-3 justify-start flex-1 min-w-0">
                        <FlagEmoji
                          emoji={awayFlag}
                          title={m.team_away}
                          size={28}
                          className="drop-shadow-sm shrink-0 sm:w-8 sm:h-8"
                        />
                        <span className="text-white font-bold text-sm sm:text-base truncate">
                          {m.team_away}
                        </span>
                      </div>
                    </div>

                    <GuessDisplay guess={guess} />
                  </div>
                </div>
              )}

              {m.status === "FINISHED" && (
                <div className="bg-gradient-to-r from-gray-900 to-gray-950 backdrop-blur-md rounded-xl border border-gray-800/80 p-5 shadow-md">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/60 text-xs">
                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                      📅 {formattedDate}
                    </span>
                    <span className="bg-gray-850 text-gray-400 border border-gray-800 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px]">
                      Finalizado
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    {/* Match Row (Always Horizontal) */}
                    <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-6">
                      {/* Time Casa */}
                      <div className="flex items-center gap-2 sm:gap-3 justify-end flex-1 min-w-0">
                        <span className="text-white font-bold text-sm sm:text-base truncate order-1 sm:order-1">
                          {m.team_home}
                        </span>
                        <FlagEmoji
                          emoji={homeFlag}
                          title={m.team_home}
                          size={28}
                          className="order-2 sm:order-2 drop-shadow-sm shrink-0 sm:w-8 sm:h-8"
                        />
                      </div>

                      {/* Placar Real */}
                      <div className="flex items-center gap-2 sm:gap-3 bg-black/40 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border border-gray-800 shrink-0">
                        <span className="text-white font-extrabold text-lg sm:text-2xl px-1 sm:px-2">
                          {m.home_score}
                        </span>
                        <span className="text-gray-500 font-black text-sm sm:text-lg">
                          x
                        </span>
                        <span className="text-white font-extrabold text-lg sm:text-2xl px-1 sm:px-2">
                          {m.away_score}
                        </span>
                      </div>

                      {/* Time Fora */}
                      <div className="flex items-center gap-2 sm:gap-3 justify-start flex-1 min-w-0">
                        <FlagEmoji
                          emoji={awayFlag}
                          title={m.team_away}
                          size={28}
                          className="drop-shadow-sm shrink-0 sm:w-8 sm:h-8"
                        />
                        <span className="text-white font-bold text-sm sm:text-base truncate">
                          {m.team_away}
                        </span>
                      </div>
                    </div>

                    <GuessDisplay guess={guess} showPoints />
                  </div>
                </div>
              )}

              {m.status === "PAUSED" && (
                <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/10 backdrop-blur-md rounded-xl border border-amber-900/40 p-5 shadow-lg shadow-amber-900/10">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-900/20 text-xs">
                    <span className="text-amber-400/80 font-medium flex items-center gap-1.5">
                      📅 {formattedDate}
                    </span>

                    <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                      Pausado
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    {/* Match Row (Always Horizontal) */}
                    <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-6">
                      {/* Time Casa */}
                      <div className="flex items-center gap-2 sm:gap-3 justify-end flex-1 min-w-0">
                        <span className="text-white font-bold text-sm sm:text-base truncate order-1 sm:order-1">
                          {m.team_home}
                        </span>
                        <FlagEmoji
                          emoji={homeFlag}
                          title={m.team_home}
                          size={28}
                          className="order-2 sm:order-2 drop-shadow-sm shrink-0 sm:w-8 sm:h-8"
                        />
                      </div>

                      {/* Placar Real */}
                      <div className="flex items-center gap-2 sm:gap-3 bg-black/40 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border border-gray-800 shrink-0">
                        <span className="text-white font-extrabold text-lg sm:text-2xl px-1 sm:px-2">
                          {m.home_score}
                        </span>
                        <span className="text-gray-500 font-black text-sm sm:text-lg">
                          x
                        </span>
                        <span className="text-white font-extrabold text-lg sm:text-2xl px-1 sm:px-2">
                          {m.away_score}
                        </span>
                      </div>

                      {/* Time Fora */}
                      <div className="flex items-center gap-2 sm:gap-3 justify-start flex-1 min-w-0">
                        <FlagEmoji
                          emoji={awayFlag}
                          title={m.team_away}
                          size={28}
                          className="drop-shadow-sm shrink-0 sm:w-8 sm:h-8"
                        />
                        <span className="text-white font-bold text-sm sm:text-base truncate">
                          {m.team_away}
                        </span>
                      </div>
                    </div>

                    <GuessDisplay guess={guess} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
