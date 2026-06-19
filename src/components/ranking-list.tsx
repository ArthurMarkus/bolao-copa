"use client";
import { useState, useEffect } from "react";
import FlagEmoji from "@/components/flag-emoji";
import { getFlagEmoji } from "@/lib/flags";
import { RankingEntry } from "@/types";

type RankingListProps = {
  ranking: RankingEntry[];
};

export default function RankingList({ ranking }: RankingListProps) {
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [guesses, setGuesses] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedUser) {
      setGuesses(null);
      setError("");
      return;
    }

    async function fetchGuesses() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/guesses?userId=${selectedUser!.id}`);
        if (!res.ok) throw new Error("Erro ao buscar palpites");
        const data = await res.json();
        setGuesses(data);
      } catch (err) {
        setError("Não foi possível carregar os palpites.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuesses();
  }, [selectedUser]);

  return (
    <>
      <div className="space-y-3">
        {ranking.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-base">
              Nenhum jogador pontuou ainda. Os palpites começarão a valer assim
              que os jogos iniciarem!
            </p>
          </div>
        ) : (
          ranking.map((entry, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            // Generate initials
            const initials = entry.name
              ? entry.name
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "?";

            // Position badges
            let positionBadge = null;
            let cardStyle =
              "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.06] hover:border-white/[0.1] text-gray-300";
            let rankColorClass = "text-gray-400";
            let pointsStyle = "text-white font-bold";
            let avatarBorder = "border-white/10 bg-white/5";

            if (isFirst) {
              positionBadge = "🥇";
              cardStyle =
                "bg-gradient-to-r from-amber-500/12 via-amber-500/5 to-transparent border-amber-500/40 hover:border-amber-500/60 shadow-lg shadow-amber-500/5";
              rankColorClass = "text-amber-400 font-black text-2xl";
              pointsStyle =
                "text-amber-400 font-black text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]";
              avatarBorder =
                "border-amber-500/50 bg-amber-500/10 text-amber-300";
            } else if (isSecond) {
              positionBadge = "🥈";
              cardStyle =
                "bg-gradient-to-r from-slate-400/12 via-slate-400/5 to-transparent border-slate-400/30 hover:border-slate-400/50 shadow-md shadow-slate-400/5";
              rankColorClass = "text-slate-300 font-black text-2xl";
              pointsStyle = "text-slate-300 font-extrabold text-xl";
              avatarBorder =
                "border-slate-400/40 bg-slate-400/10 text-slate-300";
            } else if (isThird) {
              positionBadge = "🥉";
              cardStyle =
                "bg-gradient-to-r from-amber-700/12 via-amber-700/5 to-transparent border-amber-700/30 hover:border-amber-700/50 shadow-md shadow-amber-700/5";
              rankColorClass = "text-amber-600 font-black text-2xl";
              pointsStyle = "text-amber-600 font-extrabold text-xl";
              avatarBorder =
                "border-amber-700/40 bg-amber-700/10 text-amber-600";
            }

            return (
              <div
                key={index}
                onClick={() =>
                  setSelectedUser({ id: entry.user_id, name: entry.name })
                }
                className={`flex items-center gap-4 sm:gap-6 rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${cardStyle}`}
              >
                {/* Ranking Position */}
                <div className="flex items-center justify-center w-10 sm:w-12 text-center">
                  {positionBadge ? (
                    <span className="text-3xl filter drop-shadow-sm select-none">
                      {positionBadge}
                    </span>
                  ) : (
                    <span className={`text-base font-bold ${rankColorClass}`}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Initial Avatar */}
                <div
                  className={`hidden sm:flex items-center justify-center w-11 h-11 rounded-full border font-bold text-sm ${avatarBorder}`}
                >
                  {initials}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-base sm:text-lg truncate ${isFirst ? "text-white" : "text-gray-200"}`}
                    >
                      {entry.name}
                    </span>
                    {isFirst && (
                      <span className="bg-amber-500/15 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/20 tracking-wider">
                        Líder
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Participante do Bolão ⚽
                  </p>
                </div>

                {/* User Score */}
                <div className="text-right">
                  <span className={`${pointsStyle}`}>{entry.total_points}</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold tracking-wider block sm:inline sm:ml-1">
                    pts
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lazy Loaded Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-950 to-black border border-white/[0.08] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden animate-scale-up">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />

            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                  Palpites do Participante
                </span>
                <h3 className="text-white text-xl font-extrabold tracking-tight mt-0.5">
                  ⚽ {selectedUser.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="text-gray-400 text-sm font-medium animate-pulse">
                    Buscando palpites no banco...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-4 px-6 rounded-2xl text-center font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {!loading && !error && guesses && (
                <div className="space-y-3">
                  {guesses.filter((m: any) => m.status === "FINISHED").length === 0 ? (
                    <p className="text-gray-500 text-center py-10 text-sm italic">
                      Nenhuma partida finalizada encontrada para este usuário.
                    </p>
                  ) : (
                    guesses
                      .filter((m: any) => m.status === "FINISHED")
                      .map((m: any) => {
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
                            className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200"
                          >
                            {/* Match Header (Date and Status) */}
                            <div className="flex items-center justify-between text-xs border-b border-white/[0.03] pb-2 w-full">
                              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                                📅 {formattedDate}
                              </span>
                              <span className="bg-gray-800 text-gray-400 border border-white/5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                Finalizado
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                              {/* Teams and Score (Always Horizontal) */}
                              <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-4 sm:max-w-md">
                                <div className="flex items-center gap-2 text-right flex-1 justify-end min-w-0">
                                  <span className="text-white text-xs font-bold truncate">
                                    {m.team_home}
                                  </span>
                                  <FlagEmoji
                                    emoji={homeFlag}
                                    title={m.team_home}
                                    size={20}
                                    className="drop-shadow-sm shrink-0"
                                  />
                                </div>

                                {/* Match Real Score */}
                                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 text-xs font-bold text-gray-400 shrink-0">
                                  <span>{m.home_score ?? "-"}</span>
                                  <span className="text-[10px] text-gray-600">x</span>
                                  <span>{m.away_score ?? "-"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-left flex-1 justify-start min-w-0">
                                  <FlagEmoji
                                    emoji={awayFlag}
                                    title={m.team_away}
                                    size={20}
                                    className="drop-shadow-sm shrink-0"
                                  />
                                  <span className="text-white text-xs font-bold truncate">
                                    {m.team_away}
                                  </span>
                                </div>
                              </div>

                              {/* User Guess */}
                              <div className="min-w-[120px] text-center sm:text-right w-full sm:w-auto bg-black/20 sm:bg-transparent py-2 sm:py-0 rounded-xl border border-white/5 sm:border-0">
                                {m.guess ? (
                                  <div>
                                    <span className="text-[9px] text-gray-500 uppercase font-semibold block">
                                      Palpite
                                    </span>
                                    <span className="text-white text-xs font-extrabold">
                                      {m.guess.home_score} x {m.guess.away_score}
                                    </span>
                                    {m.guess.points !== null && (
                                      <span
                                        className={`block text-[10px] font-black mt-0.5 ${
                                          m.guess.points === 2
                                            ? "text-amber-400"
                                            : m.guess.points === 1
                                              ? "text-emerald-400"
                                              : "text-gray-500"
                                        }`}
                                      >
                                        {m.guess.points === 2
                                          ? "🎯 +2 pts"
                                          : m.guess.points === 1
                                            ? "⚖️ +1 pt"
                                            : "❌ 0 pts"}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-600 italic">
                                    Sem palpite
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.06] bg-black/20 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
