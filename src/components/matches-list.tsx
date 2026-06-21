"use client";

import { useState } from "react";
import { Match, Guess, MatchGuessWithUser } from "@/types";
import TeamCrest from "@/components/team-crest";
import GuessDisplay from "@/components/guess-display";
import GuessForm from "@/components/guess-form";
import ScrollToActiveMatch from "@/components/scroll-to-active-match";

type MatchesListProps = {
  confirmedMatches: Match[];
  userGuesses: Guess[];
  sessionUserId: number;
  initialActiveMatchId?: number;
};

export default function MatchesList({
  confirmedMatches,
  userGuesses,
  sessionUserId,
  initialActiveMatchId,
}: MatchesListProps) {
  const [expandedMatches, setExpandedMatches] = useState<Record<number, boolean>>({});
  const [guessesByMatch, setGuessesByMatch] = useState<Record<number, MatchGuessWithUser[]>>({});
  const [loadingMatches, setLoadingMatches] = useState<Record<number, boolean>>({});
  const [errorsByMatch, setErrorsByMatch] = useState<Record<number, string>>({});

  const toggleMatch = async (matchId: number) => {
    const isExpanded = !!expandedMatches[matchId];
    
    setExpandedMatches((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));

    if (!isExpanded) {
      if (guessesByMatch[matchId] === undefined) {
        setLoadingMatches((prev) => ({ ...prev, [matchId]: true }));
        setErrorsByMatch((prev) => ({ ...prev, [matchId]: "" }));
        try {
          const res = await fetch(`/api/guesses?matchId=${matchId}`);
          if (!res.ok) throw new Error("Erro ao carregar palpites");
          const data = await res.json();
          setGuessesByMatch((prev) => ({ ...prev, [matchId]: data }));
        } catch (err) {
          setErrorsByMatch((prev) => ({
            ...prev,
            [matchId]: "Não foi possível carregar os palpites da partida.",
          }));
        } finally {
          setLoadingMatches((prev) => ({ ...prev, [matchId]: false }));
        }
      }
    }
  };

  function getStatusConfig(status: string) {
    switch (status) {
      case "TIMED":
        return {
          label: "Aberto",
          dotColor: "var(--open)",
          textColor: "var(--open)",
          bg: "var(--open-bg)",
          border: "var(--open-border)",
          cardBorder: "var(--open-border)",
        };
      case "IN_PLAY":
        return {
          label: "Ao Vivo",
          dotColor: "var(--live)",
          textColor: "var(--live)",
          bg: "var(--live-bg)",
          border: "var(--live-border)",
          cardBorder: "var(--live-border)",
          pulse: true,
        };
      case "PAUSED":
        return {
          label: "Intervalo",
          dotColor: "var(--paused)",
          textColor: "var(--paused)",
          bg: "var(--paused-bg)",
          border: "var(--paused-border)",
          cardBorder: "var(--paused-border)",
          pulse: true,
        };
      case "FINISHED":
      default:
        return {
          label: "Encerrado",
          dotColor: "var(--finished)",
          textColor: "var(--finished)",
          bg: "rgba(92, 99, 112, 0.06)",
          border: "rgba(92, 99, 112, 0.15)",
          cardBorder: "var(--border)",
        };
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-2">
      {initialActiveMatchId && <ScrollToActiveMatch matchId={initialActiveMatchId} />}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Partidas
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Faça seus palpites antes do início de cada jogo
        </p>
      </div>

      <div className="space-y-3">
        {confirmedMatches.map((m) => {
          const guess = userGuesses.find((g) => g.match_id === m.id_match);
          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(m.date));

          const isExpanded = !!expandedMatches[m.id_match];
          const isLoading = !!loadingMatches[m.id_match];
          const error = errorsByMatch[m.id_match] || "";
          const matchGuesses = (guessesByMatch[m.id_match] || []).filter(
            (g) => g.user_id !== sessionUserId
          );
          const statusConfig = getStatusConfig(m.status);

          return (
            <div
              key={m.id_match}
              id={`match-${m.id_match}`}
              className="transition-all duration-200 scroll-mt-6 rounded-lg overflow-hidden select-none"
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${isExpanded ? 'var(--border-hover)' : statusConfig.cardBorder}`,
              }}
            >
              {/* Status strip on left */}
              <div className="flex">
                <div
                  className="w-[3px] shrink-0"
                  style={{ background: statusConfig.dotColor }}
                />
                <div className="flex-1 p-4">
                  {/* Card Header */}
                  <div
                    onClick={() => toggleMatch(m.id_match)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>
                        {formattedDate}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                          style={{
                            background: statusConfig.bg,
                            color: statusConfig.textColor,
                            border: `1px solid ${statusConfig.border}`,
                          }}
                        >
                          {(statusConfig as any).pulse && (
                            <span
                              className="w-1.5 h-1.5 rounded-full animate-live-pulse"
                              style={{ background: statusConfig.dotColor }}
                            />
                          )}
                          {statusConfig.label}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          style={{ color: 'var(--text-muted)' }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {m.status === "TIMED" ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <GuessForm match={m} existingGuess={guess} plain />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                        {/* Match Row */}
                        <div className="flex flex-row items-center justify-between flex-1 w-full gap-2 sm:gap-6">
                          {/* Home */}
                          <div className="flex items-center gap-2 sm:gap-3 justify-end flex-1 min-w-0">
                            <span className="font-semibold text-xs sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>
                              {m.team_home}
                            </span>
                            <TeamCrest crest={m.home_crest} name={m.team_home} size={28} className="sm:w-8 sm:h-8" />
                          </div>

                          {/* Score */}
                          <div
                            className="flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg shrink-0"
                            style={{
                              background: 'var(--bg-overlay)',
                              border: m.status === "IN_PLAY" ? '1px solid var(--live-border)' : '1px solid var(--border)',
                            }}
                          >
                            <span className="font-bold text-lg sm:text-2xl px-1 sm:px-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                              {m.home_score ?? 0}
                            </span>
                            <span className="font-bold text-sm sm:text-lg" style={{ color: 'var(--text-muted)' }}>
                              {m.status === "IN_PLAY" ? "–" : "x"}
                            </span>
                            <span className="font-bold text-lg sm:text-2xl px-1 sm:px-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                              {m.away_score ?? 0}
                            </span>
                          </div>

                          {/* Away */}
                          <div className="flex items-center gap-2 sm:gap-3 justify-start flex-1 min-w-0">
                            <TeamCrest crest={m.away_crest} name={m.team_away} size={28} className="sm:w-8 sm:h-8" />
                            <span className="font-semibold text-xs sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>
                              {m.team_away}
                            </span>
                          </div>
                        </div>

                        <GuessDisplay guess={guess} showPoints={m.status === "FINISHED"} />
                      </div>
                    )}
                  </div>

                  {/* Expanded: participant guesses */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 animate-fadeSlideUp" style={{ borderTop: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                          Palpites dos participantes
                        </span>
                        {!isLoading && !error && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded font-medium"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {matchGuesses.length}
                          </span>
                        )}
                      </div>

                      {isLoading && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-2">
                          <div
                            className="w-5 h-5 border-2 rounded-full animate-spin"
                            style={{
                              borderColor: 'var(--border)',
                              borderTopColor: 'var(--accent)',
                            }}
                          />
                          <p className="text-[11px] animate-pulse" style={{ color: 'var(--text-muted)' }}>
                            Carregando...
                          </p>
                        </div>
                      )}

                      {error && (
                        <div
                          className="text-xs py-3 px-4 rounded-lg text-center font-medium"
                          style={{
                            background: 'var(--live-bg)',
                            border: '1px solid var(--live-border)',
                            color: 'var(--live)',
                          }}
                        >
                          {error}
                        </div>
                      )}

                      {!isLoading && !error && (
                        <>
                          {matchGuesses.length === 0 ? (
                            <div
                              className="rounded-lg p-5 text-center"
                              style={{ background: 'rgba(255,255,255,0.02)' }}
                            >
                              <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                                {m.status === "TIMED"
                                  ? "Os palpites dos outros participantes ficarão visíveis assim que a partida começar."
                                  : "Nenhum participante realizou palpite para este jogo."}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {matchGuesses.map((g) => {
                                const initials = g.user_name
                                  ? g.user_name
                                      .split(" ")
                                      .filter(Boolean)
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)
                                      .toUpperCase()
                                  : "?";

                                const isCurrentUser = g.user_id === sessionUserId;

                                return (
                                  <div
                                    key={g.id}
                                    className="flex items-center justify-between p-2.5 rounded-lg transition-colors"
                                    style={{
                                      background: isCurrentUser ? 'var(--accent-subtle)' : 'rgba(255,255,255,0.02)',
                                      border: isCurrentUser ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                                    }}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center font-semibold text-[10px] shrink-0"
                                        style={{
                                          background: isCurrentUser ? 'var(--accent-subtle)' : 'rgba(255,255,255,0.06)',
                                          color: isCurrentUser ? 'var(--accent)' : 'var(--text-muted)',
                                          border: `1px solid ${isCurrentUser ? 'var(--accent-border)' : 'var(--border)'}`,
                                        }}
                                      >
                                        {initials}
                                      </div>
                                      <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                        {g.user_name}
                                        {isCurrentUser && (
                                          <span className="text-[10px] font-semibold ml-1" style={{ color: 'var(--accent)' }}>
                                            (Você)
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span
                                        className="font-bold text-xs px-2 py-0.5 rounded"
                                        style={{
                                          background: 'var(--bg-overlay)',
                                          color: 'var(--text-primary)',
                                          border: '1px solid var(--border)',
                                          fontFamily: 'var(--font-mono)',
                                        }}
                                      >
                                        {g.home_score} x {g.away_score}
                                      </span>
                                      {m.status === "FINISHED" && (
                                        <span
                                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                          style={{
                                            background: g.points === 2 ? 'rgba(212, 168, 67, 0.1)' : g.points === 1 ? 'rgba(34, 160, 101, 0.1)' : 'rgba(255,255,255,0.03)',
                                            color: g.points === 2 ? 'var(--points-perfect)' : g.points === 1 ? 'var(--points-correct)' : 'var(--points-zero)',
                                            border: `1px solid ${g.points === 2 ? 'rgba(212, 168, 67, 0.2)' : g.points === 1 ? 'rgba(34, 160, 101, 0.2)' : 'var(--border)'}`,
                                          }}
                                        >
                                          {g.points === 2 ? "+2" : g.points === 1 ? "+1" : "0"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}

                      {m.status === "TIMED" && !isLoading && !error && matchGuesses.length > 0 && (
                        <p className="text-[10px] mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                          Os palpites dos outros participantes ficarão visíveis assim que a partida começar.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
