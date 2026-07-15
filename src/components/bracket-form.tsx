"use client";

import { useEffect, useRef, useState } from "react";

import FlagEmoji from "@/components/flag-emoji";
import { getFlagEmoji } from "@/lib/flags";
import { Match } from "@/types";

// ─── Labels ───────────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<string, string> = {
  LAST_32: "16avos",
  LAST_16: "Oitavas",
  QUARTER_FINALS: "Quartas",
  SEMI_FINALS: "Semis",
  FINAL: "Final",
};

// ─── TeamButton ───────────────────────────────────────────────────────────────

function TeamButton({
  match,
  team,
  isHome,
  picks,
  onPick,
  isDragging,
  locked,
  realWinner,
}: {
  match: Match;
  team: string;
  isHome: boolean;
  picks: Record<number, string>;
  onPick: (matchId: number, team: string) => void;
  isDragging: React.RefObject<boolean>;
  locked: boolean;
  realWinner: string | null;
}) {
  const isSelected = picks[match.id_match] === team;
  const isUndefined = team === "A definir";

  const isRealWinner = realWinner === team;
  const isCorrectPick = isSelected && isRealWinner;

  return (
    <button
      disabled={locked || isUndefined}
      onClick={() => {
        if (isDragging.current || locked || isUndefined) return;
        onPick(match.id_match, team);
      }}
      className={[
        "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium transition-all duration-150",
        isHome ? "border-b border-gray-800/80" : "",
        isCorrectPick
          ? "bg-yellow-500/20 text-yellow-400"
          : isRealWinner
            ? "bg-yellow-500/10 text-yellow-600"
            : isSelected
              ? "bg-emerald-500/20 text-emerald-400"
              : locked || isUndefined
                ? "cursor-not-allowed text-gray-600"
                : "cursor-pointer text-gray-300 hover:bg-white/5",
      ].join(" ")}
    >
      <FlagEmoji
        emoji={getFlagEmoji(team)}
        title={team}
        size={16}
        className="shrink-0"
      />
      <span className="flex-1 truncate">{team}</span>
      {isCorrectPick && (
        <span className="shrink-0 text-xs text-yellow-500">★</span>
      )}
      {isSelected && !isCorrectPick && (
        <span className="shrink-0 text-xs text-emerald-500">✓</span>
      )}
    </button>
  );
}

// ─── MatchCard ────────────────────────────────────────────────────────────────

function MatchCard({
  match,
  picks,
  onPick,
  isDragging,
  locked,
  stage,
}: {
  match: Match;
  picks: Record<number, string>;
  onPick: (matchId: number, team: string) => void;
  isDragging: React.RefObject<boolean>;
  locked: boolean;
  stage: string;
}) {
  const realWinner =
    match.status === "FINISHED" &&
    match.final_home_score !== null &&
    match.final_away_score !== null
      ? match.final_home_score > match.final_away_score
        ? match.team_home
        : match.team_away
      : null;
  const hasWinner = !!picks[match.id_match];
  const userPick = picks[match.id_match];
  const userWasRight = userPick === realWinner;

  return (
    <div
      className={[
        "w-48 overflow-hidden rounded-xl bg-gray-900 transition-all duration-200",
        hasWinner
          ? "border border-emerald-800/40 shadow-sm shadow-emerald-950/30"
          : "border border-gray-800",
      ].join(" ")}
    >
      <TeamButton
        match={match}
        team={match.team_home}
        isHome
        picks={picks}
        onPick={onPick}
        isDragging={isDragging}
        locked={locked}
        realWinner={realWinner}
      />
      <TeamButton
        match={match}
        team={match.team_away}
        isHome={false}
        picks={picks}
        onPick={onPick}
        isDragging={isDragging}
        locked={locked}
        realWinner={realWinner}
      />
      {match.status === "FINISHED" && userPick && stage !== "LAST_32" && (
        <div
          className={`px-3 py-1.5 text-xs border-t border-gray-800/80 flex items-center gap-1.5 ${
            userWasRight
              ? "text-yellow-500 bg-yellow-500/5"
              : "text-gray-500 bg-transparent"
          }`}
        >
          <span>{userWasRight ? "★" : "✗"}</span>
          <span>Seu palpite: {userPick}</span>
        </div>
      )}
    </div>
  );
}

// ─── BracketColumn ────────────────────────────────────────────────────────────
// Renders a single round column. Matches are spread evenly with justify-around,
// exactly as before — no pair grouping so spacing stays natural.

function BracketColumn({
  stage,
  matches,
  picks,
  onPick,
  isDragging,
  locked,
}: {
  stage: string;
  matches: Match[];
  picks: Record<number, string>;
  onPick: (matchId: number, team: string) => void;
  isDragging: React.RefObject<boolean>;
  locked: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500">
        {STAGE_LABELS[stage]}
      </p>
      <div className="flex flex-1 flex-col justify-around gap-8">
        {matches.map((match) => (
          <MatchCard
            key={match.id_match}
            match={match}
            picks={picks}
            onPick={onPick}
            isDragging={isDragging}
            locked={locked}
            stage={stage}
          />
        ))}
      </div>
    </div>
  );
}

// ─── FinalCard ────────────────────────────────────────────────────────────────
// The match card is always visible. When a champion is picked, a compact
// golden badge slides in ABOVE the card without pushing it down.

function FinalCard({
  match,
  picks,
  onPick,
  isDragging,
  locked,
}: {
  match: Match;
  picks: Record<number, string>;
  onPick: (matchId: number, team: string) => void;
  isDragging: React.RefObject<boolean>;
  locked: boolean;
}) {
  const champion = picks[match.id_match];
  const realWinner =
    match.status === "FINISHED" &&
    match.final_home_score !== null &&
    match.final_away_score !== null
      ? match.final_home_score > match.final_away_score
        ? match.team_home
        : match.team_away
      : null;

  return (
    <div className="relative px-2">
      {/* Label + champion badge — absolutely above the match card, no layout impact */}
      <div className="absolute bottom-full left-0 right-0 flex flex-col items-center gap-1.5 pb-3">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500">
          {STAGE_LABELS.FINAL}
        </p>
        {champion && (
          <div className="flex w-52 items-center gap-3 rounded-xl border border-yellow-700/40 bg-gradient-to-r from-yellow-900/40 to-amber-900/20 px-4 py-2.5 shadow-md shadow-yellow-950/30">
            <span className="animate-bounce text-2xl">🏆</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/70">
                Campeão
              </p>
              <div className="flex items-center gap-1.5">
                <FlagEmoji
                  emoji={getFlagEmoji(champion)}
                  title={champion}
                  size={16}
                  className="shrink-0"
                />
                <p className="truncate text-sm font-bold text-white">
                  {champion}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match card — in normal flow, aligns with semi-finals via items-center on parent */}
      <div className="w-52 overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
        <TeamButton
          match={match}
          team={match.team_home}
          isHome
          picks={picks}
          onPick={onPick}
          isDragging={isDragging}
          locked={locked}
          realWinner={realWinner}
        />
        <TeamButton
          match={match}
          team={match.team_away}
          isHome={false}
          picks={picks}
          onPick={onPick}
          isDragging={isDragging}
          locked={locked}
          realWinner={realWinner}
        />
      </div>
    </div>
  );
}

// ─── BracketForm ──────────────────────────────────────────────────────────────

type BracketFormProps = {
  matches: Match[];
  existingPicks: Record<number, string>;
  locked: boolean;
};

export default function BracketForm({
  matches,
  existingPicks,
  locked,
}: BracketFormProps) {
  const [picks, setPicks] = useState<Record<number, string>>(existingPicks);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      isDragging.current = false;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.getBoundingClientRect().left;
      scrollLeft = el.scrollLeft;
      e.preventDefault();
    };
    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "grab";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      isDragging.current = true;
      const x = e.pageX - el.getBoundingClientRect().left;
      el.scrollLeft = scrollLeft - (x - startX);
    };

    el.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  async function pickWinner(matchId: number, team: string) {
    setPicks((prev) => ({ ...prev, [matchId]: team }));
    await fetch("/api/bracket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, predictedWinner: team }),
    });
  }

  const STAGES = [
    "LAST_32",
    "LAST_16",
    "QUARTER_FINALS",
    "SEMI_FINALS",
    "FINAL",
  ];

  // Ordenar por id_match dentro de cada fase
  const matchesByStage = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = matches
        .filter((m) => m.stage === stage)
        .sort((a, b) => a.id_match - b.id_match);
      return acc;
    },
    {} as Record<string, Match[]>,
  );

  // Mapeamento explícito do chaveamento real da Copa 2026.
  // Cada entrada [a, b] indica quais dois jogos da rodada anterior alimentam
  // o slot correspondente desta rodada (na ordem em que aparecem no bracket).
  //
  // LAST_16 (por id_match): 375, 376, 377, 378, 379, 380, 381, 382
  // LAST_32 feeders (por id_match):
  //   375 ← [415, 416]   376 ← [417, 418]
  //   377 ← [423, 424]   378 ← [425, 426]
  //   379 ← [419, 420]   380 ← [421, 422]
  //   381 ← [427, 428]   382 ← [429, 430]
  //
  // QUARTER_FINALS (por id_match): 383, 384, 385, 386
  // LAST_16 feeders:
  //   383 ← [375, 376]   384 ← [379, 380]
  //   385 ← [377, 378]   386 ← [381, 382]
  //
  // SEMI_FINALS (por id_match): 387, 388
  // QUARTER_FINALS feeders:
  //   387 ← [383, 384]   388 ← [385, 386]
  //
  // FINAL (id 390): ← [387, 388]

  // Índices dentro do array ordenado de cada fase (0-based)
  // LAST_32 indices: 0=415, 1=416, 2=417, 3=418, 4=419, 5=420,
  //                  6=421, 7=422, 8=423, 9=424, 10=425, 11=426,
  //                  12=427, 13=428, 14=429, 15=430
  // LAST_16 indices: 0=375, 1=376, 2=377, 3=378, 4=379, 5=380, 6=381, 7=382

  const byId = (arr: Match[], id: number) => arr.find((m) => m.id_match === id);

  // Helper: devolve o pick ou "A definir" para um jogo da rodada anterior
  const pickOf = (match: Match | undefined) =>
    match ? (picks[match.id_match] ?? "A definir") : "A definir";

  // Helper: se o jogo já tem os times definidos pela API, usa-os;
  // caso contrário, deriva do pick da rodada anterior.
  const resolveTeam = (
    apiTeam: string,
    feederMatch: Match | undefined,
  ): string => {
    if (apiTeam && apiTeam !== "A definir") return apiTeam;
    return pickOf(feederMatch);
  };

  const l32 = matchesByStage["LAST_32"];
  const l16 = matchesByStage["LAST_16"];
  const qf = matchesByStage["QUARTER_FINALS"];
  const sf = matchesByStage["SEMI_FINALS"];
  const fin = matchesByStage["FINAL"];

  // ── Chaveamento real (por ID de partida) ──────────────────────────────────
  // Left side do bracket (top)
  const left32Top = [
    byId(l32, 537415),
    byId(l32, 537416),
    byId(l32, 537417),
    byId(l32, 537418),
  ].filter(Boolean) as Match[];

  const left32Bottom = [
    byId(l32, 537423),
    byId(l32, 537424),
    byId(l32, 537425),
    byId(l32, 537426),
  ].filter(Boolean) as Match[];

  // Right side do bracket (top)
  const right32Top = [
    byId(l32, 537419),
    byId(l32, 537420),
    byId(l32, 537421),
    byId(l32, 537422),
  ].filter(Boolean) as Match[];

  const right32Bottom = [
    byId(l32, 537427),
    byId(l32, 537428),
    byId(l32, 537429),
    byId(l32, 537430),
  ].filter(Boolean) as Match[];

  // LAST_16 — resolve times: API se disponível, senão pick da rodada anterior
  const mkL16 = (
    match: Match | undefined,
    f0: Match | undefined,
    f1: Match | undefined,
  ): Match | undefined => {
    if (!match) return undefined;
    return {
      ...match,
      team_home: resolveTeam(match.team_home, f0),
      team_away: resolveTeam(match.team_away, f1),
    };
  };

  const l16_375 = mkL16(
    byId(l16, 537375),
    byId(l32, 537415),
    byId(l32, 537416),
  );
  const l16_376 = mkL16(
    byId(l16, 537376),
    byId(l32, 537417),
    byId(l32, 537418),
  );
  const l16_377 = mkL16(
    byId(l16, 537377),
    byId(l32, 537423),
    byId(l32, 537424),
  );
  const l16_378 = mkL16(
    byId(l16, 537378),
    byId(l32, 537425),
    byId(l32, 537426),
  );
  const l16_379 = mkL16(
    byId(l16, 537379),
    byId(l32, 537419),
    byId(l32, 537420),
  );
  const l16_380 = mkL16(
    byId(l16, 537380),
    byId(l32, 537421),
    byId(l32, 537422),
  );
  const l16_381 = mkL16(
    byId(l16, 537381),
    byId(l32, 537427),
    byId(l32, 537428),
  );
  const l16_382 = mkL16(
    byId(l16, 537382),
    byId(l32, 537429),
    byId(l32, 537430),
  );

  const leftL16Top = [l16_375, l16_376].filter(Boolean) as Match[];
  const leftL16Bottom = [l16_377, l16_378].filter(Boolean) as Match[];
  const rightL16Top = [l16_379, l16_380].filter(Boolean) as Match[];
  const rightL16Bottom = [l16_381, l16_382].filter(Boolean) as Match[];

  // QUARTER_FINALS
  const mkQF = (
    match: Match | undefined,
    f0: Match | undefined,
    f1: Match | undefined,
  ): Match | undefined => {
    if (!match) return undefined;
    return {
      ...match,
      team_home: resolveTeam(match.team_home, f0),
      team_away: resolveTeam(match.team_away, f1),
    };
  };

  const qf_383 = mkQF(byId(qf, 537383), l16_375, l16_376);
  const qf_384 = mkQF(byId(qf, 537384), l16_379, l16_380);
  const qf_385 = mkQF(byId(qf, 537385), l16_377, l16_378);
  const qf_386 = mkQF(byId(qf, 537386), l16_381, l16_382);

  const leftQF = [qf_383].filter(Boolean) as Match[];
  const leftQFBottom = [qf_385].filter(Boolean) as Match[];
  const rightQF = [qf_384].filter(Boolean) as Match[];
  const rightQFBottom = [qf_386].filter(Boolean) as Match[];

  // SEMI_FINALS
  const mkSF = (
    match: Match | undefined,
    f0: Match | undefined,
    f1: Match | undefined,
  ): Match | undefined => {
    if (!match) return undefined;
    return {
      ...match,
      team_home: resolveTeam(match.team_home, f0),
      team_away: resolveTeam(match.team_away, f1),
    };
  };

  const sf_387 = mkSF(byId(sf, 537387), qf_383, qf_384);
  const sf_388 = mkSF(byId(sf, 537388), qf_385, qf_386);

  const leftSF = [sf_387].filter(Boolean) as Match[];
  const rightSF = [sf_388].filter(Boolean) as Match[];

  // FINAL
  const finalBase = fin[0];
  const finalMatches: Match[] = finalBase
    ? [
        {
          ...finalBase,
          team_home: resolveTeam(finalBase.team_home, sf_387),
          team_away: resolveTeam(finalBase.team_away, sf_388),
        },
      ]
    : [];

  // Grupos para o layout visual do bracket
  // Left side: top half (415,416,417,418 → 375,376 → 383) e bottom half (423,424,425,426 → 377,378 → 385)
  // Right side: top half (419,420,421,422 → 379,380 → 384) e bottom half (427,428,429,430 → 381,382 → 386)
  // Semis: sf_387 (left), sf_388 (right)
  const left32 = [...left32Top, ...left32Bottom];
  const leftL16 = [...leftL16Top, ...leftL16Bottom];
  const leftQFAll = [...leftQF, ...leftQFBottom];
  const right32 = [...right32Top, ...right32Bottom];
  const rightL16 = [...rightL16Top, ...rightL16Bottom];
  const rightQFAll = [...rightQF, ...rightQFBottom];

  const colProps = (stage: string, matchList: Match[]) => ({
    stage,
    matches: matchList,
    picks,
    onPick: pickWinner,
    isDragging,
    locked,
  });

  return (
    <>
      <div
        ref={scrollRef}
        className="hide-scrollbar cursor-grab select-none overflow-auto active:cursor-grabbing"
        style={{
          height: "calc(100vh - 120px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex min-w-max items-stretch gap-8 p-4">
          {/* ── Left side ── */}
          <div className="flex items-stretch gap-8">
            <BracketColumn {...colProps("LAST_32", left32)} />
            <BracketColumn {...colProps("LAST_16", leftL16)} />
            <BracketColumn {...colProps("QUARTER_FINALS", leftQFAll)} />
            <BracketColumn {...colProps("SEMI_FINALS", leftSF)} />
          </div>

          {/* ── Center: Final ── */}
          <div className="flex items-center">
            {finalMatches[0] && (
              <FinalCard
                match={finalMatches[0]}
                picks={picks}
                onPick={pickWinner}
                isDragging={isDragging}
                locked={locked}
              />
            )}
          </div>

          {/* ── Right side (mirrored) ── */}
          <div className="flex flex-row-reverse items-stretch gap-8">
            <BracketColumn {...colProps("LAST_32", right32)} />
            <BracketColumn {...colProps("LAST_16", rightL16)} />
            <BracketColumn {...colProps("QUARTER_FINALS", rightQFAll)} />
            <BracketColumn {...colProps("SEMI_FINALS", rightSF)} />
          </div>
        </div>
      </div>
    </>
  );
}
