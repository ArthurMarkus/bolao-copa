"use client";

import { useState } from "react";
import { Match, Guess, MatchGuessWithUser } from "@/types";
import { getFlagEmoji } from "@/lib/flags";
import FlagEmoji from "@/components/flag-emoji";
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
    
    // Toggle state change
    setExpandedMatches((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));

    if (!isExpanded) {
      // Lazy load only if not fetched yet
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      {initialActiveMatchId && <ScrollToActiveMatch matchId={initialActiveMatchId} />}
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
          const guess = userGuesses.find((g) => g.match_id === m.id_match);
          const homeFlag = getFlagEmoji(m.team_home);
          const awayFlag = getFlagEmoji(m.team_away);
          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(m.date));

          const isExpanded = !!expandedMatches[m.id_match];
          const isLoading = !!loadingMatches[m.id_match];
          const error = errorsByMatch[m.id_match] || "";
          // Excluir o próprio palpite do usuário logado do dropdown de palpites (já exibido na barra principal do card)
          const matchGuesses = (guessesByMatch[m.id_match] || []).filter(
            (g) => g.user_id !== sessionUserId
          );

          // Proteção por data: jogo só aceita palpites se ainda não começou.
          // Não confiamos apenas no status da API pois ele pode mudar retroativamente.
          const isMatchOpen = new Date() < new Date(m.date);

          return (
            <div
              key={m.id_match}
              id={`match-${m.id_match}`}
              className={`transition-all duration-200 scroll-mt-6 rounded-xl border border-white/[0.04] p-5 shadow-lg bg-gradient-to-r relative overflow-hidden select-none ${
                isMatchOpen
                  ? "from-emerald-950/20 to-green-950/10 hover:border-emerald-500/30"
                  : m.status === "IN_PLAY"
                    ? "from-red-950/20 to-yellow-950/10 border-red-900/40 hover:border-red-500/30 shadow-red-950/10"
                    : m.status === "FINISHED"
                      ? "from-gray-900 to-gray-950 border-gray-800/80 hover:border-gray-700/80 shadow-md"
                      : "from-amber-900/20 to-yellow-900/10 border-amber-900/40 hover:border-amber-500/30 shadow-amber-950/10"
              } ${isExpanded ? "ring-1 ring-amber-500/20" : ""}`}
            >
              {/* Card Clickable Wrapper */}
              <div
                onClick={() => toggleMatch(m.id_match)}
                className="cursor-pointer"
              >
                {isMatchOpen ? (
                  // Jogo ainda não começou: exibe formulário de palpite
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/40 text-xs">
                      <span className="text-emerald-400/80 font-medium flex items-center gap-1.5">
                        📅 {formattedDate}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px]">
                          Palpite Aberto
                        </span>
                        <span className="text-gray-500 text-xs">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <GuessForm match={m} existingGuess={guess} plain />
                    </div>
                  </div>
                ) : (
                  // Other statuses (IN_PLAY, FINISHED, PAUSED)
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04] text-xs">
                      <span className={`${
                        m.status === "IN_PLAY"
                          ? "text-red-400/80"
                          : m.status === "PAUSED"
                            ? "text-amber-400/80"
                            : "text-gray-500"
                      } font-medium flex items-center gap-1.5`}>
                        📅 {formattedDate}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {m.status === "IN_PLAY" && (
                          <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                            Ao Vivo
                          </span>
                        )}
                        {m.status === "PAUSED" && (
                          <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            Pausado
                          </span>
                        )}
                        {m.status === "FINISHED" && (
                          <span className="bg-gray-850 text-gray-400 border border-gray-800 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px]">
                            Finalizado
                          </span>
                        )}
                        <span className="text-gray-500 text-xs">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
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
                        <div className={`flex flex-col items-center gap-0.5`}>
                          <div className={`flex items-center gap-2 sm:gap-3 bg-black/40 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border shrink-0 ${
                            m.status === "IN_PLAY" ? "border-red-900/30 bg-black/60" : "border-gray-800"
                          }`}>
                            <span className="text-white font-extrabold text-lg sm:text-2xl px-1 sm:px-2">
                              {m.home_score ?? 0}
                            </span>
                            <span className={`${m.status === "IN_PLAY" ? "text-amber-500" : "text-gray-500"} font-black text-sm sm:text-lg`}>
                              {m.status === "IN_PLAY" ? "-" : "x"}
                            </span>
                            <span className="text-white font-extrabold text-lg sm:text-2xl px-1 sm:px-2">
                              {m.away_score ?? 0}
                            </span>
                          </div>
                          {m.score_duration === "PENALTY_SHOOTOUT" && m.status === "FINISHED" && (
                            <span className="text-[10px] text-amber-400 font-bold tracking-wide uppercase bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-900/40">
                              Pênaltis
                            </span>
                          )}
                          {m.score_duration === "EXTRA_TIME" && m.status === "FINISHED" && (
                            <span className="text-[10px] text-blue-400 font-bold tracking-wide uppercase bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-900/40">
                              Prorrogação
                            </span>
                          )}
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

                      <GuessDisplay guess={guess} showPoints={m.status === "FINISHED"} />
                    </div>
                  </div>
                )}
              </div>

              {/* Guesses of participants (expanded section) */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-white/[0.06] animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
                      👥 Palpites dos Participantes
                    </span>
                    {!isLoading && !error && (
                      <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400 font-bold">
                        {matchGuesses.length} {matchGuesses.length === 1 ? "registro" : "registros"}
                      </span>
                    )}
                  </div>

                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-6 space-y-2">
                      <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                      <p className="text-gray-405 text-[10px] font-semibold animate-pulse">
                        Carregando palpites dos jogadores...
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-semibold">
                      ⚠️ {error}
                    </div>
                  )}

                  {!isLoading && !error && (
                    <>
                      {matchGuesses.length === 0 ? (
                        <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-5 text-center">
                          <p className="text-gray-500 text-xs italic">
                            {isMatchOpen
                              ? "Os palpites dos outros participantes ficarão visíveis assim que a partida começar!"
                              : "Nenhum participante realizou palpite para este jogo."}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                  isCurrentUser
                                    ? "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15"
                                    : "bg-white/[0.01] hover:bg-white/[0.02] border-white/[0.05]"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                    isCurrentUser
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : "bg-white/10 text-gray-300 border border-white/5"
                                  }`}>
                                    {initials}
                                  </div>
                                  <span className="text-white text-xs font-semibold truncate">
                                    {g.user_name} {isCurrentUser && <span className="text-amber-500 text-[10px] font-bold">(Você)</span>}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-amber-500 font-extrabold text-xs bg-black/40 px-2.5 py-1 rounded border border-white/5">
                                    {g.home_score} x {g.away_score}
                                  </span>
                                  {m.status === "FINISHED" && (
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                      g.points === 2
                                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                        : g.points === 1
                                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                          : "bg-gray-800 text-gray-500 border border-gray-700"
                                    }`}>
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

                  {isMatchOpen && !isLoading && !error && matchGuesses.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-3 text-center">
                      🔒 Os palpites dos outros participantes ficarão visíveis assim que a partida começar.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
