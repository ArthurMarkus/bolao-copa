"use client";
import { useState, useEffect } from "react";
import TeamCrest from "@/components/team-crest";
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

  function getRankStyle(index: number) {
    if (index === 0) return {
      bg: 'rgba(212, 168, 67, 0.06)',
      border: 'rgba(212, 168, 67, 0.2)',
      rankColor: 'var(--rank-1)',
      avatarBg: 'rgba(212, 168, 67, 0.1)',
      avatarBorder: 'rgba(212, 168, 67, 0.3)',
    };
    if (index === 1) return {
      bg: 'rgba(156, 163, 175, 0.04)',
      border: 'rgba(156, 163, 175, 0.15)',
      rankColor: 'var(--rank-2)',
      avatarBg: 'rgba(156, 163, 175, 0.08)',
      avatarBorder: 'rgba(156, 163, 175, 0.2)',
    };
    if (index === 2) return {
      bg: 'rgba(184, 115, 51, 0.05)',
      border: 'rgba(184, 115, 51, 0.15)',
      rankColor: 'var(--rank-3)',
      avatarBg: 'rgba(184, 115, 51, 0.08)',
      avatarBorder: 'rgba(184, 115, 51, 0.2)',
    };
    return {
      bg: 'var(--bg-secondary)',
      border: 'var(--border)',
      rankColor: 'var(--text-muted)',
      avatarBg: 'rgba(255,255,255,0.04)',
      avatarBorder: 'var(--border)',
    };
  }

  return (
    <>
      <div className="space-y-2">
        {ranking.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <p style={{ color: 'var(--text-muted)' }}>
              Nenhum jogador pontuou ainda. Os palpites começarão a valer assim
              que os jogos iniciarem.
            </p>
          </div>
        ) : (
          ranking.map((entry, index) => {
            const initials = entry.name
              ? entry.name
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "?";

            const style = getRankStyle(index);

            return (
              <div
                key={index}
                onClick={() =>
                  setSelectedUser({ id: entry.user_id, name: entry.name })
                }
                className="flex items-center gap-4 sm:gap-5 rounded-lg p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:translate-y-[-1px]"
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                }}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10 sm:w-11 text-center">
                  <span
                    className={`font-bold ${index < 3 ? 'text-xl' : 'text-base'}`}
                    style={{ color: style.rankColor, fontFamily: 'var(--font-mono)' }}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Avatar */}
                <div
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm"
                  style={{
                    background: style.avatarBg,
                    border: `1px solid ${style.avatarBorder}`,
                    color: style.rankColor,
                  }}
                >
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-base sm:text-lg truncate`}
                      style={{ color: index === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >
                      {entry.name}
                    </span>
                    {index === 0 && (
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wide"
                        style={{
                          background: 'rgba(212, 168, 67, 0.1)',
                          color: 'var(--rank-1)',
                          border: '1px solid rgba(212, 168, 67, 0.2)',
                        }}
                      >
                        Líder
                      </span>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <span
                    className={`font-bold ${index < 3 ? 'text-xl' : 'text-base'}`}
                    style={{ color: style.rankColor, fontFamily: 'var(--font-mono)' }}
                  >
                    {entry.total_points}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide block sm:inline sm:ml-1" style={{ color: 'var(--text-muted)' }}>
                    pts
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div
            className="max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden animate-scale-up rounded-xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-hover)',
            }}
          >
            {/* Top accent */}
            <div className="h-[2px]" style={{ background: 'var(--accent)' }} />

            {/* Header */}
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
                  Palpites de
                </span>
                <h3 className="text-lg font-bold tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {selectedUser.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg transition-all cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
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

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <div
                    className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: 'var(--border)',
                      borderTopColor: 'var(--accent)',
                    }}
                  />
                  <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
                    Carregando palpites...
                  </p>
                </div>
              )}

              {error && (
                <div
                  className="text-sm py-4 px-6 rounded-lg text-center font-medium"
                  style={{
                    background: 'var(--live-bg)',
                    border: '1px solid var(--live-border)',
                    color: 'var(--live)',
                  }}
                >
                  {error}
                </div>
              )}

              {!loading && !error && guesses && (
                <div className="space-y-2">
                  {guesses.filter((m: any) => m.status === "FINISHED").length === 0 ? (
                    <p className="text-center py-10 text-sm italic" style={{ color: 'var(--text-muted)' }}>
                      Nenhuma partida finalizada encontrada para este usuário.
                    </p>
                  ) : (
                    guesses
                      .filter((m: any) => m.status === "FINISHED")
                      .map((m: any) => {
                        const formattedDate = new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(m.date));

                        return (
                          <div
                            key={m.id_match}
                            className="rounded-lg p-3 flex flex-col gap-2.5 transition-all duration-150"
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            {/* Date and status */}
                            <div className="flex items-center justify-between text-xs w-full" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                              <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                                {formattedDate}
                              </span>
                              <span
                                className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded"
                                style={{
                                  background: 'rgba(255,255,255,0.03)',
                                  color: 'var(--text-muted)',
                                  border: '1px solid var(--border)',
                                }}
                              >
                                Encerrado
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                              {/* Teams and Score */}
                              <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-4 sm:max-w-md">
                                <div className="flex items-center gap-2 text-right flex-1 justify-end min-w-0">
                                  <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                    {m.team_home}
                                  </span>
                                  <TeamCrest crest={m.home_crest} name={m.team_home} size={20} />
                                </div>

                                <div
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold shrink-0"
                                  style={{
                                    background: 'var(--bg-overlay)',
                                    color: 'var(--text-muted)',
                                    border: '1px solid var(--border)',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                >
                                  <span>{m.home_score ?? "-"}</span>
                                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>x</span>
                                  <span>{m.away_score ?? "-"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-left flex-1 justify-start min-w-0">
                                  <TeamCrest crest={m.away_crest} name={m.team_away} size={20} />
                                  <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                    {m.team_away}
                                  </span>
                                </div>
                              </div>

                              {/* User Guess */}
                              <div
                                className="min-w-[110px] text-center sm:text-right w-full sm:w-auto py-2 sm:py-0 rounded-lg sm:border-0"
                                style={{
                                  background: 'var(--bg-overlay)',
                                  border: '1px solid var(--border)',
                                }}
                              >
                                {m.guess ? (
                                  <div className="px-3 py-1">
                                    <span className="text-[9px] font-medium uppercase block" style={{ color: 'var(--text-muted)' }}>
                                      Palpite
                                    </span>
                                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                                      {m.guess.home_score} x {m.guess.away_score}
                                    </span>
                                    {m.guess.points !== null && (
                                      <span
                                        className="block text-[10px] font-bold mt-0.5"
                                        style={{
                                          color: m.guess.points === 2
                                            ? 'var(--points-perfect)'
                                            : m.guess.points === 1
                                              ? 'var(--points-correct)'
                                              : 'var(--points-zero)',
                                        }}
                                      >
                                        {m.guess.points === 2
                                          ? "+2 pts"
                                          : m.guess.points === 1
                                            ? "+1 pt"
                                            : "0 pts"}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs italic px-3 py-1" style={{ color: 'var(--text-muted)' }}>
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

            {/* Footer */}
            <div className="p-4 flex justify-end" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-[0.98]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-hover)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
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
