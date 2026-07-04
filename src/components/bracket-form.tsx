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

  const isRealWinner = realWinner === team
  const isCorrectPick = isSelected && isRealWinner

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
    <FlagEmoji emoji={getFlagEmoji(team)} title={team} size={16} className="shrink-0" />
    <span className="flex-1 truncate">{team}</span>
    {isCorrectPick && <span className="shrink-0 text-xs text-yellow-500">★</span>}
    {isSelected && !isCorrectPick && <span className="shrink-0 text-xs text-emerald-500">✓</span>}
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
  
  const realWinner = match.status === 'FINISHED' && match.final_home_score !== null && match.final_away_score !== null
  ? match.final_home_score > match.final_away_score ? match.team_home : match.team_away
  : null
  const hasWinner = !!picks[match.id_match];
  const userPick = picks[match.id_match]
  const userWasRight = userPick === realWinner

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
      {match.status === 'FINISHED' && userPick && stage !== 'LAST_32' && (
        <div className={`px-3 py-1.5 text-xs border-t border-gray-800/80 flex items-center gap-1.5 ${
          userWasRight ? "text-yellow-500 bg-yellow-500/5" : "text-gray-500 bg-transparent"
        }`}>
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
  const realWinner = match.status === 'FINISHED' && match.final_home_score !== null && match.final_away_score !== null
  ? match.final_home_score > match.final_away_score ? match.team_home : match.team_away
  : null

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

  // Ordenar por id_match garante ordem determinística igual à ordem do chaveamento na API
  const matchesByStage = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = matches
        .filter((m) => m.stage === stage)
        .sort((a, b) => a.id_match - b.id_match);
      return acc;
    },
    {} as Record<string, Match[]>,
  );

  const half = (stage: string) => {
    const arr = matchesByStage[stage];
    const mid = Math.floor(arr.length / 2);
    return { left: arr.slice(0, mid), right: arr.slice(mid) };
  };

  const last32 = half("LAST_32");
  const last16 = half("LAST_16");
  const quarters = half("QUARTER_FINALS");
  const semis = half("SEMI_FINALS");

  // Cada par de jogos consecutivos (i*2, i*2+1) alimenta o slot i da próxima ronda
  function getNextRoundMatches(currentMatches: Match[], nextMatches: Match[]) {
  return nextMatches.map((match, i) => ({
    ...match,
    team_home: match.status === 'FINISHED'
      ? match.team_home
      : picks[currentMatches[i * 2]?.id_match] ?? "A definir",
    team_away: match.status === 'FINISHED'
      ? match.team_away
      : picks[currentMatches[i * 2 + 1]?.id_match] ?? "A definir",
  }));
}

  const last16Left = getNextRoundMatches(last32.left, last16.left);
  const last16Right = getNextRoundMatches(last32.right, last16.right);
  const quartersLeft = getNextRoundMatches(last16Left, quarters.left);
  const quartersRight = getNextRoundMatches(last16Right, quarters.right);
  const semisLeft = getNextRoundMatches(quartersLeft, semis.left);
  const semisRight = getNextRoundMatches(quartersRight, semis.right);

  // A final recebe o vencedor da semi esquerda e o da semi direita
  const finalMatches = matchesByStage["FINAL"].map((match) => ({
    ...match,
    team_home: picks[semis.left[0]?.id_match] ?? "A definir",
    team_away: picks[semis.right[0]?.id_match] ?? "A definir",
  }));

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
            <BracketColumn {...colProps("LAST_32", last32.left)} />
            <BracketColumn {...colProps("LAST_16", last16Left)} />
            <BracketColumn {...colProps("QUARTER_FINALS", quartersLeft)} />
            <BracketColumn {...colProps("SEMI_FINALS", semisLeft)} />
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
            <BracketColumn {...colProps("LAST_32", last32.right)} />
            <BracketColumn {...colProps("LAST_16", last16Right)} />
            <BracketColumn {...colProps("QUARTER_FINALS", quartersRight)} />
            <BracketColumn {...colProps("SEMI_FINALS", semisRight)} />
          </div>
        </div>
      </div>
    </>
  );
}
